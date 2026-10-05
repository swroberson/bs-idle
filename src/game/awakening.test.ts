import { describe, expect, it } from "vitest";
import { createInitialState } from "./state";
import { applyAction } from "./actions";
import { economyRates, reconcile } from "./simulation";
import { decodeSave, encodeSave } from "./save";
import { resourceVisible } from "./requirements";
import type { BuildingId, ExpeditionId, GameState, ResearchId } from "./types";
import { buildCompleted, finishConstruction } from "./construction.test-support";
import { pendingIllustrations } from "./illustrations";
import { RESEARCH } from "../content/research";

// Granted stores isolate action/validation behavior; the full-route harness uses none.
function restoredWard(): GameState {
  let state = createInitialState(0);
  state.resources = { ...state.resources, food: 20000, oil: 20000, authority: 1000, coin: 1000, knowledge: 1000, relics: 20 };
  state.lifetimeAuthority = 1000;
  state.jobs.laborer = 1;
  const build = (building: BuildingId) => { state = buildCompleted(state, building); };
  const study = (research: ResearchId) => { state = applyAction(state, { type: "research", research }, state.lastSimulatedAt); if (state.activeConstruction) state = finishConstruction(state); };
  const travel = (destination: ExpeditionId, duration: number) => {
    state = applyAction(state, { type: "assign-worker", job: "scavenger", delta: 1 }, state.lastSimulatedAt);
    state = applyAction(state, { type: "start-expedition", destination, workers: 1 }, state.lastSimulatedAt);
    state = reconcile(state, state.lastSimulatedAt + duration).state;
  };
  build("fields"); build("oil-press");
  state = applyAction(state, { type: "choose-event", event: "household" }, state.lastSimulatedAt);
  state = applyAction(state, { type: "choose-event", event: "lamp-complaint" }, state.lastSimulatedAt);
  study("examine-old-lamps"); study("ledger-keeping");
  build("market-stall"); build("scrivener-house"); build("ruined-cistern");
  travel("old-cistern", 180000); build("antiquities-house");
  study("catalog-relics"); study("survey-foundations");
  travel("ruined-aqueduct", 240000); study("trace-conduits"); build("subterranean-works");
  travel("chapel-foundations", 300000); study("open-chamber"); build("buried-engine");
  study("study-engine"); study("restore-conduit");
  return state;
}

describe("deliberate local awakening", () => {
  it("commits restoration supplies once and withholds the discovery and awakening until crew completion", () => {
    const state = restoredWard();
    state.research = state.research.filter(id => id !== "restore-conduit");
    state.chronicle = state.chronicle.filter(id => id !== "conduit-restored");
    const now = state.lastSimulatedAt;
    const started = applyAction(state, { type: "research", research: "restore-conduit" }, now);
    expect(started.resources.coin).toBe(state.resources.coin - RESEARCH["restore-conduit"].cost.coin);
    expect(started.resources.knowledge).toBe(state.resources.knowledge - 120);
    expect(started.research).not.toContain("restore-conduit");
    expect(started.chronicle).not.toContain("conduit-restored");
    expect(applyAction(started, { type: "research", research: "restore-conduit" }, now)).toBe(started);
    expect(applyAction(started, { type: "awaken-junction" }, now)).toBe(started);
    const halfway = reconcile(started, now + 60_000).state;
    expect(decodeSave(encodeSave(halfway))).toEqual(halfway);
    const complete = reconcile(halfway, now + 120_000);
    expect(complete.state.research).toContain("restore-conduit");
    expect(complete.state.chronicle.filter(id => id === "conduit-restored")).toHaveLength(1);
    expect(complete.summary.completedConstruction).toEqual([{ kind: "research", id: "restore-conduit" }]);
    expect(complete.state.awakenedAt).toBeNull();
  });
  it("earns chamber artwork through opening and finale artwork only through deliberate awakening", () => {
    expect(pendingIllustrations(createInitialState(0))).not.toContain("sealed-chamber");
    const ready = restoredWard();
    expect(pendingIllustrations(ready)).toContain("sealed-chamber");
    expect(pendingIllustrations(ready)).not.toContain("junction-awakened");
    const awake = applyAction(ready, { type: "awaken-junction" }, ready.lastSimulatedAt);
    expect(pendingIllustrations(awake)).toContain("junction-awakened");
    const dismissed = applyAction(awake, { type: "dismiss-illustrations", ids: pendingIllustrations(awake) }, awake.lastSimulatedAt);
    expect(pendingIllustrations(decodeSave(encodeSave(dismissed)))).toEqual([]);
    expect(applyAction(dismissed, { type: "awaken-junction" }, dismissed.lastSimulatedAt)).toBe(dismissed);
    expect(dismissed.resources).toEqual(awake.resources);
  });

  it("requires the full repair, never awakens offline, and preserves ordinary stores", () => {
    const initial = createInitialState(0);
    expect(applyAction(initial, { type: "awaken-junction" }, 0)).toBe(initial);
    const ready = restoredWard();
    expect(ready.research).toContain("restore-conduit");
    expect(resourceVisible(ready, "current")).toBe(false);
    expect(reconcile(ready, ready.lastSimulatedAt + 43200000).state.awakenedAt).toBeNull();
    const awake = applyAction(ready, { type: "awaken-junction" }, ready.lastSimulatedAt);
    expect(awake.awakenedAt).toBe(ready.lastSimulatedAt);
    expect(awake.resources).toEqual(ready.resources);
    expect(awake.finaleStep).toBe(0);
    expect(resourceVisible(awake, "current")).toBe(true);
    expect(applyAction(awake, { type: "awaken-junction" }, awake.lastSimulatedAt)).toBe(awake);
    expect(awake.chronicle.filter(id => id === "junction-awakened")).toHaveLength(1);
    expect(decodeSave(encodeSave(awake))).toEqual(awake);
  });

  it("keeps Authority without Oil and accrues Current only after activation, with shortage rules", () => {
    const ready = restoredWard();
    ready.jobs.lamplighter = 2; ready.jobs.forager = 3;
    ready.resources.authority = 0;
    ready.buildings["oil-press"] = 0; ready.resources.oil = 0;
    expect(economyRates(ready).net.authority).toBe(0);
    const awake = applyAction(ready, { type: "awaken-junction" }, ready.lastSimulatedAt);
    expect(economyRates(awake).net.authority).toBeCloseTo(.2);
    expect(economyRates(awake).net.oil).toBe(0);
    expect(reconcile(awake, awake.lastSimulatedAt + 10000).state.resources.current).toBeCloseTo(.2);
    awake.resources.food = 0; awake.jobs.forager = 0;
    expect(economyRates(awake).net.authority).toBeCloseTo(.1);
    expect(economyRates(awake).net.current).toBeCloseTo(.01);
  });

  it("persists each passage independently of Chronicle reading and never repeats rewards", () => {
    let state = restoredWard();
    expect(applyAction(state, { type: "advance-awakening", step: 0 }, state.lastSimulatedAt)).toBe(state);
    state = applyAction(state, { type: "awaken-junction" }, state.lastSimulatedAt);
    const before = state.resources;
    for (let step = 0; step < 3; step++) {
      state = applyAction(state, { type: "advance-awakening", step }, state.lastSimulatedAt);
      expect(state.finaleStep).toBe(step + 1);
      expect(state.resources).toEqual(before);
      expect(state.readChronicle).not.toContain("junction-awakened");
      state = decodeSave(encodeSave(state));
      expect(applyAction(state, { type: "advance-awakening", step }, state.lastSimulatedAt)).toBe(state);
    }
  });

  it("rejects inconsistent endings, unearned Current, missing repairs, and invalid stages", () => {
    const ready = restoredWard();
    const awake = applyAction(ready, { type: "awaken-junction" }, ready.lastSimulatedAt);
    for (const patch of [
      { awakenedAt: null }, { awakenedAt: awake.lastSimulatedAt + 1 }, { finaleStep: 4 },
      { finaleStep: 1.5 }, { chronicle: awake.chronicle.filter(id => id !== "junction-awakened") },
      { buildings: { ...awake.buildings, "buried-engine": 0 } },
      { research: awake.research.filter(id => id !== "restore-conduit") },
    ]) expect(() => decodeSave(JSON.stringify({ ...awake, ...patch }))).toThrow();
    expect(() => decodeSave(JSON.stringify({ ...ready, resources: { ...ready.resources, current: 1 } }))).toThrow();
    expect(() => decodeSave(JSON.stringify({ ...ready, finaleStep: 1 }))).toThrow();
  });

  it("reconciles foreground and offline through Food depletion, caps Current, and counts the interval once", () => {
    const ready = restoredWard();
    const awake = applyAction(ready, { type: "awaken-junction" }, ready.lastSimulatedAt);
    awake.resources.food = 1; awake.jobs.lamplighter = 1;
    const start = awake.lastSimulatedAt;
    let ticks = awake;
    for (let i = 1; i <= 60; i++) ticks = reconcile(ticks, start + i * 1000).state;
    const offline = reconcile(awake, start + 60000).state;
    for (const id of Object.keys(offline.resources) as (keyof GameState["resources"])[]) expect(offline.resources[id]).toBeCloseTo(ticks.resources[id], 7);
    const capped = reconcile(awake, start + 43200000);
    expect(capped.summary.productionMs).toBe(28800000);
    expect(capped.state.resources.current).toBeCloseTo(.02 * 5 + .01 * (28800 - 5));
    expect(reconcile(capped.state, start + 43200000).state.resources).toEqual(capped.state.resources);
  });

  it("preserves version-4 stores, active timers, unread records and pending art while adding hidden defaults", () => {
    let state = restoredWard();
    // Use only records and actions that were available in the actual version-4 build.
    const old = JSON.parse(JSON.stringify(state));
    const laterRecords = new Set(["aqueduct-find", "chapel-find", "conduit-trace", "subterranean-works-built", "chamber-opened", "engine-works-built", "engine-study", "conduit-restored"]);
    old.chronicle = old.chronicle.filter((id: string) => !laterRecords.has(id));
    old.research = ["examine-old-lamps", "ledger-keeping", "catalog-relics", "survey-foundations"];
    old.completedExpeditions = ["old-cistern"];
    old.expeditionLog = old.expeditionLog.filter((entry: { destination: string }) => entry.destination === "old-cistern");
    old.version = 4; delete old.resources.current; delete old.awakenedAt; delete old.finaleStep; delete old.jobs.laborer; delete old.jobs.scavenger; delete old.eventChoices;
    delete old.activeConstruction;
    for (const id of ["lamp-house", "smithy", "subterranean-works", "buried-engine"]) delete old.buildings[id];
    old.readChronicle = ["appointment"];
    old.dismissedIllustrations = ["keeper-office"];
    old.activeExpedition = { destination: "abandoned-farmstead", workers: 2, startedAt: old.lastSimulatedAt, returnsAt: old.lastSimulatedAt + 240000 };
    state = decodeSave(JSON.stringify(old));
    expect(state.version).toBe(8);
    expect(state.resources).toEqual({ ...old.resources, current: 0 });
    expect(state.activeExpedition).toEqual(old.activeExpedition);
    expect(state.lastSimulatedAt).toBe(old.lastSimulatedAt);
    expect(state.chronicle).toEqual(old.chronicle);
    expect(state.readChronicle).toEqual(["appointment"]);
    expect(pendingIllustrations(state)).toEqual(["oil-press", "lamp-examination", "cistern-find"]);
    expect(state.awakenedAt).toBeNull(); expect(state.finaleStep).toBe(0);
    expect(decodeSave(encodeSave(state))).toEqual(state);
    expect(() => decodeSave(JSON.stringify({ ...old, resources: { ...old.resources, current: 1 } }))).toThrow();
    expect(() => decodeSave(JSON.stringify({ ...old, buildings: { ...old.buildings, "buried-engine": 1 } }))).toThrow();
    expect(() => decodeSave(JSON.stringify({ ...old, chronicle: [...old.chronicle, "junction-awakened"] }))).toThrow();
  });

  it("supports optional civic modifiers without requiring their findings for the ending", () => {
    let state = restoredWard();
    state.jobs.forager = 3; state.jobs.lamplighter = 1;
    state.resources.food = 30;
    const base = economyRates(state).net;
    for (const building of ["lamp-house", "smithy"] as const) state = buildCompleted(state, building);
    for (const research of ["crop-rotation", "iron-tools", "better-wicks", "improved-presses"] as const) state = applyAction(state, { type: "research", research }, state.lastSimulatedAt);
    state.resources.food = 30; state.resources.oil = 20; state.resources.authority = 0;
    const rates = economyRates(state).net;
    expect(rates.food + state.population * .025).toBeCloseTo((base.food + state.population * .025) * 1.25 * 1.2);
    expect(rates.oil).toBeCloseTo(.1 * 1.25 - .075 * .75);
    expect(rates.authority).toBeCloseTo(.125);
    expect(decodeSave(encodeSave(state))).toEqual(state);
  });

  it("returns new destinations once, preserves workers, and continues the awakened economy beyond the cap", () => {
    let state = restoredWard();
    state.jobs.forager = 3;
    state = applyAction(state, { type: "awaken-junction" }, state.lastSimulatedAt);
    for (const destination of ["collapsed-gatehouse", "barrow-field"] as const) {
      const record = destination === "collapsed-gatehouse" ? "gatehouse-find" : "barrow-find";
      for (let trip = 0; trip < 2; trip++) {
        const now = state.lastSimulatedAt;
        if (destination === "barrow-field") for (let n = 0; n < 2; n++) state = applyAction(state, { type: "assign-worker", job: "scavenger", delta: 1 }, now);
        const sent = applyAction(state, { type: "start-expedition", destination, workers: 2 }, now);
        expect(sent.activeExpedition?.workers).toBe(2);
        state = reconcile(sent, now + 43200000).state;
        expect(state.activeExpedition).toBeNull();
        expect(state.chronicle.filter(id => id === record)).toHaveLength(1);
        expect(state.resources.current - sent.resources.current).toBeCloseTo(576);
        expect(decodeSave(encodeSave(state))).toEqual(state);
      }
    }
  });
});
