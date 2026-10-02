import { describe, expect, it } from "vitest";
import { applyAction } from "./actions";
import { createInitialState } from "./state";
import { reconcile } from "./simulation";
import { decodeSave, encodeSave } from "./save";

describe("opening progression", () => {
  it("requires unlocks and pays escalating building costs without spending milestones", () => {
    const initial = createInitialState(0);
    expect(applyAction(initial, { type: "build", building: "fields" }, 0)).toBe(initial);
    const state = { ...initial, lifetimeAuthority: 30, resources: { ...initial.resources, food: 100, oil: 20, authority: 30 } };
    expect(applyAction(state, { type: "build", building: "oil-press" }, 0)).toBe(state);
    const first = applyAction(state, { type: "build", building: "fields" }, 0);
    expect(first.buildings.fields).toBe(1);
    expect(first.resources.food).toBe(80);
    expect(first.resources.authority).toBe(25);
    expect(first.lifetimeAuthority).toBe(30);
    const second = applyAction(first, { type: "build", building: "fields" }, 0);
    expect(second.resources.food).toBe(46);
    expect(second.resources.authority).toBe(16);
  });

  it("queues offline eligibility, preserves it on reload, and never admits automatically", () => {
    const initial = createInitialState(0);
    initial.buildings.fields = 1;
    initial.jobs = { ...initial.jobs, forager: 3, lamplighter: 2 };
    const state = reconcile(initial, 90_000).state;
    expect(state.pendingEvents).toEqual(["household"]);
    expect(state.population).toBe(5);
    const reloaded = decodeSave(encodeSave(state));
    const admitted = applyAction(reloaded, { type: "choose-event", event: "household" }, 90_000);
    expect(admitted.population).toBe(8);
    expect(admitted.jobs).toEqual(state.jobs);
    expect(admitted.pendingEvents).toEqual([]);
    expect(admitted.chronicle).toContain("household");
    expect(applyAction(admitted, { type: "choose-event", event: "household" }, 90_000)).toBe(admitted);
  });

  it("keeps choices pending when provisions or population capacity are insufficient", () => {
    const state = createInitialState(0);
    state.triggeredEvents = ["household"];
    state.pendingEvents = ["household"];
    expect(applyAction(state, { type: "choose-event", event: "household" }, 0)).toBe(state);
    state.resources.authority = 10;
    state.lifetimeAuthority = 10;
    state.population = 19;
    expect(applyAction(state, { type: "choose-event", event: "household" }, 0)).toBe(state);
  });

  it("requires a deliberate examination and persists the discovery once", () => {
    const state = createInitialState(0);
    state.resources.authority = 50;
    state.lifetimeAuthority = 50;
    expect(applyAction(state, { type: "research", research: "examine-old-lamps" }, 0)).toBe(state);
    state.buildings = { ...state.buildings, fields: 1, "oil-press": 1 };
    state.triggeredEvents = ["household", "lamp-complaint"];
    state.pendingEvents = ["lamp-complaint"];
    state.chronicle.push("oil-press-built", "household");
    const authorized = applyAction(state, { type: "choose-event", event: "lamp-complaint" }, 0);
    expect(authorized.research).toEqual([]);
    const examined = applyAction(authorized, { type: "research", research: "examine-old-lamps" }, 0);
    expect(examined.resources.food).toBe(15);
    expect(examined.resources.authority).toBe(35);
    expect(examined.chronicle.filter((id) => id === "lamp-examination")).toHaveLength(1);
    const saved = decodeSave(encodeSave(examined));
    expect(applyAction(saved, { type: "research", research: "examine-old-lamps" }, 0)).toBe(saved);
    expect(reconcile(saved, 1000).state.pendingEvents).toEqual([]);
  });
});
