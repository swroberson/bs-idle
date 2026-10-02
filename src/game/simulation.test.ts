import { describe, expect, it } from "vitest";
import { BALANCE } from "../content/balance";
import { createInitialState } from "./state";
import { applyAction } from "./actions";
import { economyRates, reconcile } from "./simulation";

describe("elapsed-time economy", () => {
  it("recovers lamp output when Oil and Authority are exhausted before an Oil Press", () => {
    const state = createInitialState(0);
    state.resources.oil = 0;
    state.jobs = { ...state.jobs, forager: 3, lamplighter: 1 };
    const fuel = applyAction(state, { type: "render-oil" }, 0);
    expect(fuel.resources.food).toBe(25);
    expect(fuel.resources.oil).toBe(2);
    expect(reconcile(fuel, 20_000).state.resources.authority).toBeCloseTo(2);
    expect(applyAction(fuel, { type: "render-oil" }, 1000)).toBe(fuel);
    state.resources.food = 0;
    expect(applyAction(state, { type: "render-oil" }, 0)).toBe(state);
  });
  it("accounts for every inhabitant and produces from assigned workers only", () => {
    const state = createInitialState(0);
    state.jobs = { ...state.jobs, forager: 2, lamplighter: 1 };
    const result = reconcile(state, 10_000).state;
    expect(result.resources.food).toBeCloseTo(31.15);
    expect(result.resources.oil).toBeCloseTo(19.25);
    expect(result.resources.authority).toBeCloseTo(1);
    expect(result.lifetimeAuthority).toBeCloseTo(1);
    expect(state.resources.food).toBe(30);
  });

  it("agrees across short foreground ticks and a single interval through both shortages", () => {
    const state = createInitialState(0);
    state.jobs = { ...state.jobs, forager: 0, lamplighter: 5 };
    state.resources = { ...state.resources, food: 2, oil: 3, authority: 0 };
    const away = reconcile(state, 300_000).state;
    let foreground = state;
    for (let time = 137; time < 300_000; time += 137) foreground = reconcile(foreground, time).state;
    foreground = reconcile(foreground, 300_000).state;
    for (const id of ["food", "oil", "authority"] as const) expect(foreground.resources[id]).toBeCloseTo(away.resources[id], 7);
    expect(away.resources.food).toBe(0);
    expect(away.resources.oil).toBe(0);
    expect(away.resources.authority).toBeCloseTo(4);
  });

  it("uses Oil as it is pressed at zero stores, independent of tick frequency", () => {
    const state = createInitialState(0);
    state.jobs = { ...state.jobs, forager: 2, lamplighter: 3 };
    state.buildings["oil-press"] = 1;
    state.resources.oil = 0;
    const result = reconcile(state, 60_000).state;
    expect(result.resources.oil).toBe(0);
    expect(result.resources.authority).toBeCloseTo(8);
    let stepped = state;
    for (let time = 1000; time <= 60_000; time += 1000) stepped = reconcile(stepped, time).state;
    expect(stepped.resources.authority).toBeCloseTo(result.resources.authority);
  });

  it("recovers from starvation by foraging and manual gathering", () => {
    const state = createInitialState(0);
    state.resources.food = 0;
    state.jobs = { ...state.jobs, forager: 2, lamplighter: 1 };
    expect(reconcile(state, 10_000).state.resources.food).toBeGreaterThan(0);
    state.jobs.forager = 0;
    expect(economyRates(state).starving).toBe(true);
    const recovered = applyAction(state, { type: "gather-food" }, 0);
    expect(economyRates(recovered).starving).toBe(false);
    expect(economyRates(recovered).net.authority).toBeGreaterThan(economyRates(state).net.authority);
  });

  it("caps an absence and consumes the whole timestamp so reload cannot earn it twice", () => {
    const state = createInitialState(0);
    state.jobs.forager = 5;
    const now = 12 * 60 * 60 * 1000;
    const result = reconcile(state, now);
    expect(result.summary.elapsedMs).toBe(now);
    expect(result.summary.productionMs).toBe(BALANCE.offlineProductionCapMs);
    expect(result.state.resources.food).toBeCloseTo(30 + .475 * 28_800);
    expect(result.state.lastSimulatedAt).toBe(now);
    expect(reconcile(result.state, now).state).toBe(result.state);
    expect(reconcile(result.state, -1000).state).toBe(result.state);
  });

  it("conserves assignments and rejects invalid worker actions", () => {
    let state = createInitialState(0);
    for (let n = 0; n < 5; n++) state = applyAction(state, { type: "assign-worker", job: "forager", delta: 1 }, 0);
    expect(applyAction(state, { type: "assign-worker", job: "lamplighter", delta: 1 }, 0)).toBe(state);
    expect(applyAction(state, { type: "assign-worker", job: "forager", delta: 2 } as never, 0)).toBe(state);
    expect(applyAction(state, { type: "assign-worker", job: "unknown", delta: 1 } as never, 0)).toBe(state);
    const released = applyAction(state, { type: "assign-worker", job: "forager", delta: -1 }, 0);
    expect(released.jobs.forager).toBe(4);
  });
});
