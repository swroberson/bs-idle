import { BALANCE } from "../content/balance";
import { BUILDINGS } from "../content/buildings";
import { EVENTS } from "../content/events";
import { RESEARCH } from "../content/research";
import { RESOURCES } from "../content/resources";
import type { BuildingId, Cost, EventId, GameState, ResearchId, ResourceId } from "./types";

export function availableWorkers(state: GameState): number {
  return state.population - state.jobs.forager - state.jobs.lamplighter;
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

export function buildingCost(state: GameState, id: BuildingId): Cost {
  const building = BUILDINGS[id];
  return Object.fromEntries(Object.entries(building.cost).map(([resource, amount]) => [resource, Math.ceil(amount * building.costGrowth ** state.buildings[id])])) as Cost;
}

export function buildingRequirements(state: GameState, id: BuildingId): string[] {
  if (state.buildings[id] >= BUILDINGS[id].maxLevel) return ["Opening limit reached"];
  const requirements = costRequirements(state, buildingCost(state, id));
  if (state.lifetimeAuthority < BALANCE.worksAuthority) requirements.unshift(`Earn ${BALANCE.worksAuthority} lifetime Authority to open Works`);
  if (id === "oil-press" && state.buildings.fields === 0) requirements.unshift("Construct Fields first");
  return requirements;
}

export function eventRequirements(state: GameState, id: EventId): string[] {
  const event = EVENTS[id];
  const requirements = costRequirements(state, event.cost);
  if (state.resources.food <= 0) requirements.unshift("Restore Food stores first");
  if (state.population + event.population > BALANCE.populationCap) requirements.unshift("Inhabitant register is full");
  return requirements;
}

export function researchRequirements(state: GameState, id: ResearchId): string[] {
  if (state.research.includes(id)) return ["Examination complete"];
  const requirements = costRequirements(state, RESEARCH[id].cost);
  if (!state.chronicle.includes("lamp-complaint")) requirements.unshift("Await the lamplighter’s report");
  return requirements;
}
