import { describe, expect, it } from "vitest";
import { createInitialState } from "./state";
import { applyAction } from "./actions";
import { economyRates } from "./simulation";
import { decodeSave, encodeSave } from "./save";
import { resourceVisible } from "./requirements";

function openingSave() {
  return { version: 2, resources: { food: 50, oil: 20, authority: 30 }, population: 8,
    jobs: { forager: 3, lamplighter: 2 }, buildings: { fields: 1, "oil-press": 1 }, lifetimeAuthority: 60,
    triggeredEvents: ["household", "lamp-complaint"], pendingEvents: [], research: ["examine-old-lamps"],
    chronicle: ["appointment", "household", "lamp-complaint", "lamp-examination"], lastSimulatedAt: 123000, lastGatheredAt: null };
}

describe("scholarship and save compatibility", () => {
  it("migrates a version-2 discovery without changing stores, jobs or elapsed time", () => {
    const old = openingSave();
    const migrated = decodeSave(JSON.stringify(old), 999000);
    expect(migrated.version).toBe(7);
    expect(migrated.lastSimulatedAt).toBe(old.lastSimulatedAt);
    expect(migrated.resources).toEqual({ ...createInitialState(0).resources, ...old.resources });
    expect(migrated.jobs).toEqual({ ...old.jobs, scrivener: 0, laborer: 0, scavenger: 0 });
    expect(migrated.activeExpedition).toBeNull();
    expect(decodeSave(encodeSave(migrated))).toEqual(migrated);
  });

  it("keeps later resources hidden and prevents assigning locked Scriveners", () => {
    const state = createInitialState(0);
    expect(resourceVisible(state, "coin")).toBe(false);
    expect(resourceVisible(state, "knowledge")).toBe(false);
    expect(resourceVisible(state, "relics")).toBe(false);
    expect(applyAction(state, { type: "assign-worker", job: "scrivener", delta: 1 }, 0)).toBe(state);
  });

  it("uses building and research prerequisites, applies modifiers once, and preserves the discoveries", () => {
    let state = decodeSave(JSON.stringify(openingSave()));
    const now = state.lastSimulatedAt;
    state.resources.authority = 60;
    expect(applyAction(state, { type: "build", building: "market-stall" }, now)).toBe(state);
    state = applyAction(state, { type: "research", research: "ledger-keeping" }, now);
    state = applyAction(state, { type: "build", building: "market-stall" }, now);
    state.resources.coin = 100;
    state = applyAction(state, { type: "build", building: "scrivener-house" }, now);
    state = applyAction(state, { type: "assign-worker", job: "scrivener", delta: 1 }, now);
    state.resources.knowledge = 100;
    const before = economyRates(state).net;
    state = applyAction(state, { type: "research", research: "crop-rotation" }, now);
    expect(economyRates(state).net.food + state.population * .025).toBeCloseTo((before.food + state.population * .025) * 1.25);
    state = applyAction(state, { type: "research", research: "better-wicks" }, now);
    expect(economyRates(state).net.oil).toBeCloseTo(.1 - .15 * .75);
    expect(applyAction(state, { type: "research", research: "better-wicks" }, now)).toBe(state);
    expect(decodeSave(encodeSave(state))).toEqual(state);
    state.resources.food = 0;
    state.jobs.forager = 0;
    expect(economyRates(state).net.coin).toBeCloseTo(.05);
    expect(economyRates(state).net.knowledge).toBeCloseTo(.04);
  });

  it.each([
    { activeExpedition: { destination: "unknown", workers: 1, startedAt: 0, returnsAt: 180000 } },
    { activeExpedition: { destination: "old-cistern", workers: 4, startedAt: 0, returnsAt: 180000 } },
    { activeExpedition: { destination: "old-cistern", workers: 1, startedAt: 0, returnsAt: 1 } },
    { completedExpeditions: ["old-cistern"] },
    { expeditionLog: [{ destination: "unknown" }] },
    { jobs: { forager: 0, lamplighter: 0, scrivener: 1 } },
  ])("rejects malformed or inconsistent expedition records: %j", patch => {
    expect(() => decodeSave(JSON.stringify({ ...createInitialState(0), ...patch }))).toThrow();
  });
});
