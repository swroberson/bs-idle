import { describe, expect, it } from "vitest";
import { applyAction } from "./actions";
import { decodeSave, encodeSave } from "./save";
import { createInitialState } from "./state";
import { availableWorkers } from "./requirements";
import type { GameState } from "./types";
const assignedWorkers = (state: GameState) => Object.values(state.jobs).reduce((sum, count) => sum + count, 0);
import type { GameAction } from "./types";

describe("inhabitant allocation", () => {
  it("starts with all inhabitants available", () => {
    const state = createInitialState(1000);
    expect(state.jobs).toEqual({ forager: 0, lamplighter: 0, scrivener: 0 });
    expect(assignedWorkers(state)).toBe(0);
    expect(availableWorkers(state)).toBe(5);
  });

  it("assigns, releases and reallocates workers without changing population or stores", () => {
    const initial = createInitialState(1000);
    const forager = applyAction(initial, { type: "assign-worker", job: "forager", delta: 1 }, 1000);
    const lamp = applyAction(forager, { type: "assign-worker", job: "lamplighter", delta: 1 }, 1000);
    const released = applyAction(lamp, { type: "assign-worker", job: "forager", delta: -1 }, 1000);
    expect(released.jobs).toEqual({ forager: 0, lamplighter: 1, scrivener: 0 });
    expect(availableWorkers(released)).toBe(4);
    expect(released.population).toBe(5);
    expect(released.resources).toEqual(initial.resources);
    expect(initial.jobs).toEqual({ forager: 0, lamplighter: 0, scrivener: 0 });
  });

  it("prevents repeated actions from over-assigning the shared pool", () => {
    let state = createInitialState(1000);
    for (let i = 0; i < 10; i++) state = applyAction(state, {
      type: "assign-worker", job: i % 2 ? "forager" : "lamplighter", delta: 1,
    }, 1000);
    expect(assignedWorkers(state)).toBe(5);
    expect(availableWorkers(state)).toBe(0);
    expect(applyAction(state, { type: "assign-worker", job: "forager", delta: 1 }, 1000)).toBe(state);
    const released = applyAction(state, { type: "assign-worker", job: "lamplighter", delta: -1 }, 1000);
    expect(availableWorkers(released)).toBe(1);
    expect(assignedWorkers(applyAction(released, { type: "assign-worker", job: "forager", delta: 1 }, 1000))).toBe(5);
  });

  it("does not release an unassigned worker", () => {
    const state = createInitialState(1000);
    expect(applyAction(state, { type: "assign-worker", job: "forager", delta: -1 }, 1000)).toBe(state);
  });

  it.each([
    { type: "assign-worker", job: "unknown", delta: 1 },
    { type: "assign-worker", job: "__proto__", delta: 1 },
    { type: "assign-worker", job: "forager", delta: 0 },
    { type: "assign-worker", job: "forager", delta: 0.5 },
    { type: "assign-worker", job: "forager", delta: 6 },
  ])("rejects invalid actions: %j", (action) => {
    const state = createInitialState(1000);
    expect(applyAction(state, action as GameAction, 1000)).toBe(state);
  });
});

describe("allocation saves", () => {
  it("round-trips assignments", () => {
    const state = applyAction(createInitialState(1000), { type: "assign-worker", job: "forager", delta: 1 }, 1000);
    expect(decodeSave(encodeSave(state)).jobs).toEqual({ forager: 1, lamplighter: 0, scrivener: 0 });
  });

  it("preserves older saves with all inhabitants available", () => {
    const legacy = JSON.parse(encodeSave(createInitialState(1000)));
    delete legacy.readChronicle;
    const decoded = decodeSave(JSON.stringify(legacy));
    expect(decoded.jobs).toEqual({ forager: 0, lamplighter: 0, scrivener: 0 });
    expect(decoded.resources).toEqual(legacy.resources);
  });

  it.each([
    null, [], { forager: 1 }, { forager: 1, lamplighter: 0, unknown: 0 },
    { forager: -1, lamplighter: 0 }, { forager: 0.5, lamplighter: 0 },
    { forager: 3, lamplighter: 3 }, { forager: Infinity, lamplighter: 0 },
  ])("rejects malformed allocations: %j", (jobs) => {
    expect(() => decodeSave(JSON.stringify({ ...createInitialState(1000), jobs }))).toThrow();
  });
});
