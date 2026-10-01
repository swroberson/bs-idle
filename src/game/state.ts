import { BALANCE } from "../content/balance";
import type { GameState } from "./types";

export function createInitialState(now: number): GameState {
  return {
    version: 1,
    resources: { ...BALANCE.startingResources },
    population: BALANCE.startingPopulation,
    chronicle: ["appointment"],
    lastSimulatedAt: now,
    lastGatheredAt: null,
  };
}
