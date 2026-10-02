// Development-only progression harness. Never imported by the game interface.
import { expect, it } from "vitest";
import { createInitialState } from "./state";
import { applyAction } from "./actions";
import { reconcile } from "./simulation";
import { buildingRequirements, eventRequirements, researchRequirements } from "./requirements";
import { decodeSave, encodeSave } from "./save";

it("reaches the opening discovery from a fresh save without grants or manual gathering", () => {
  let state = createInitialState(0);
  const milestones: Record<string, number> = {};
  for (let n = 0; n < 3; n++) state = applyAction(state, { type: "assign-worker", job: "forager", delta: 1 }, 0);
  for (let n = 0; n < 2; n++) state = applyAction(state, { type: "assign-worker", job: "lamplighter", delta: 1 }, 0);
  for (let second = 1; second <= 600; second++) {
    const now = second * 1000;
    state = reconcile(state, now).state;
    for (const id of ["fields", "oil-press"] as const) {
      if (state.buildings[id] === 0 && buildingRequirements(state, id).length === 0) {
        state = applyAction(state, { type: "build", building: id }, now);
        milestones[id] = second;
      }
    }
    const event = state.pendingEvents[0];
    if (event && eventRequirements(state, event).length === 0) {
      state = applyAction(state, { type: "choose-event", event }, now);
      milestones[event] = second;
    }
    if (!state.research.length && researchRequirements(state, "examine-old-lamps").length === 0) {
      state = applyAction(state, { type: "research", research: "examine-old-lamps" }, now);
      milestones.examination = second;
      break;
    }
  }
  expect(state.research).toEqual(["examine-old-lamps"]);
  expect(state.population).toBe(8);
  expect(milestones.examination).toBeLessThanOrEqual(360);
  expect(decodeSave(encodeSave(state))).toEqual(state);
  expect(reconcile(state, state.lastSimulatedAt + 28_800_000).state.population).toBe(8);
  console.info("Opening harness (seconds):", milestones);
});
