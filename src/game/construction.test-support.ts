// Test fixtures finish granted-store projects through the real simulation.
import { expect } from "vitest";
import { applyAction } from "./actions";
import { reconcile, economyRates } from "./simulation";
import { constructionRate, constructionWork } from "./construction";
import type { BuildingId, GameState } from "./types";
import { BUILDINGS } from "../content/buildings";
import { availableWorkers, buildingCost, buildingRequirements, costRequirements, jobUnlocked, prerequisiteRequirements } from "./requirements";

export function finishConstruction(state: GameState): GameState {
  expect(state.activeConstruction).not.toBeNull();
  while (state.activeConstruction) {
    const rate = constructionRate(state, economyRates(state).efficiency);
    expect(rate).toBeGreaterThan(0);
    const remaining = constructionWork(state, state.activeConstruction) - state.activeConstruction.workDone;
    state = reconcile(state, state.lastSimulatedAt + Math.max(1, Math.ceil(remaining / rate * 1000))).state;
  }
  return state;
}

export function buildCompleted(state: GameState, building: BuildingId): GameState {
  return finishConstruction(applyAction(state, { type: "build", building }, state.lastSimulatedAt));
}

// Reachability strategy: move one Forager to construction only when supplies are ready.
export function startBuilding(state: GameState, building: BuildingId): GameState {
  if (state.activeConstruction || state.buildings[building] >= BUILDINGS[building].maxLevel ||
      prerequisiteRequirements(state, BUILDINGS[building].requirements).length ||
      costRequirements(state, buildingCost(state, building)).length || !jobUnlocked(state, "laborer")) return state;
  if (!state.jobs.laborer) {
    if (state.jobs.forager > 1 || !availableWorkers(state)) state = applyAction(state, { type: "assign-worker", job: "forager", delta: -1 }, state.lastSimulatedAt);
    state = applyAction(state, { type: "assign-worker", job: "laborer", delta: 1 }, state.lastSimulatedAt);
  }
  return buildingRequirements(state, building).length ? state : applyAction(state, { type: "build", building }, state.lastSimulatedAt);
}

export function releaseIdleCrew(state: GameState): GameState {
  if (state.activeConstruction || !state.jobs.laborer) return state;
  return applyAction(applyAction(state, { type: "assign-worker", job: "laborer", delta: -1 }, state.lastSimulatedAt),
    { type: "assign-worker", job: "forager", delta: 1 }, state.lastSimulatedAt);
}
