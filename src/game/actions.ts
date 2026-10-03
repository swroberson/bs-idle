import { BALANCE } from "../content/balance";
import type { BuildingDefinition, GameAction, GameState } from "./types";
import { BUILDINGS } from "../content/buildings";
import { JOBS } from "../content/jobs";
import { EVENTS } from "../content/events";
import { EXPEDITIONS } from "../content/expeditions";
import { RESEARCH } from "../content/research";
import { availableWorkers, buildingCost, buildingRequirements, eventRequirements, payCost, researchRequirements, jobUnlocked, expeditionCost, expeditionRequirements } from "./requirements";
import { reconcile } from "./simulation";
import { queueEvents } from "./progression";
import { ILLUSTRATIONS } from "../content/illustrations";
import { AWAKENING } from "../content/awakening";
import { awakeningRequirements } from "./requirements";

export function gatheringWaitMs(state: GameState, now: number): number {
  return state.lastGatheredAt === null ? 0 : Math.max(0, state.lastGatheredAt + BALANCE.gatheringCooldownMs - now);
}

export function applyAction(state: GameState, action: GameAction, now: number): GameState {
  if (!Number.isSafeInteger(now) || now < state.lastSimulatedAt || now < 0) return state;
  if (action.type === "advance-awakening") {
    if (state.awakenedAt === null || !Number.isInteger(action.step) || action.step !== state.finaleStep || action.step >= AWAKENING.passages.length) return state;
    return { ...state, finaleStep: state.finaleStep + 1 };
  }
  if (action.type === "dismiss-illustrations") {
    if (!Array.isArray(action.ids) || new Set(action.ids).size !== action.ids.length ||
        !action.ids.every(id => typeof id === "string" && Object.hasOwn(ILLUSTRATIONS, id) && state.chronicle.includes(ILLUSTRATIONS[id].chronicle))) return state;
    const newlyDismissed = action.ids.filter(id => !state.dismissedIllustrations.includes(id));
    return newlyDismissed.length ? { ...state, dismissedIllustrations: [...state.dismissedIllustrations, ...newlyDismissed] } : state;
  }
  if (action.type === "read-chronicle") {
    if (!state.chronicle.includes(action.id) || state.readChronicle.includes(action.id)) return state;
    return { ...state, readChronicle: [...state.readChronicle, action.id] };
  }
  // Reject unknown runtime IDs before indexing content (imports and UI are not trusted).
  if (action.type === "assign-worker" && (!Object.hasOwn(JOBS, action.job) || ![1, -1].includes(action.delta))) return state;
  if (action.type === "build" && !Object.hasOwn(BUILDINGS, action.building)) return state;
  if (action.type === "choose-event" && !Object.hasOwn(EVENTS, action.event)) return state;
  if (action.type === "research" && !Object.hasOwn(RESEARCH, action.research)) return state;
  if (action.type === "start-expedition" && !Object.hasOwn(EXPEDITIONS, action.destination)) return state;
  if ((action.type === "gather-food" || action.type === "render-oil") && gatheringWaitMs(state, now) > 0) return state;
  let next = reconcile(state, now).state;
  switch (action.type) {
    case "render-oil":
      if (next.resources.food < BALANCE.emergencyOilFood) return next;
      next = { ...next, lastGatheredAt: now, resources: { ...next.resources, food: next.resources.food - BALANCE.emergencyOilFood,
        oil: Math.min(Number.MAX_SAFE_INTEGER, next.resources.oil + BALANCE.emergencyOil) } };
      break;
    case "gather-food":
      next = { ...next, lastGatheredAt: now, resources: { ...next.resources, food: Math.min(Number.MAX_SAFE_INTEGER, next.resources.food + BALANCE.gatheringFood) } };
      break;
    case "assign-worker":
      if (!jobUnlocked(next, action.job)) return next;
      if ((action.delta === 1 && availableWorkers(next) === 0) || (action.delta === -1 && next.jobs[action.job] === 0)) return next;
      next = { ...next, jobs: { ...next.jobs, [action.job]: next.jobs[action.job] + action.delta } };
      break;
    case "build":
      if (buildingRequirements(next, action.building).length) return next;
      const building: BuildingDefinition = BUILDINGS[action.building];
      if (building.chronicle && next.buildings[action.building] === 0) next = { ...next, chronicle: [...next.chronicle, building.chronicle] };
      if (action.building === "oil-press" && next.buildings["oil-press"] === 0) {
        next = { ...next, chronicle: [...next.chronicle, "oil-press-built"] };
      }
      next = { ...payCost(next, buildingCost(next, action.building)), buildings: { ...next.buildings, [action.building]: next.buildings[action.building] + 1 } };
      break;
    case "choose-event": {
      if (next.pendingEvents[0] !== action.event || eventRequirements(next, action.event).length) return next;
      const event = EVENTS[action.event];
      next = { ...payCost(next, event.cost), population: next.population + event.population, pendingEvents: next.pendingEvents.slice(1), chronicle: [...next.chronicle, event.chronicle] };
      break;
    }
    case "start-expedition": {
      if (expeditionRequirements(next, action.destination, action.workers).length) return next;
      const returnsAt = now + EXPEDITIONS[action.destination].durationMs;
      if (!Number.isSafeInteger(returnsAt)) return next;
      next = { ...payCost(next, expeditionCost(action.destination, action.workers)),
        activeExpedition: { destination: action.destination, workers: action.workers, startedAt: now, returnsAt } };
      break;
    }
    case "research":
      if (researchRequirements(next, action.research).length) return next;
      next = { ...payCost(next, RESEARCH[action.research].cost), research: [...next.research, action.research], chronicle: [...next.chronicle, RESEARCH[action.research].chronicle] };
      break;
    case "awaken-junction":
      if (awakeningRequirements(next).length) return next;
      next = { ...next, awakenedAt: now, finaleStep: 0, chronicle: [...next.chronicle, "junction-awakened"] };
      break;
    default: return state;
  }
  return queueEvents(next);
}
