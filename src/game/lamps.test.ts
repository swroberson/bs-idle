import { describe, expect, it } from "vitest";
import { createInitialState } from "./state";
import { economyRates, reconcile } from "./simulation";
import { applyAction } from "./actions";
import { decodeSave, encodeSave } from "./save";
import { eventRequirements } from "./requirements";

function tendedWard() {
  const state = createInitialState(0);
  state.jobs.forager = 3;
  state.jobs.lamplighter = 2;
  return state;
}

describe("the Keeper's lamps", () => {
  it("burns the same fuel regardless of the assigned tending crew", () => {
    const state = tendedWard();
    const draw = economyRates(state).net.oil;
    state.jobs.lamplighter = 0;
    expect(economyRates(state).net.oil).toBeCloseTo(draw);
    expect(draw).toBeCloseTo(-0.075);
  });

  it("allows a brief reassignment, then extinguishes lamps one at a time", () => {
    let state = tendedWard();
    state.jobs.lamplighter = 1;
    state = reconcile(state, 29_000).state;
    expect(state.lamps.lit).toBe(6);
    state = applyAction(state, { type: "assign-worker", job: "lamplighter", delta: 1 }, 29_000);
    expect(reconcile(state, 31_000).state.lamps.lit).toBe(6);
    state = applyAction(state, { type: "assign-worker", job: "lamplighter", delta: -1 }, 31_000);
    expect(reconcile(state, 61_000).state.lamps.lit).toBe(5);
    expect(reconcile(state, 121_000).state.lamps.lit).toBe(3);
  });

  it("loses stored standing after sustained darkness without erasing milestones or creating debt", () => {
    const state = tendedWard();
    state.resources.oil = 0;
    state.resources.authority = 20;
    state.lifetimeAuthority = 100;
    const result = reconcile(state, 600_000);
    expect(result.state.lamps.lit).toBe(0);
    expect(result.state.resources.authority).toBeLessThan(20);
    expect(result.state.lifetimeAuthority).toBeGreaterThanOrEqual(100);
    expect(result.summary.lamps.authorityLost).toBeGreaterThan(0);
    expect(reconcile(result.state, 36_000_000).state.resources.authority).toBe(0);
  });

  it("recovers automatically once fuel and tending are available and records only the first outage", () => {
    const state = tendedWard();
    state.resources.oil = 0;
    let next = reconcile(state, 180_000).state;
    next.resources.oil = 10;
    next = reconcile(next, 240_000).state;
    expect(next.lamps.lit).toBe(6);
    expect(next.lamps.darknessSeconds).toBe(0);
    expect(next.chronicle.filter(id => id === "lamp-outage")).toHaveLength(1);
    next.resources.oil = 0;
    expect(reconcile(next, 420_000).state.chronicle.filter(id => id === "lamp-outage")).toHaveLength(1);
  });

  it("blocks household admission while lamps are out, but leaves other reports available", () => {
    const state = tendedWard();
    state.resources.authority = 40;
    state.resources.food = 80;
    const dark = reconcile({ ...state, jobs: { ...state.jobs, lamplighter: 0 } }, 30_000).state;
    expect(eventRequirements(dark, "household")).toContain("Ordinary lamps 5 / 6 lit");
    expect(eventRequirements(dark, "lamp-complaint")).toEqual([]);
  });

  it("agrees across irregular foreground ticks, save reloads and one offline interval", () => {
    const state = tendedWard();
    state.buildings.fields = 1;
    state.buildings["oil-press"] = 1;
    state.chronicle.push("oil-press-built");
    state.resources.oil = 1;
    const away = reconcile(state, 1_800_000).state;
    let foreground = state;
    for (let at = 137; at < 1_800_000; at += 137) foreground = reconcile(foreground, at).state;
    foreground = reconcile(decodeSave(encodeSave(foreground)), 1_800_000).state;
    for (const id of ["oil", "authority"] as const) expect(foreground.resources[id]).toBeCloseTo(away.resources[id], 7);
    expect(foreground.lifetimeAuthority).toBeCloseTo(away.lifetimeAuthority, 7);
    expect(foreground.lamps.lit).toBe(away.lamps.lit);
    expect(foreground.lamps.transitionSeconds).toBeCloseTo(away.lamps.transitionSeconds, 7);
    expect(foreground.chronicle).toEqual(away.chronicle);
  });

  it("caps darkness consequences at eight hours and never repeats an elapsed interval", () => {
    const state = tendedWard();
    state.resources.oil = 0;
    const capped = reconcile(state, 28_800_000);
    const longer = reconcile(state, 43_200_000);
    expect(longer.state.lamps).toEqual(capped.state.lamps);
    expect(longer.state.lifetimeAuthority).toBe(capped.state.lifetimeAuthority);
    expect(longer.summary.lamps).toEqual(capped.summary.lamps);
    expect(reconcile(longer.state, 43_200_000).state).toBe(longer.state);
  });

  it("migrates old progress without confiscating supplies or inventing a past outage", () => {
    const current = tendedWard();
    current.resources.oil = 160;
    const legacy = JSON.parse(JSON.stringify(current));
    legacy.version = 9;
    delete legacy.lamps;
    const migrated = decodeSave(JSON.stringify(legacy));
    expect(migrated.resources.oil).toBe(160);
    expect(migrated.lamps.lit).toBe(6);
    expect(migrated.chronicle).not.toContain("lamp-outage");
    expect(decodeSave(encodeSave(migrated))).toEqual(migrated);
  });

  it.each([[0, 0, 0], [0, 1, 2], [0, 2, 2], [1, 3, 2], [1, 1, 1], [1, 3, 0]] as const)(
    "reconciles depleted Food, %s Oil, press level %s and %s tenders consistently", (oil, press, tenders) => {
      const state = tendedWard();
      state.jobs = { ...state.jobs, forager: 0, lamplighter: tenders };
      state.resources.food = 1;
      state.resources.oil = oil;
      state.resources.authority = 20;
      state.lifetimeAuthority = 20;
      state.buildings["oil-press"] = press;
      const away = reconcile(state, 900_000).state;
      let foreground = state;
      for (let at = 1157; at < 900_000; at += 1157) foreground = reconcile(foreground, at).state;
      foreground = reconcile(foreground, 900_000).state;
      for (const id of ["food", "oil", "authority"] as const) expect(foreground.resources[id]).toBeCloseTo(away.resources[id], 7);
      expect(foreground.lifetimeAuthority).toBeCloseTo(away.lifetimeAuthority, 7);
      expect(foreground.lamps.lit).toBe(away.lamps.lit);
      expect(foreground.lamps.transition).toBe(away.lamps.transition);
      expect(foreground.lamps.transitionSeconds).toBeCloseTo(away.lamps.transitionSeconds, 7);
      expect(foreground.lamps.darknessSeconds).toBeCloseTo(away.lamps.darknessSeconds, 7);
    },
  );

  it("does not let Food shortage conserve lamp fuel or excess crew inflate Authority", () => {
    const state = tendedWard();
    const normal = economyRates(state);
    state.resources.food = 0;
    state.jobs.forager = 0;
    state.jobs.lamplighter = 5;
    const shortage = economyRates(state);
    expect(shortage.net.oil).toBe(normal.net.oil);
    expect(shortage.authorityProduction).toBeCloseTo(normal.authorityProduction / 2);
  });

  it("preserves an in-progress outage across saving rather than granting another grace period", () => {
    const state = tendedWard();
    state.jobs.lamplighter = 0;
    const saved = decodeSave(encodeSave(reconcile(state, 29_000).state));
    expect(reconcile(saved, 30_000).state.lamps.lit).toBe(5);
  });

  it("starts Authority loss at the grace boundary and clears it after full relighting", () => {
    const state = tendedWard();
    state.jobs.lamplighter = 1;
    expect(economyRates(reconcile(state, 149_000).state).lamps.authorityLoss).toBe(0);
    const dark = reconcile(state, 150_000).state;
    expect(economyRates(dark).lamps.authorityLoss).toBeCloseTo(0.015);
    dark.jobs.lamplighter = 2;
    const recovered = reconcile(dark, 180_000).state;
    expect(recovered.lamps.lit).toBe(6);
    expect(economyRates(recovered).lamps.authorityLoss).toBe(0);
  });

  it.each([null, { lit: 7 }, { lit: -1 }, { lit: 1.5 }])("rejects malformed lamp state %s", lamps => {
    expect(() => decodeSave(JSON.stringify({ ...tendedWard(), lamps }))).toThrow();
  });

  it.each([
    { lit: 7 }, { lit: 1.5 }, { transition: "unknown" }, { transition: "out", transitionSeconds: 30 },
    { transitionSeconds: 1 }, { darknessSeconds: 121 }, { darknessSeconds: 1 },
    { lit: 5 }, { extra: true },
  ])("validates each persisted lamp field and its record relationship: %j", patch => {
    const state = tendedWard();
    expect(() => decodeSave(JSON.stringify({ ...state, lamps: { ...state.lamps, ...patch } }))).toThrow();
  });
});
