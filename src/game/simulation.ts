import { BALANCE } from "../content/balance";
import { JOBS } from "../content/jobs";
import { BUILDINGS } from "../content/buildings";
import { RESEARCH } from "../content/research";
import { AWAKENING } from "../content/awakening";
import { queueEvents, secondsUntilEvent } from "./progression";
import { completeExpedition } from "./expeditions";
import { resourceCapacity, storedAmount } from "./storage";
import { completeConstruction, constructionRate, constructionWork } from "./construction";
import type { GameState, Modifiers, ResearchDefinition, ResourceId, ReturnSummary } from "./types";
import { LAMPS } from "../content/lamps";
import { advanceLamps, lampStatus, prepareLamps } from "./lamps";

// Production bonuses multiply after the base worker + building output is added.
export function economyModifiers(state: GameState): Required<Pick<Modifiers, "foodMultiplier" | "oilDemandMultiplier" | "oilOutputMultiplier" | "knowledgeMultiplier">> {
  return state.research.reduce((modifiers, id) => {
    const research: ResearchDefinition = RESEARCH[id];
    return { foodMultiplier: modifiers.foodMultiplier * (research.modifiers?.foodMultiplier ?? 1),
      oilDemandMultiplier: modifiers.oilDemandMultiplier * (research.modifiers?.oilDemandMultiplier ?? 1),
      oilOutputMultiplier: modifiers.oilOutputMultiplier * (research.modifiers?.oilOutputMultiplier ?? 1),
      knowledgeMultiplier: modifiers.knowledgeMultiplier * (research.modifiers?.knowledgeMultiplier ?? 1) };
  }, { foodMultiplier: 1, oilDemandMultiplier: 1, oilOutputMultiplier: 1, knowledgeMultiplier: 1 });
}

export function economyRates(state: GameState) {
  const modifiers = economyModifiers(state);
  const foodOutput = state.jobs.forager * (JOBS.forager.foodPerSecond + state.buildings.fields * BUILDINGS.fields.foodPerForager) * modifiers.foodMultiplier;
  const foodNet = foodOutput - state.population * BALANCE.foodPerInhabitant;
  // Foragers keep full output, including at zero Food, so recovery never requires clicking.
  const starving = state.resources.food <= 0 && foodNet <= 0;
  const efficiency = starving ? BALANCE.shortageOutputMultiplier : 1;
  const oilOutput = state.buildings["oil-press"] * BUILDINGS["oil-press"].oilPerSecond * efficiency * modifiers.oilOutputMultiplier;
  // Fuel belongs to burning fixtures, not workers. Food shortages never reduce fuel demand.
  const lamps = lampStatus(state, oilOutput, modifiers.oilDemandMultiplier);
  const authorityProduction = lamps.maintained / LAMPS.perLamplighter * (JOBS.lamplighter.authorityPerSecond + state.buildings["lamp-house"] * BUILDINGS["lamp-house"].authorityPerLamplighter) * efficiency * lamps.fuelFraction;
  const net: Record<ResourceId, number> = {
    food: state.resources.food <= 0 ? Math.max(0, foodNet) : foodNet,
    oil: oilOutput - lamps.oilDraw,
    authority: state.resources.authority > 0 ? authorityProduction - lamps.authorityLoss : Math.max(0, authorityProduction - lamps.authorityLoss),
    coin: state.buildings["market-stall"] * BUILDINGS["market-stall"].coinPerSecond * efficiency,
    knowledge: state.jobs.scrivener * JOBS.scrivener.knowledgePerSecond * efficiency * modifiers.knowledgeMultiplier,
    relics: 0,
    current: state.awakenedAt !== null ? AWAKENING.currentPerSecond * efficiency : 0,
  };
  for (const id of Object.keys(net) as ResourceId[]) {
    if (net[id] > 0 && state.resources[id] >= resourceCapacity(state, id)) net[id] = 0;
  }
  return { starving, efficiency, lamps, authorityProduction, net };
}

export function reconcile(state: GameState, now: number): { state: GameState; summary: ReturnSummary } {
  const valid = Number.isSafeInteger(now) && now >= 0;
  const elapsedMs = valid ? Math.max(0, now - state.lastSimulatedAt) : 0;
  const productionMs = Math.min(elapsedMs, BALANCE.offlineProductionCapMs);
  let next = queueEvents(state);
  let cursor = state.lastSimulatedAt;
  const productionEnd = cursor + productionMs;
  const completedExpeditions: ReturnSummary["completedExpeditions"] = [];
  const completedConstruction: ReturnSummary["completedConstruction"] = [];
  const lampSummary: ReturnSummary["lamps"] = { before: state.lamps.lit, after: state.lamps.lit,
    extinguished: 0, relit: 0, authorityLost: 0, darknessMs: 0 };
  const finishParty = (at: number) => {
    const destination = next.activeExpedition?.destination;
    const finished = completeExpedition(next, at);
    if (finished !== next && destination) completedExpeditions.push(destination);
    next = finished;
  };
  if (elapsedMs > 0) finishParty(cursor);
  while (cursor < productionEnd) {
    const { net, efficiency, authorityProduction, lamps } = economyRates(next);
    next = prepareLamps(next, lamps);
    const workRate = constructionRate(next, efficiency);
    let seconds = Math.min((productionEnd - cursor) / 1000, secondsUntilEvent(next, net, authorityProduction));
    seconds = Math.min(seconds, lamps.secondsUntilChange);
    if (next.lamps.lit < LAMPS.count && next.lamps.darknessSeconds < LAMPS.darknessGraceSeconds) {
      seconds = Math.min(seconds, LAMPS.darknessGraceSeconds - next.lamps.darknessSeconds);
    }
    if (net.oil > 0 && next.resources.oil < LAMPS.relightReserveOil) {
      seconds = Math.min(seconds, (LAMPS.relightReserveOil - next.resources.oil) / net.oil);
    }
    if (next.activeConstruction && workRate > 0) {
      seconds = Math.min(seconds, (constructionWork(next, next.activeConstruction) - next.activeConstruction.workDone) / workRate);
    }
    if (next.activeExpedition) seconds = Math.min(seconds, (next.activeExpedition.returnsAt - cursor) / 1000);
    for (const id of ["food", "oil", "authority"] as const) {
      if (net[id] < 0 && next.resources[id] > 0) seconds = Math.min(seconds, next.resources[id] / -net[id]);
    }
    const resources = { ...next.resources };
    for (const id of Object.keys(resources) as ResourceId[]) {
      resources[id] = storedAmount(next, id, net[id] * seconds);
    }
    // Snap only the exhausted resource at an exact boundary to remove floating-point dust.
    for (const id of ["food", "oil", "authority"] as const) {
      if (net[id] < 0 && seconds >= next.resources[id] / -net[id]) resources[id] = 0;
    }
    if (net.oil > 0 && next.resources.oil < LAMPS.relightReserveOil && seconds >= (LAMPS.relightReserveOil - next.resources.oil) / net.oil) {
      resources.oil = LAMPS.relightReserveOil;
    }
    lampSummary.authorityLost += Math.min(lamps.authorityLoss * seconds, next.resources.authority + authorityProduction * seconds);
    if (next.lamps.lit < LAMPS.count) lampSummary.darknessMs += seconds * 1000;
    const beforeLamps = next.lamps.lit;
    next = advanceLamps({ ...next, resources, lifetimeAuthority: Math.min(Number.MAX_SAFE_INTEGER, next.lifetimeAuthority + authorityProduction * seconds) }, lamps, seconds);
    lampSummary.extinguished += Math.max(0, beforeLamps - next.lamps.lit);
    lampSummary.relit += Math.max(0, next.lamps.lit - beforeLamps);
    if (next.activeConstruction && workRate > 0) {
      const total = constructionWork(next, next.activeConstruction);
      const remainingSeconds = (total - next.activeConstruction.workDone) / workRate;
      const project = next.activeConstruction;
      next = { ...next, activeConstruction: { ...project,
        workDone: seconds >= remainingSeconds ? total : project.workDone + workRate * seconds } };
      const finished = completeConstruction(next);
      if (finished !== next) completedConstruction.push(project.kind === "building" ? { kind: "building", id: project.id } : { kind: "research", id: project.id });
      next = finished;
    }
    cursor = Math.min(productionEnd, cursor + seconds * 1000);
    finishParty(cursor);
    next = queueEvents(next);
  }
  if (elapsedMs > 0) {
    finishParty(now); // Timers continue even after production reaches its cap.
    next = { ...next, lastSimulatedAt: now };
    next = prepareLamps(next, economyRates(next).lamps);
  }
  next = queueEvents(next);
  return { state: next, summary: {
    lamps: { ...lampSummary, after: next.lamps.lit },
    elapsedMs, productionMs,
    changes: Object.fromEntries((Object.keys(next.resources) as ResourceId[]).map(id => [id, next.resources[id] - state.resources[id]])) as ReturnSummary["changes"],
    newEvents: next.triggeredEvents.filter((id) => !state.triggeredEvents.includes(id)),
    completedExpeditions,
    completedConstruction,
    fullStores: (Object.keys(next.resources) as ResourceId[]).filter(id => resourceCapacity(next, id) < Number.MAX_SAFE_INTEGER && next.resources[id] >= resourceCapacity(next, id)),
  } };
}
