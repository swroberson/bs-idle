// Development-only: no resource grants, manual gathering, or browser imports.
import { expect, it } from "vitest";
import { createInitialState } from "./state";
import { applyAction } from "./actions";
import { reconcile } from "./simulation";
import { availableWorkers, buildingRequirements, eventRequirements, researchRequirements } from "./requirements";
import { decodeSave, encodeSave } from "./save";

it("reaches the foundation survey from a fresh save through ordinary actions", () => {
  let state = createInitialState(0);
  const milestones: Record<string, number> = {};
  for (let n = 0; n < 3; n++) state = applyAction(state, { type: "assign-worker", job: "forager", delta: 1 }, 0);
  for (let n = 0; n < 2; n++) state = applyAction(state, { type: "assign-worker", job: "lamplighter", delta: 1 }, 0);
  for (let second = 1; second <= 1800; second++) {
    const now = second * 1000;
    state = reconcile(state, now).state;
    const event = state.pendingEvents[0];
    if (event && !eventRequirements(state, event).length) state = applyAction(state, { type: "choose-event", event }, now);
    for (const id of ["fields", "oil-press", "market-stall", "scrivener-house", "ruined-cistern", "antiquities-house"] as const) {
      if (!state.buildings[id] && !buildingRequirements(state, id).length) {
        state = applyAction(state, { type: "build", building: id }, now);
        milestones[id] = second;
      }
    }
    if (state.buildings["scrivener-house"] && !state.jobs.scrivener) state = applyAction(state, { type: "assign-worker", job: "scrivener", delta: 1 }, now);
    for (const id of ["examine-old-lamps", "ledger-keeping", "catalog-relics", "survey-foundations"] as const) {
      if (!state.research.includes(id) && !researchRequirements(state, id).length) {
        state = applyAction(state, { type: "research", research: id }, now);
        milestones[id] = second;
      }
    }
    if (state.buildings["ruined-cistern"] && !state.completedExpeditions.includes("old-cistern") && !state.activeExpedition && availableWorkers(state) >= 2 && state.resources.food >= 20) {
      state = applyAction(state, { type: "start-expedition", destination: "old-cistern", workers: 2 }, now);
      milestones.departure = second;
    }
    if (state.research.includes("survey-foundations")) break;
  }
  expect(state.research).toContain("survey-foundations");
  expect(state.completedExpeditions).toContain("old-cistern");
  expect(state.jobs).toEqual({ forager: 3, lamplighter: 2, scrivener: 1, laborer: 0 });
  expect(availableWorkers(state)).toBe(2);
  expect(decodeSave(encodeSave(state))).toEqual(state);
  expect(milestones["survey-foundations"]).toBeLessThanOrEqual(1200);
  console.info("Foundation harness (seconds):", milestones);
});
