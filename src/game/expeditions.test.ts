import { describe, expect, it } from "vitest";
import { createInitialState } from "./state";
import { applyAction } from "./actions";
import { reconcile, economyRates } from "./simulation";
import { availableWorkers } from "./requirements";
import { decodeSave, encodeSave } from "./save";
import { EXPEDITIONS } from "../content/expeditions";

function prepared() {
  const state = createInitialState(0);
  state.population = 8;
  state.resources = { ...state.resources, food: 100, coin: 100, knowledge: 100, authority: 100 };
  state.lifetimeAuthority = 100;
  state.buildings = { ...state.buildings, fields: 1, "oil-press": 1, "market-stall": 1, "scrivener-house": 1, "ruined-cistern": 1 };
  state.jobs = { ...state.jobs, forager: 3, lamplighter: 1, scrivener: 1 };
  state.triggeredEvents = ["household", "lamp-complaint"];
  state.chronicle.push("household", "lamp-complaint", "lamp-examination", "ledger-keeping");
  state.research = ["examine-old-lamps", "ledger-keeping"];
  return state;
}

describe("expedition lifecycle", () => {
  it("reserves idle inhabitants, pays provisions, and permits only one expedition", () => {
    const state = prepared();
    const sent = applyAction(state, { type: "start-expedition", destination: "old-cistern", workers: 2 }, 0);
    expect(sent.activeExpedition?.workers).toBe(2);
    expect(availableWorkers(sent)).toBe(1);
    expect(sent.resources.food).toBe(100 - EXPEDITIONS["old-cistern"].foodPerWorker * 2);
    expect(sent.jobs).toEqual(state.jobs);
    const full = applyAction(sent, { type: "assign-worker", job: "forager", delta: 1 }, 0);
    expect(availableWorkers(full)).toBe(0);
    expect(applyAction(full, { type: "assign-worker", job: "scrivener", delta: 1 }, 0)).toBe(full);
    expect(() => decodeSave(JSON.stringify({ ...full, jobs: { ...full.jobs, scrivener: 2 } }))).toThrow();
    expect(() => decodeSave(JSON.stringify({ ...sent, activeExpedition: { ...sent.activeExpedition, returnsAt: 1 } }))).toThrow();
    expect(applyAction(sent, { type: "start-expedition", destination: "old-cistern", workers: 1 }, 0)).toBe(sent);
    expect(decodeSave(encodeSave(sent))).toEqual(sent);
  });

  it("rejects locked destinations, invalid parties, and insufficient provisions", () => {
    for (const workers of [0, 4, 1.5, NaN, Infinity]) {
      const state = prepared();
      expect(applyAction(state, { type: "start-expedition", destination: "old-cistern", workers }, 0)).toBe(state);
    }
    const state = prepared();
    state.jobs.forager = 6;
    expect(applyAction(state, { type: "start-expedition", destination: "old-cistern", workers: 1 }, 0)).toBe(state);
    state.jobs.forager = 3;
    state.resources.food = 0;
    expect(applyAction(state, { type: "start-expedition", destination: "old-cistern", workers: 1 }, 0)).toBe(state);
    const initial = createInitialState(0);
    expect(applyAction(initial, { type: "start-expedition", destination: "old-cistern", workers: 1 }, 0)).toBe(initial);
    expect(applyAction(state, { type: "start-expedition", destination: "unknown", workers: 1 } as never, 0)).toBe(state);
  });

  it("automatically returns idle workers and grants first discoveries once", () => {
    const sent = applyAction(prepared(), { type: "start-expedition", destination: "old-cistern", workers: 2 }, 0);
    const end = sent.activeExpedition!.returnsAt;
    expect(reconcile(sent, end - 1).state.activeExpedition).not.toBeNull();
    const returned = reconcile(sent, end);
    expect(returned.state.activeExpedition).toBeNull();
    expect(availableWorkers(returned.state)).toBe(3);
    expect(returned.state.resources.relics).toBe(2);
    expect(returned.state.completedExpeditions).toEqual(["old-cistern"]);
    expect(returned.state.chronicle.filter(id => id === "cistern-find")).toHaveLength(1);
    expect(returned.summary.completedExpeditions).toEqual(["old-cistern"]);
    expect(reconcile(returned.state, end).state).toBe(returned.state);
    const repeat = applyAction(returned.state, { type: "start-expedition", destination: "old-cistern", workers: 1 }, end);
    const again = reconcile(repeat, repeat.activeExpedition!.returnsAt).state;
    expect(again.resources.relics).toBe(3);
    expect(again.chronicle.filter(id => id === "cistern-find")).toHaveLength(1);
    expect(again.expeditionLog).toHaveLength(2);
    expect(decodeSave(encodeSave(again))).toEqual(again);
  });

  it("splits production at a Food reward and agrees with foreground ticks", () => {
    const state = prepared();
    state.completedExpeditions = ["old-cistern"];
    state.chronicle.push("cistern-find");
    state.jobs.forager = 0;
    state.resources.food = 20;
    const sent = applyAction(state, { type: "start-expedition", destination: "abandoned-farmstead", workers: 1 }, 0);
    const end = sent.activeExpedition!.returnsAt + 100_000;
    const away = reconcile(sent, end).state;
    let ticking = sent;
    for (let now = 1000; now <= end; now += 1000) ticking = reconcile(ticking, now).state;
    for (const id of Object.keys(away.resources) as (keyof typeof away.resources)[]) expect(ticking.resources[id]).toBeCloseTo(away.resources[id], 7);
    expect(ticking.expeditionLog).toEqual(away.expeditionLog);
  });

  it("returns an expedition beyond the production cap without producing after the cap", () => {
    const state = prepared();
    const start = 9 * 60 * 60 * 1000;
    state.lastSimulatedAt = start;
    const sent = applyAction(state, { type: "start-expedition", destination: "old-cistern", workers: 2 }, start);
    // A save exported elsewhere may have a simulation clock earlier than departure.
    sent.lastSimulatedAt = 0;
    const now = 12 * 60 * 60 * 1000;
    const result = reconcile(sent, now);
    expect(result.summary.productionMs).toBe(8 * 60 * 60 * 1000);
    expect(result.state.activeExpedition).toBeNull();
    expect(result.state.resources.relics).toBe(2);
    expect(result.state.resources.knowledge).toBeCloseTo(sent.resources.knowledge + economyRates(sent).net.knowledge * 28_800);
    expect(result.state.expeditionLog[0].returnedAt).toBe(sent.activeExpedition!.returnsAt);
    expect(reconcile(result.state, now).summary.completedExpeditions).toEqual([]);
  });
  it("bounds return history without losing discoveries or duplicating rewards", () => {
    let state = prepared();
    for (let trip = 0; trip < 22; trip++) {
      state = applyAction(state, { type: "start-expedition", destination: "old-cistern", workers: 1 }, state.lastSimulatedAt);
      state = reconcile(state, state.activeExpedition!.returnsAt).state;
    }
    expect(state.expeditionLog).toHaveLength(20);
    expect(state.resources.relics).toBe(22);
    expect(state.completedExpeditions).toEqual(["old-cistern"]);
    expect(state.chronicle.filter(id => id === "cistern-find")).toHaveLength(1);
    expect(decodeSave(encodeSave(state))).toEqual(state);
  });

});
