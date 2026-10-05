import { EVENTS } from "../content/events";
import type { EventDefinition, EventId, GameState, ResourceId } from "./types";
import { eventRequirements, prerequisiteRequirements } from "./requirements";
import { BALANCE } from "../content/balance";
import { LAMPS } from "../content/lamps";

// Eligibility can be reached and then lost before an offline interval ends.
// Stop at the next threshold so the report remains pending after shortages.
export function secondsUntilEvent(state: GameState, net: Record<ResourceId, number>, authorityProduction = net.authority): number {
  let nearest = Infinity;
  for (const id of Object.keys(EVENTS) as EventId[]) {
    const event: EventDefinition = EVENTS[id];
    if (event.population > 0 && state.lamps.lit < LAMPS.count) continue;
    if (state.triggeredEvents.includes(id) || prerequisiteRequirements(state, { ...event.requirements, lifetimeAuthority: 0 }).length ||
        (event.provisionedArrival && state.population + event.population > BALANCE.populationCap)) continue;
    const thresholds = [[(event.requirements.lifetimeAuthority ?? 0) - state.lifetimeAuthority, authorityProduction]];
    if (event.provisionedArrival) {
      for (const [resource, amount] of Object.entries(event.cost) as [ResourceId, number][]) thresholds.push([amount - state.resources[resource], net[resource]]);
    }
    if (thresholds.some(([deficit, rate]) => deficit > 0 && rate <= 0)) continue;
    const seconds = Math.max(0, ...thresholds.map(([deficit, rate]) => deficit > 0 ? deficit / rate : 0));
    // Round up to a millisecond to avoid repeatedly stopping on numerical dust.
    if (seconds > 0) nearest = Math.min(nearest, Math.max(0.001, Math.ceil(seconds * 1000) / 1000));
  }
  return nearest;
}

export function queueEvents(state: GameState): GameState {
  const eligible = (Object.keys(EVENTS) as EventId[]).filter((id) => {
    const event: EventDefinition = EVENTS[id];
    return !state.triggeredEvents.includes(id) && !prerequisiteRequirements(state, event.requirements).length &&
      (event.population === 0 || state.lamps.lit === LAMPS.count) &&
      (!event.provisionedArrival || !eventRequirements(state, id).length);
  });
  if (!eligible.length) return state;
  return { ...state, triggeredEvents: [...state.triggeredEvents, ...eligible], pendingEvents: [...state.pendingEvents, ...eligible] };
}
