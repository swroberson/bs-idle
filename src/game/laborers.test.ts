import { describe, expect, it } from "vitest";
import { applyAction } from "./actions";
import { buildingCost, availableWorkers, jobUnlocked } from "./requirements";
import { createInitialState } from "./state";
import { decodeSave, encodeSave } from "./save";
import { reconcile } from "./simulation";

function workshop() {
  const state = createInitialState(0);
  state.population = 8;
  state.lifetimeAuthority = 100;
  state.resources = { ...state.resources, food: 100, coin: 100, authority: 100, knowledge: 100 };
  state.buildings = { ...state.buildings, fields: 1, "oil-press": 1, "market-stall": 1, "scrivener-house": 1, smithy: 1 };
  state.triggeredEvents = ["household", "lamp-complaint"];
  state.research = ["examine-old-lamps", "ledger-keeping"];
  state.chronicle.push("oil-press-built", "household", "lamp-complaint", "lamp-examination", "ledger-keeping", "smithy-built");
  return state;
}

describe("construction labor", () => {
  it("reveals Laborers after the Smithy and shares the finite worker pool", () => {
    const initial = createInitialState(0);
    expect(jobUnlocked(initial, "laborer")).toBe(false);
    expect(applyAction(initial, { type: "assign-worker", job: "laborer", delta: 1 }, 0)).toBe(initial);
    let state = workshop();
    for (let i = 0; i < 9; i++) state = applyAction(state, { type: "assign-worker", job: "laborer", delta: 1 }, 0);
    expect(state.jobs.laborer).toBe(8);
    expect(availableWorkers(state)).toBe(0);
    state = applyAction(state, { type: "assign-worker", job: "laborer", delta: -1 }, 0);
    expect(availableWorkers(state)).toBe(1);
  });

  it("discounts only escalated building Coin costs, caps Laborers and charges the displayed price", () => {
    const state = workshop();
    state.jobs.laborer = 1;
    expect(buildingCost(state, "market-stall")).toEqual({ food: 51, authority: 26 });
    expect(buildingCost(state, "lamp-house")).toEqual({ coin: 19, authority: 15 });
    state.jobs.laborer = 8;
    expect(buildingCost(state, "lamp-house")).toEqual({ coin: 16, authority: 15 });
    const built = applyAction(state, { type: "build", building: "lamp-house" }, 0);
    expect(built.resources.coin).toBe(84);
    expect(built.resources.authority).toBe(85);
    expect(buildingCost(built, "lamp-house")).toEqual({ coin: 28, authority: 26 });
    state.jobs.laborer = 0;
    expect(buildingCost(state, "lamp-house").coin).toBe(20);
  });

  it("applies Stoneworking once, compounds discounts and leaves research costs intact", () => {
    const state = workshop();
    state.jobs.laborer = 4;
    const studied = applyAction(state, { type: "research", research: "stoneworking" }, 0);
    expect(studied.resources.coin).toBe(80);
    expect(studied.resources.knowledge).toBe(84);
    expect(buildingCost(studied, "lamp-house")).toEqual({ coin: 15, authority: 15 });
    expect(buildingCost(studied, "buried-engine")).toEqual({ coin: 18, knowledge: 8 });
    expect(applyAction(studied, { type: "research", research: "stoneworking" }, 0)).toBe(studied);
    expect(studied.chronicle.filter(id => id === "stoneworking")).toHaveLength(1);
    expect(decodeSave(encodeSave(studied))).toEqual(studied);
  });

  it("keeps labor assigned across offline shortages with foreground-equivalent production", () => {
    const state = workshop();
    state.resources.food = 1;
    state.jobs.laborer = 4;
    const offline = reconcile(state, 60_000).state;
    let foreground = state;
    for (let second = 1; second <= 60; second++) foreground = reconcile(foreground, second * 1000).state;
    expect(offline.resources.food).toBe(0);
    expect(offline.resources.coin).toBeCloseTo(foreground.resources.coin);
    expect(offline.jobs.laborer).toBe(4);
    expect(buildingCost(offline, "lamp-house").coin).toBe(16);
  });

  it("migrates existing version-5 saves without altering resources, records or workers", () => {
    const old = JSON.parse(JSON.stringify(workshop()));
    old.version = 5;
    delete old.jobs.laborer; delete old.jobs.scavenger; delete old.eventChoices;
    old.jobs = { forager: 3, lamplighter: 1, scrivener: 1 };
    old.buildings["ruined-cistern"] = 1;
    old.activeExpedition = { destination: "old-cistern", workers: 2, startedAt: 0, returnsAt: 180000 };
    old.readChronicle = ["appointment"];
    old.dismissedIllustrations = ["keeper-office"];
    const migrated = decodeSave(JSON.stringify(old));
    expect(migrated.version).toBe(7);
    expect(migrated.jobs).toEqual({ ...old.jobs, laborer: 0, scavenger: 0 });
    expect(migrated.resources).toEqual(old.resources);
    expect(migrated.chronicle).toEqual(old.chronicle);
    expect(migrated.readChronicle).toEqual(old.readChronicle);
    expect(migrated.dismissedIllustrations).toEqual(old.dismissedIllustrations);
    expect(migrated.activeExpedition).toEqual(old.activeExpedition);
    expect(migrated.lastSimulatedAt).toBe(old.lastSimulatedAt);
    expect(() => decodeSave(JSON.stringify({ ...old, jobs: { ...old.jobs, intruder: 0 } }))).toThrow();
    expect(() => decodeSave(JSON.stringify({ ...old, research: [...old.research, "stoneworking"], chronicle: [...old.chronicle, "stoneworking"] }))).toThrow();
  });

  it("rejects missing current allocations and locked or overcommitted Laborers on import", () => {
    const state = createInitialState(0);
    expect(() => decodeSave(JSON.stringify({ ...state, jobs: { ...state.jobs, laborer: 1 } }))).toThrow();
    const valid = workshop();
    valid.jobs.laborer = 8;
    expect(decodeSave(encodeSave(valid)).jobs.laborer).toBe(8);
    expect(() => decodeSave(JSON.stringify({ ...valid, jobs: { ...valid.jobs, forager: 1 } }))).toThrow();
    const missing = JSON.parse(JSON.stringify(valid));
    delete missing.jobs.laborer;
    expect(() => decodeSave(JSON.stringify(missing))).toThrow();
  });
});
