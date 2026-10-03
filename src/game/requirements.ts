import { BALANCE } from "../content/balance";
import { BUILDINGS } from "../content/buildings";
import { JOBS } from "../content/jobs";
import { EVENTS } from "../content/events";
import { RESEARCH } from "../content/research";
import { EXPEDITIONS } from "../content/expeditions";
import { RESOURCES } from "../content/resources";
import { AWAKENING } from "../content/awakening";
import type { BuildingId, ContentRequirements, Cost, EventDefinition, EventId, ExpeditionId, GameState, JobId, ResearchDefinition, ResearchId, ResourceId } from "./types";

export function availableWorkers(state: GameState): number {
  return state.population - Object.values(state.jobs).reduce((sum, count) => sum + count, 0) - (state.activeExpedition?.workers ?? 0);
}

export function costText(cost: Cost): string {
  return (Object.entries(cost) as [ResourceId, number][]).map(([id, amount]) => `${amount} ${RESOURCES[id].name}`).join(" / ") || "No cost";
}

export function costRequirements(state: GameState, cost: Cost): string[] {
  return (Object.entries(cost) as [ResourceId, number][]).filter(([id, amount]) => state.resources[id] < amount)
    .map(([id, amount]) => `${RESOURCES[id].name} ${state.resources[id].toFixed(1)} / ${amount}`);
}

export function payCost(state: GameState, cost: Cost): GameState {
  const resources = { ...state.resources };
  for (const [id, amount] of Object.entries(cost) as [ResourceId, number][]) resources[id] -= amount;
  return { ...state, resources };
}

export function prerequisiteRequirements(state: GameState, requirements: ContentRequirements): string[] {
  const unmet: string[] = [];
  for (const [id, level] of Object.entries(requirements.buildings ?? {})) {
    if (state.buildings[id as BuildingId] < level) unmet.push(`Requires ${BUILDINGS[id as BuildingId].name} level ${level}`);
  }
  for (const id of requirements.research ?? []) if (!state.research.includes(id as ResearchId)) unmet.push(`Complete ${RESEARCH[id as ResearchId].name}`);
  for (const id of requirements.chronicle ?? []) if (!state.chronicle.includes(id as GameState["chronicle"][number])) unmet.push("Await the lamplighter’s report");
  for (const id of requirements.expeditions ?? []) if (!state.completedExpeditions.includes(id as ExpeditionId)) unmet.push(`Return from ${EXPEDITIONS[id as ExpeditionId].name}`);
  if (state.lifetimeAuthority < (requirements.lifetimeAuthority ?? 0)) unmet.push(`Earn ${requirements.lifetimeAuthority} lifetime Authority to open Works`);
  return unmet;
}

export function constructionDiscount(state: GameState) {
  const perLaborer = state.research.reduce((discount, id) => {
    const study: ResearchDefinition = RESEARCH[id];
    return discount + (study.modifiers?.laborerDiscountBonus ?? 0);
  }, BALANCE.laborerCoinDiscount as number);
  const laborer = Math.min(BALANCE.laborerDiscountCap, state.jobs.laborer * perLaborer);
  const studyMultiplier = state.research.reduce((multiplier, id) => {
    const study: ResearchDefinition = RESEARCH[id];
    return multiplier * (study.modifiers?.constructionCoinMultiplier ?? 1);
  }, 1);
  return { perLaborer, laborer, study: 1 - studyMultiplier, coinMultiplier: (1 - laborer) * studyMultiplier };
}

export function buildingCost(state: GameState, id: BuildingId): Cost {
  const building = BUILDINGS[id];
  const { coinMultiplier } = constructionDiscount(state);
  return Object.fromEntries(Object.entries(building.cost).map(([resource, amount]) => {
    const cost = amount * building.costGrowth ** state.buildings[id] * (resource === "coin" ? coinMultiplier : 1);
    // Remove floating-point dust at whole Coin boundaries before rounding upward.
    return [resource, Math.ceil(cost - Number.EPSILON * cost)];
  })) as Cost;
}

export function buildingRequirements(state: GameState, id: BuildingId): string[] {
  if (state.buildings[id] >= BUILDINGS[id].maxLevel) return ["Construction limit reached"];
  return [...prerequisiteRequirements(state, BUILDINGS[id].requirements), ...costRequirements(state, buildingCost(state, id))];
}

export function eventChoices(id: EventId) {
  const event: EventDefinition = EVENTS[id];
  return event.choices ?? [{ id: "accept", label: event.choice, cost: event.cost, rewards: {} }];
}

export function eventRequirements(state: GameState, id: EventId, choice?: string): string[] {
  const event: EventDefinition = EVENTS[id];
  const response = eventChoices(id).find(item => item.id === (choice ?? (event.choices ? "" : "accept")));
  if (!response) return ["Select a valid response"];
  const requirements = costRequirements(state, response.cost);
  if (state.resources.food <= 0) requirements.unshift("Restore Food stores first");
  if (state.population + event.population > BALANCE.populationCap) requirements.unshift("Inhabitant register is full");
  return requirements;
}

export function researchRequirements(state: GameState, id: ResearchId): string[] {
  if (state.research.includes(id)) return ["Investigation complete"];
  return [...prerequisiteRequirements(state, RESEARCH[id].requirements), ...costRequirements(state, RESEARCH[id].cost)];
}

export function jobUnlocked(state: GameState, id: JobId): boolean {
  return prerequisiteRequirements(state, JOBS[id].requirements).length === 0;
}

export function expeditionCost(state: GameState, id: ExpeditionId, workers: number): Cost {
  const multiplier = state.research.reduce((value, id) => {
    const study: ResearchDefinition = RESEARCH[id];
    return value * (study.modifiers?.expeditionFoodMultiplier ?? 1);
  }, 1);
  const cost = EXPEDITIONS[id].foodPerWorker * workers * multiplier;
  return { food: Math.ceil(cost - Number.EPSILON * cost) };
}

export function expeditionRequirements(state: GameState, id: ExpeditionId, workers: number): string[] {
  const unmet = prerequisiteRequirements(state, EXPEDITIONS[id].requirements);
  if (!Number.isInteger(workers) || workers < 1 || workers > BALANCE.expeditionMaxWorkers) return [...unmet, "Assign 1–3 inhabitants"];
  if (state.activeExpedition) unmet.push("A party is already away");
  if (EXPEDITIONS[id].staffing === "scavenger") {
    if (state.jobs.scavenger < workers) unmet.push(`Assigned Scavengers ${state.jobs.scavenger} / ${workers}; assign workers in Ward`);
  } else if (availableWorkers(state) < workers) unmet.push(`Available inhabitants ${availableWorkers(state)} / ${workers}; release workers in Ward`);
  return [...unmet, ...costRequirements(state, expeditionCost(state, id, workers))];
}

export function resourceVisible(state: GameState, id: ResourceId): boolean {
  if (id === "current") return state.awakenedAt !== null;
  if (state.resources[id] > 0) return true;
  switch (id) {
    case "coin": return state.research.includes("ledger-keeping");
    case "knowledge": return state.buildings["scrivener-house"] > 0;
    case "relics": return state.buildings["ruined-cistern"] > 0;
    default: return true;
  }
}

export function awakeningRequirements(state: GameState): string[] {
  return state.awakenedAt !== null ? ["Junction already active"] : prerequisiteRequirements(state, AWAKENING.requirements);
}
