import { BALANCE } from "../content/balance";
import { EXPEDITIONS } from "../content/expeditions";
import type { Cost, GameState, ResourceId } from "./types";

export function completeExpedition(state: GameState, at: number): GameState {
  const party = state.activeExpedition;
  if (!party || party.returnsAt > at) return state;
  const destination = EXPEDITIONS[party.destination];
  const firstDiscovery = !state.completedExpeditions.includes(party.destination);
  const resources = { ...state.resources };
  const rewards: Cost = {};
  for (const [id, perWorker] of Object.entries(destination.rewardsPerWorker) as [ResourceId, number][]) {
    const before = resources[id];
    resources[id] = Math.min(Number.MAX_SAFE_INTEGER, before + perWorker * party.workers);
    rewards[id] = resources[id] - before;
  }
  return { ...state, resources, activeExpedition: null,
    completedExpeditions: firstDiscovery ? [...state.completedExpeditions, party.destination] : state.completedExpeditions,
    chronicle: firstDiscovery ? [...state.chronicle, destination.chronicle] : state.chronicle,
    expeditionLog: [...state.expeditionLog, { ...party, returnedAt: party.returnsAt, rewards, firstDiscovery }].slice(-BALANCE.expeditionLogLimit),
  };
}
