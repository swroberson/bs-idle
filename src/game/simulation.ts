import { BALANCE } from "../content/balance";
import { JOBS } from "../content/jobs";
import { BUILDINGS } from "../content/buildings";
import { RESEARCH } from "../content/research";
import { AWAKENING } from "../content/awakening";
import { queueEvents, secondsUntilEvent } from "./progression";
import { completeExpedition } from "./expeditions";
import type { GameState, Modifiers, ResearchDefinition, ResourceId, ReturnSummary } from "./types";

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
  const oilDemand = state.awakenedAt !== null ? 0 : state.jobs.lamplighter * JOBS.lamplighter.oilPerSecond * efficiency * modifiers.oilDemandMultiplier;
  // At zero stores, lamps consume the available flow instead of oscillating on/off each tick.
  const lampFraction = state.resources.oil <= 0 && oilDemand > 0 ? Math.min(1, oilOutput / oilDemand) : 1;
  return {
    starving, lampsLimited: lampFraction < 1,
    net: {
      food: state.resources.food <= 0 ? Math.max(0, foodNet) : foodNet,
      oil: oilOutput - oilDemand * lampFraction,
      authority: state.jobs.lamplighter * (JOBS.lamplighter.authorityPerSecond + state.buildings["lamp-house"] * BUILDINGS["lamp-house"].authorityPerLamplighter) * efficiency * lampFraction,
      coin: state.buildings["market-stall"] * BUILDINGS["market-stall"].coinPerSecond * efficiency,
      knowledge: state.jobs.scrivener * JOBS.scrivener.knowledgePerSecond * efficiency * modifiers.knowledgeMultiplier,
      relics: 0,
      current: state.awakenedAt !== null ? AWAKENING.currentPerSecond * efficiency : 0,
    },
  };
}

export function reconcile(state: GameState, now: number): { state: GameState; summary: ReturnSummary } {
  const valid = Number.isSafeInteger(now) && now >= 0;
  const elapsedMs = valid ? Math.max(0, now - state.lastSimulatedAt) : 0;
  const productionMs = Math.min(elapsedMs, BALANCE.offlineProductionCapMs);
  let next = queueEvents(state);
  let cursor = state.lastSimulatedAt;
  const productionEnd = cursor + productionMs;
  const completedExpeditions: ReturnSummary["completedExpeditions"] = [];
  const finishParty = (at: number) => {
    const destination = next.activeExpedition?.destination;
    const finished = completeExpedition(next, at);
    if (finished !== next && destination) completedExpeditions.push(destination);
    next = finished;
  };
  if (elapsedMs > 0) finishParty(cursor);
  while (cursor < productionEnd) {
    const { net } = economyRates(next);
    let seconds = Math.min((productionEnd - cursor) / 1000, secondsUntilEvent(next, net));
    if (next.activeExpedition) seconds = Math.min(seconds, (next.activeExpedition.returnsAt - cursor) / 1000);
    for (const id of ["food", "oil"] as const) {
      if (net[id] < 0 && next.resources[id] > 0) seconds = Math.min(seconds, next.resources[id] / -net[id]);
    }
    const resources = { ...next.resources };
    for (const id of Object.keys(resources) as ResourceId[]) {
      resources[id] = Math.min(Number.MAX_SAFE_INTEGER, Math.max(0, resources[id] + net[id] * seconds));
    }
    // Snap only the exhausted resource at an exact boundary to remove floating-point dust.
    for (const id of ["food", "oil"] as const) {
      if (net[id] < 0 && seconds >= next.resources[id] / -net[id]) resources[id] = 0;
    }
    next = { ...next, resources, lifetimeAuthority: Math.min(Number.MAX_SAFE_INTEGER, next.lifetimeAuthority + net.authority * seconds) };
    cursor = Math.min(productionEnd, cursor + seconds * 1000);
    finishParty(cursor);
    next = queueEvents(next);
  }
  if (elapsedMs > 0) {
    finishParty(now); // Timers continue even after production reaches its cap.
    next = { ...next, lastSimulatedAt: now };
  }
  next = queueEvents(next);
  return { state: next, summary: {
    elapsedMs, productionMs,
    changes: Object.fromEntries((Object.keys(next.resources) as ResourceId[]).map(id => [id, next.resources[id] - state.resources[id]])) as ReturnSummary["changes"],
    newEvents: next.triggeredEvents.filter((id) => !state.triggeredEvents.includes(id)),
    completedExpeditions,
  } };
}
