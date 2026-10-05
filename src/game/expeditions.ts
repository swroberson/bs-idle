import { BALANCE } from "../content/balance";
import { EXPEDITIONS } from "../content/expeditions";
import { storedAmount } from "./storage";
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
    resources[id] = storedAmount(state, id, perWorker * party.workers);
    // Fractional stores can make subtraction exceed the nominal reward by dust.
    rewards[id] = Math.min(perWorker * party.workers, resources[id] - before);
  }
  return { ...state, resources, activeExpedition: null,
    completedExpeditions: firstDiscovery ? [...state.completedExpeditions, party.destination] : state.completedExpeditions,
    chronicle: firstDiscovery ? [...state.chronicle, destination.chronicle] : state.chronicle,
    expeditionLog: [...state.expeditionLog, { ...party, returnedAt: party.returnsAt, rewards, firstDiscovery }].slice(-BALANCE.expeditionLogLimit),
  };
}
