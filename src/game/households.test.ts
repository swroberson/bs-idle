import { describe, expect, it } from "vitest";
import { applyAction } from "./actions";
import { queueEvents } from "./progression";
import { createInitialState } from "./state";
import { reconcile } from "./simulation";
import { decodeSave, encodeSave } from "./save";
import { availableWorkers } from "./requirements";

function settledWard() {
  const state = createInitialState(0);
  state.population = 8;
  state.lifetimeAuthority = 100;
  state.resources = { ...state.resources, food: 60, authority: 30, coin: 100, knowledge: 100 };
  state.buildings = { ...state.buildings, fields: 2, "oil-press": 1, "market-stall": 1, "scrivener-house": 1, smithy: 1 };
  state.jobs = { ...state.jobs, forager: 3, lamplighter: 1, scrivener: 1, laborer: 1 };
  state.triggeredEvents = ["household", "lamp-complaint"];
  state.research = ["examine-old-lamps", "ledger-keeping", "stoneworking"];
  state.chronicle.push("oil-press-built", "household", "lamp-complaint", "lamp-examination", "ledger-keeping", "smithy-built", "stoneworking");
  return state;
}

describe("another household", () => {
  it("requires Stoneworking, expanded Fields, standing, provisions and population room", () => {
    const state = settledWard();
    for (const unavailable of [
      { ...state, research: state.research.filter(id => id !== "stoneworking") },
      { ...state, buildings: { ...state.buildings, fields: 1 } },
      { ...state, lifetimeAuthority: 79 },
      { ...state, resources: { ...state.resources, food: 49 } },
      { ...state, resources: { ...state.resources, authority: 19 } },
      { ...state, population: 19 },
    ]) expect(queueEvents(unavailable).pendingEvents).not.toContain("repair-household");
    expect(queueEvents(state).pendingEvents).toEqual(["repair-household"]);
  });

  it("queues offline without choosing, persists through spending and admits idle inhabitants once", () => {
    const queued = reconcile(settledWard(), 1000).state;
    expect(queued.pendingEvents).toEqual(["repair-household"]);
    expect(queued.population).toBe(8);
    const saved = decodeSave(encodeSave(queued));
    const depleted = { ...saved, resources: { ...saved.resources, food: 0 } };
    expect(applyAction(depleted, { type: "choose-event", event: "repair-household" }, 1000)).toBe(depleted);
    expect(decodeSave(encodeSave(depleted)).pendingEvents).toEqual(["repair-household"]);
    const admitted = applyAction(saved, { type: "choose-event", event: "repair-household" }, 1000);
    expect(admitted.population).toBe(10);
    expect(admitted.jobs).toEqual(saved.jobs);
    expect(availableWorkers(admitted)).toBe(availableWorkers(saved) + 2);
    expect(admitted.resources.food).toBeCloseTo(saved.resources.food - 50);
    expect(admitted.resources.authority).toBeCloseTo(saved.resources.authority - 20);
    expect(admitted.chronicle.filter(id => id === "repair-household")).toHaveLength(1);
    expect(applyAction(admitted, { type: "choose-event", event: "repair-household" }, 1000)).toBe(admitted);
    expect(reconcile(decodeSave(encodeSave(admitted)), 2000).state.pendingEvents).toEqual([]);
  });

  it("keeps queue order and enforces the cap again at admission", () => {
    const state = settledWard();
    state.chronicle = state.chronicle.filter(id => id !== "lamp-complaint");
    state.pendingEvents = ["lamp-complaint"];
    const queued = queueEvents(state);
    expect(queued.pendingEvents).toEqual(["lamp-complaint", "repair-household"]);
    expect(applyAction(queued, { type: "choose-event", event: "repair-household" }, 0)).toBe(queued);
    const waiting = queueEvents(settledWard());
    waiting.population = 19;
    expect(applyAction(waiting, { type: "choose-event", event: "repair-household" }, 0)).toBe(waiting);
    waiting.population = 18;
    expect(applyAction(waiting, { type: "choose-event", event: "repair-household" }, 0).population).toBe(20);
  });

  it("retains an arrival reached during an offline interval even if provisions later run out", () => {
    const state = settledWard();
    state.jobs.forager = 0;
    state.resources.authority = 19.9;
    const offline = reconcile(state, 600_000).state;
    let foreground = state;
    for (let second = 1; second <= 600; second++) foreground = reconcile(foreground, second * 1000).state;
    expect(offline.resources.food).toBe(0);
    expect(offline.pendingEvents).toEqual(["repair-household"]);
    expect(offline.pendingEvents).toEqual(foreground.pendingEvents);
    expect(offline.population).toBe(8);
    expect(decodeSave(encodeSave(offline)).pendingEvents).toEqual(["repair-household"]);
  });

  it("rejects a household record or pending choice with missing durable prerequisites", () => {
    const state = queueEvents(settledWard());
    const missing = { ...state, research: state.research.filter(id => id !== "stoneworking"), chronicle: state.chronicle.filter(id => id !== "stoneworking") };
    expect(() => decodeSave(JSON.stringify(missing))).toThrow();
    expect(() => decodeSave(JSON.stringify({ ...state, pendingEvents: [] }))).toThrow();
  });
});
