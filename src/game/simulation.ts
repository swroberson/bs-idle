import { BALANCE } from "../content/balance";
import { JOBS } from "../content/jobs";
import { BUILDINGS } from "../content/buildings";
import { queueEvents } from "./progression";
import type { GameState, ResourceId, ReturnSummary } from "./types";

export function economyRates(state: GameState) {
  const foodOutput = state.jobs.forager * (JOBS.forager.foodPerSecond + state.buildings.fields * BUILDINGS.fields.foodPerForager);
  const foodNet = foodOutput - state.population * BALANCE.foodPerInhabitant;
  // Foragers keep full output, including at zero Food, so recovery never requires clicking.
  const starving = state.resources.food <= 0 && foodNet <= 0;
  const efficiency = starving ? BALANCE.shortageOutputMultiplier : 1;
  const oilOutput = state.buildings["oil-press"] * BUILDINGS["oil-press"].oilPerSecond * efficiency;
  const oilDemand = state.jobs.lamplighter * JOBS.lamplighter.oilPerSecond * efficiency;
  // At zero stores, lamps consume the available flow instead of oscillating on/off each tick.
  const lampFraction = state.resources.oil <= 0 && oilDemand > 0 ? Math.min(1, oilOutput / oilDemand) : 1;
  return {
    starving, lampsLimited: lampFraction < 1,
    net: {
      food: state.resources.food <= 0 ? Math.max(0, foodNet) : foodNet,
      oil: oilOutput - oilDemand * lampFraction,
      authority: state.jobs.lamplighter * JOBS.lamplighter.authorityPerSecond * efficiency * lampFraction,
    },
  };
}

export function reconcile(state: GameState, now: number): { state: GameState; summary: ReturnSummary } {
  const valid = Number.isSafeInteger(now) && now >= 0;
  const elapsedMs = valid ? Math.max(0, now - state.lastSimulatedAt) : 0;
  const productionMs = Math.min(elapsedMs, BALANCE.offlineProductionCapMs);
  let next = state;
  let secondsLeft = productionMs / 1000;
  while (secondsLeft > 0) {
    const { net } = economyRates(next);
    let seconds = secondsLeft;
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
    secondsLeft -= seconds;
  }
  if (elapsedMs > 0) next = { ...next, lastSimulatedAt: now };
  next = queueEvents(next);
  return { state: next, summary: {
    elapsedMs, productionMs,
    changes: { food: next.resources.food - state.resources.food, oil: next.resources.oil - state.resources.oil, authority: next.resources.authority - state.resources.authority },
    newEvents: next.triggeredEvents.filter((id) => !state.triggeredEvents.includes(id)),
  } };
}
