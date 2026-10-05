import { BALANCE } from "../content/balance";
import { storedAmount } from "./storage";
import type { EventDefinition, GameAction, GameState, ResourceId } from "./types";
import { BUILDINGS } from "../content/buildings";
import { JOBS } from "../content/jobs";
import { EVENTS } from "../content/events";
import { EXPEDITIONS } from "../content/expeditions";
import { RESEARCH } from "../content/research";
import { availableWorkers, buildingCost, buildingRequirements, eventChoices, eventRequirements, payCost, researchRequirements, jobUnlocked, expeditionCost, expeditionRequirements } from "./requirements";
import { reconcile, economyRates } from "./simulation";
import { queueEvents } from "./progression";
import { ILLUSTRATIONS } from "../content/illustrations";
import { AWAKENING } from "../content/awakening";
import { awakeningRequirements } from "./requirements";
import { availableStudies, availableWorks } from "./catalogs";
import { initialLamps, prepareLamps } from "./lamps";

export function gatheringWaitMs(state: GameState, now: number): number {
  return state.lastGatheredAt === null ? 0 : Math.max(0, state.lastGatheredAt + BALANCE.gatheringCooldownMs - now);
}

export function applyAction(state: GameState, action: GameAction, now: number): GameState {
  if (!Number.isSafeInteger(now) || now < state.lastSimulatedAt || now < 0) return state;
  if (action.type === "view-work") {
    if (!availableWorks(state).includes(action.id) || state.seenWorks.includes(action.id)) return state;
    return { ...state, seenWorks: [...state.seenWorks, action.id] };
  }
  if (action.type === "view-study") {
    if (!availableStudies(state).includes(action.id) || state.seenStudies.includes(action.id)) return state;
    return { ...state, seenStudies: [...state.seenStudies, action.id] };
  }
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
      if (next.resources.food < BALANCE.emergencyOilFood || storedAmount(next, "oil", BALANCE.emergencyOil) === next.resources.oil) return next;
      next = { ...next, lastGatheredAt: now, resources: { ...next.resources, food: next.resources.food - BALANCE.emergencyOilFood,
        oil: storedAmount(next, "oil", BALANCE.emergencyOil) } };
      break;
    case "gather-food":
      if (storedAmount(next, "food", BALANCE.gatheringFood) === next.resources.food) return next;
      next = { ...next, lastGatheredAt: now, resources: { ...next.resources, food: storedAmount(next, "food", BALANCE.gatheringFood) } };
      break;
    case "assign-worker":
      if (!jobUnlocked(next, action.job)) return next;
      if ((action.delta === 1 && availableWorkers(next) === 0) || (action.delta === -1 && next.jobs[action.job] === 0)) return next;
      next = { ...next, jobs: { ...next.jobs, [action.job]: next.jobs[action.job] + action.delta } };
      break;
    case "build":
      if (buildingRequirements(next, action.building).length) return next;
      next = { ...payCost(next, buildingCost(next, action.building)),
        activeConstruction: { kind: "building", id: action.building, workDone: 0, startedAt: now } };
      break;
    case "choose-event": {
      if (next.pendingEvents[0] !== action.event || eventRequirements(next, action.event, action.choice).length) return next;
      const event: EventDefinition = EVENTS[action.event];
      const response = eventChoices(action.event).find(item => item.id === (action.choice ?? "accept"))!;
      next = payCost(next, response.cost);
      const resources = { ...next.resources };
      for (const [id, amount] of Object.entries(response.rewards) as [ResourceId, number][]) resources[id] = storedAmount(next, id, amount);
      next = { ...next, resources, lifetimeAuthority: Math.min(Number.MAX_SAFE_INTEGER, next.lifetimeAuthority + (response.rewards.authority ?? 0)),
        eventChoices: event.choices ? { ...next.eventChoices, [action.event]: response.id } : next.eventChoices,
        population: next.population + event.population, pendingEvents: next.pendingEvents.slice(1), chronicle: [...next.chronicle, event.chronicle] };
      break;
    }
    case "start-expedition": {
      if (expeditionRequirements(next, action.destination, action.workers).length) return next;
      const returnsAt = now + EXPEDITIONS[action.destination].durationMs;
      if (!Number.isSafeInteger(returnsAt)) return next;
      next = { ...payCost(next, expeditionCost(next, action.destination, action.workers)),
        jobs: EXPEDITIONS[action.destination].staffing === "scavenger" ? { ...next.jobs, scavenger: next.jobs.scavenger - action.workers } : next.jobs,
        activeExpedition: { destination: action.destination, workers: action.workers, startedAt: now, returnsAt } };
      break;
    }
    case "research":
      if (researchRequirements(next, action.research).length) return next;
      if (action.research === "restore-conduit") {
        next = { ...payCost(next, RESEARCH[action.research].cost),
          activeConstruction: { kind: "research", id: action.research, workDone: 0, startedAt: now } };
        break;
      }
      next = { ...payCost(next, RESEARCH[action.research].cost), research: [...next.research, action.research], chronicle: [...next.chronicle, RESEARCH[action.research].chronicle] };
      break;
    case "awaken-junction":
      if (awakeningRequirements(next).length) return next;
      next = { ...next, awakenedAt: now, lamps: initialLamps(), finaleStep: 0, chronicle: [...next.chronicle, "junction-awakened"] };
      break;
    default: return state;
  }
  return queueEvents(prepareLamps(next, economyRates(next).lamps));
}
