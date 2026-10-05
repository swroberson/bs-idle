import { describe, expect, it } from "vitest";
import { applyAction } from "./actions";
import { createInitialState } from "./state";
import { reconcile } from "./simulation";
import { availableWorkers, jobUnlocked } from "./requirements";
import { BALANCE } from "../content/balance";
import { decodeSave, encodeSave } from "./save";

function ready() {
  const state = createInitialState(0);
  state.lifetimeAuthority = 10;
  state.resources.authority = 10;
  state.resources.food = 100;
  state.jobs.laborer = 1;
  return state;
}

describe("assigned construction crews", () => {
  it("reveals Laborers with Works and pays once without applying unfinished buildings", () => {
    expect(jobUnlocked(createInitialState(0), "laborer")).toBe(false);
    expect(jobUnlocked(ready(), "laborer")).toBe(true);
    const started = applyAction(ready(), { type: "build", building: "fields" }, 0);
    expect(started.buildings.fields).toBe(0);
    expect(started.resources.food).toBe(80);
    expect(started.resources.authority).toBe(5);
    expect(started.activeConstruction).toMatchObject({ kind: "building", id: "fields", workDone: 0 });
    expect(applyAction(started, { type: "build", building: "fields" }, 0)).toBe(started);
    expect(decodeSave(encodeSave(started))).toEqual(started);
  });

  it("lets a crew pause, resume and accelerate without losing completed work", () => {
    let state = applyAction(ready(), { type: "build", building: "fields" }, 0);
    state = applyAction(state, { type: "assign-worker", job: "laborer", delta: -1 }, 10_000);
    expect(state.activeConstruction?.workDone).toBe(10);
    state = reconcile(state, 100_000).state;
    expect(state.activeConstruction?.workDone).toBe(10);
    state = applyAction(state, { type: "assign-worker", job: "laborer", delta: 1 }, 100_000);
    state = applyAction(state, { type: "assign-worker", job: "laborer", delta: 1 }, 100_000);
    state = reconcile(state, 109_000).state;
    expect(state.buildings.fields).toBe(0);
    state = reconcile(state, 110_000).state;
    expect(state.buildings.fields).toBe(1);
    expect(state.activeConstruction).toBeNull();
    expect(state.jobs.laborer).toBe(2);
  });

  it("splits offline production at completion and records Oil Press discovery exactly once", () => {
    const state = ready();
    state.buildings.fields = 1;
    state.resources.authority = 10;
    let started = applyAction(state, { type: "build", building: "oil-press" }, 0);
    const offline = reconcile(started, 90_000);
    expect(offline.state.buildings["oil-press"]).toBe(1);
    expect(offline.state.resources.oil).toBeCloseTo(24.5);
    for (let n = 1; n <= 90; n++) started = reconcile(started, n * 1000).state;
    for (const id of Object.keys(started.resources) as (keyof typeof started.resources)[]) expect(started.resources[id]).toBeCloseTo(offline.state.resources[id], 7);
    expect(offline.state.chronicle.filter(id => id === "oil-press-built")).toHaveLength(1);
    expect(offline.summary.completedConstruction).toEqual([{ kind: "building", id: "oil-press" }]);
    expect(reconcile(offline.state, 90_000).summary.completedConstruction).toEqual([]);
    expect(decodeSave(encodeSave(offline.state))).toEqual(offline.state);
  });

  it("halves work after Food depletion with foreground/offline agreement", () => {
    const state = ready();
    state.resources.food = 21.25;
    const started = applyAction(state, { type: "build", building: "fields" }, 0);
    const away = reconcile(started, 30_000).state;
    expect(away.resources.food).toBe(0);
    expect(away.activeConstruction?.workDone).toBeCloseTo(20);
    let ticking = started;
    for (let n = 1; n <= 30; n++) ticking = reconcile(ticking, n * 1000).state;
    expect(ticking.activeConstruction?.workDone).toBeCloseTo(20);
    expect(reconcile(away, 50_000).state.buildings.fields).toBe(1);
  });

  it("migrates version-7 progress without rebuilding completed structures or changing allocations", () => {
    const old = JSON.parse(JSON.stringify(ready()));
    old.version = 7;
    delete old.activeConstruction;
    const migrated = decodeSave(JSON.stringify(old));
    expect(migrated.version).toBe(8);
    expect(migrated.activeConstruction).toBeNull();
    expect(migrated.resources).toEqual(old.resources);
    expect(migrated.jobs).toEqual(old.jobs);
    expect(migrated.lastSimulatedAt).toBe(0);
  });

  it("lets completed Fields restore Food production during an offline shortage", () => {
    const state = ready();
    state.jobs.forager = 1;
    state.resources.food = 20;
    const started = applyAction(state, { type: "build", building: "fields" }, 0);
    const returned = reconcile(started, 100_000).state;
    expect(returned.buildings.fields).toBe(1);
    expect(returned.resources.food).toBeCloseTo(1.4);
    let ticking = started;
    for (let n = 1; n <= 100; n++) ticking = reconcile(ticking, n * 1000).state;
    expect(ticking.resources.food).toBeCloseTo(returned.resources.food, 7);
  });

  it("requires a crew to start and prevents a second project without spending its supplies", () => {
    const state = ready();
    state.jobs.laborer = 0;
    expect(applyAction(state, { type: "build", building: "fields" }, 0)).toBe(state);
    state.jobs.laborer = 2;
    const started = applyAction(state, { type: "build", building: "fields" }, 0);
    expect(availableWorkers(started)).toBe(3);
    const halfway = reconcile(started, 10_000).state;
    expect(decodeSave(encodeSave(halfway))).toEqual(halfway);
    expect(applyAction(halfway, { type: "build", building: "oil-press" }, 10_000)).toBe(halfway);
    const finished = reconcile(halfway, 15_000).state;
    expect(finished.buildings.fields).toBe(1);
    expect(availableWorkers(finished)).toBe(3);
  });

  it("caps offline work and production, preserving paused projects and consuming the interval once", () => {
    const started = applyAction(ready(), { type: "build", building: "fields" }, 0);
    const capped = reconcile(started, 12 * 60 * 60 * 1000);
    const eightHours = reconcile(started, BALANCE.offlineProductionCapMs);
    expect(capped.summary.productionMs).toBe(BALANCE.offlineProductionCapMs);
    expect(capped.state.resources).toEqual(eightHours.state.resources);
    expect(capped.state.buildings).toEqual(eightHours.state.buildings);
    expect(reconcile(capped.state, capped.state.lastSimulatedAt).summary.completedConstruction).toEqual([]);
    const paused = applyAction(started, { type: "assign-worker", job: "laborer", delta: -1 }, 10_000);
    const returned = reconcile(paused, 12 * 60 * 60 * 1000).state;
    expect(returned.activeConstruction?.workDone).toBe(10);
    expect(decodeSave(encodeSave(returned))).toEqual(returned);
  });

  it.each([
    { kind: "building", id: "unknown", workDone: 0, startedAt: 0 },
    { kind: "building", id: "fields", workDone: -1, startedAt: 0 },
    { kind: "building", id: "fields", workDone: 30, startedAt: 0 },
    { kind: "building", id: "fields", workDone: 0, startedAt: 1 },
    { kind: "building", id: "buried-engine", workDone: 0, startedAt: 0 },
    { kind: "research", id: "crop-rotation", workDone: 0, startedAt: 0 },
    { kind: "research", id: "restore-conduit", workDone: 0, startedAt: 0 },
    { kind: "building", id: "fields", workDone: "1", startedAt: 0 },
    [],
    {},
  ])("rejects malformed or unearned project data: %j", activeConstruction => {
    expect(() => decodeSave(JSON.stringify({ ...ready(), activeConstruction }))).toThrow();
  });

  it("requires a construction field in current saves and rejects projects smuggled into version 7", () => {
    const value = JSON.parse(JSON.stringify(ready()));
    delete value.activeConstruction;
    expect(() => decodeSave(JSON.stringify(value))).toThrow();
    value.version = 7;
    value.activeConstruction = null;
    expect(() => decodeSave(JSON.stringify(value))).toThrow();
  });
});
