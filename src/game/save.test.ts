import { describe, expect, it } from "vitest";
import { createInitialState } from "./state";
import { decodeSave, encodeSave } from "./save";
import { applyAction } from "./actions";

describe("save validation", () => {
  it("round-trips a save after an action", () => {
    const initial = createInitialState(1000);
    const updated = applyAction(initial, { type: "gather-food" }, 1000);
    expect(decodeSave(encodeSave(updated))).toEqual(updated);
    expect(initial.resources.food).toBe(30);
  });

  it.each([
    "not json", "null", "{}",
    JSON.stringify({ ...createInitialState(1000), version: 999 }),
    JSON.stringify({ ...createInitialState(1000), resources: { food: -1, oil: 20, authority: 0 } }),
    JSON.stringify({ ...createInitialState(1000), resources: { food: 1e309, oil: 20, authority: 0 } }),
    JSON.stringify({ ...createInitialState(1000), resources: { food: 30, oil: 20, authority: 0, unknown: 1 } }),
    JSON.stringify({ ...createInitialState(1000), population: 2.5 }),
    JSON.stringify({ ...createInitialState(1000), chronicle: ["unknown"] }),
    JSON.stringify({ ...createInitialState(1000), chronicle: ["appointment", "appointment"] }),
  ])("rejects invalid or unsupported input: %s", (input) => {
    expect(() => decodeSave(input)).toThrow();
  });
});

describe("opening actions", () => {
  it("allows immediate gathering but prevents repeated clicking and clock rollback", () => {
    const state = createInitialState(1000);
    const gathered = applyAction(state, { type: "gather-food" }, 1000);
    expect(gathered.resources.food).toBe(32);
    expect(applyAction(gathered, { type: "gather-food" }, 1001)).toBe(gathered);
    expect(applyAction(gathered, { type: "gather-food" }, 0)).toBe(gathered);
    expect(applyAction(gathered, { type: "gather-food" }, 31000).resources.food).toBe(34);
  });

  it("rejects invalid timestamps without altering progress", () => {
    const state = createInitialState(1000);
    expect(applyAction(state, { type: "gather-food" }, Infinity)).toBe(state);
    expect(applyAction(state, { type: "gather-food" }, NaN)).toBe(state);
  });
});
