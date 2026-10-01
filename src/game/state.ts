import { BALANCE } from "../content/balance";
import type { GameState } from "./types";

export function createInitialState(now: number): GameState {
  return {
    version: 2,
    resources: { ...BALANCE.startingResources },
    population: BALANCE.startingPopulation,
    jobs: { forager: 0, lamplighter: 0 },
    buildings: { fields: 0, "oil-press": 0 },
    lifetimeAuthority: 0,
    triggeredEvents: [],
    pendingEvents: [],
    research: [],
    chronicle: ["appointment"],
    lastSimulatedAt: now,
    lastGatheredAt: null,
  };
}
