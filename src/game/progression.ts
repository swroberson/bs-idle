import { EVENTS } from "../content/events";
import type { EventId, GameState } from "./types";

export function queueEvents(state: GameState): GameState {
  const eligible = (Object.keys(EVENTS) as EventId[]).filter((id) => {
    const event = EVENTS[id];
    return !state.triggeredEvents.includes(id) && state.lifetimeAuthority >= event.lifetimeAuthority &&
      state.buildings[event.requiredBuilding] > 0 &&
      (id !== "lamp-complaint" || state.chronicle.includes("household"));
  });
  if (!eligible.length) return state;
  return { ...state, triggeredEvents: [...state.triggeredEvents, ...eligible], pendingEvents: [...state.pendingEvents, ...eligible] };
}
