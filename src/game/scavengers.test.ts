import { describe, expect, it } from "vitest";
import { applyAction } from "./actions";
import { createInitialState } from "./state";
import { availableWorkers, expeditionRequirements } from "./requirements";
import { economyRates, reconcile } from "./simulation";
import { decodeSave, encodeSave } from "./save";

function cistern() {
  const state = createInitialState(0);
  state.population = 8;
  state.lifetimeAuthority = 100;
  state.resources = { ...state.resources, food: 100, coin: 50, authority: 50 };
  state.jobs.forager = 3;
  state.jobs.lamplighter = 1;
  state.buildings = { ...state.buildings, fields: 1, "oil-press": 1, "market-stall": 1, "scrivener-house": 1, "ruined-cistern": 1 };
  state.triggeredEvents = ["household", "lamp-complaint"];
  state.research = ["examine-old-lamps", "ledger-keeping"];
  state.chronicle.push("oil-press-built", "household", "lamp-complaint", "lamp-examination", "ledger-keeping");
  return state;
}

describe("Scavenger dispatch", () => {
  it("requires assigned Scavengers and transfers them into a single party without double counting", () => {
    const initial = createInitialState(0);
    expect(applyAction(initial, { type: "assign-worker", job: "scavenger", delta: 1 }, 0)).toBe(initial);
    let state = cistern();
    const rates = economyRates(state).net;
    expect(expeditionRequirements(state, "old-cistern", 2)).toContain("Assigned Scavengers 0 / 2; assign workers in Ward");
    for (let i = 0; i < 3; i++) state = applyAction(state, { type: "assign-worker", job: "scavenger", delta: 1 }, 0);
    expect(economyRates(state).net).toEqual(rates);
    expect(availableWorkers(state)).toBe(1);
    const sent = applyAction(state, { type: "start-expedition", destination: "old-cistern", workers: 2 }, 0);
    expect(sent.jobs.scavenger).toBe(1);
    expect(sent.activeExpedition?.workers).toBe(2);
    expect(availableWorkers(sent)).toBe(1);
    expect(sent.resources.food).toBe(80);
    expect(decodeSave(encodeSave(sent))).toEqual(sent);
    const returned = reconcile(sent, 180000).state;
    expect(returned.jobs.scavenger).toBe(1);
    expect(availableWorkers(returned)).toBe(3);
    expect(returned.resources.relics).toBe(2);
    expect(expeditionRequirements(returned, "old-cistern", 2)).toContain("Assigned Scavengers 1 / 2; assign workers in Ward");
    expect(reconcile(returned, 180000).state).toBe(returned);
  });

  it("keeps supply parties separate from Scavenger reservations", () => {
    let state = cistern();
    state.completedExpeditions = ["old-cistern"];
    state.chronicle.push("cistern-find");
    for (let i = 0; i < 4; i++) state = applyAction(state, { type: "assign-worker", job: "scavenger", delta: 1 }, 0);
    expect(applyAction(state, { type: "start-expedition", destination: "abandoned-farmstead", workers: 1 }, 0)).toBe(state);
    state = applyAction(state, { type: "assign-worker", job: "scavenger", delta: -1 }, 0);
    const sent = applyAction(state, { type: "start-expedition", destination: "abandoned-farmstead", workers: 1 }, 0);
    expect(sent.jobs.scavenger).toBe(3);
    expect(sent.activeExpedition?.workers).toBe(1);
  });

  it("migrates a version-6 archaeological party and returns it once without assigning Scavengers", () => {
    const old = JSON.parse(JSON.stringify(cistern()));
    old.version = 6;
    delete old.jobs.scavenger;
    delete old.eventChoices;
    old.activeExpedition = { destination: "old-cistern", workers: 2, startedAt: 0, returnsAt: 180000 };
    const state = decodeSave(JSON.stringify(old));
    expect(state.version).toBe(7);
    expect(state.jobs.scavenger).toBe(0);
    expect(state.resources).toEqual(old.resources);
    expect(state.activeExpedition).toEqual(old.activeExpedition);
    const returned = reconcile(state, 12 * 60 * 60 * 1000);
    expect(returned.summary.productionMs).toBe(8 * 60 * 60 * 1000);
    expect(returned.state.jobs.scavenger).toBe(0);
    expect(returned.state.resources.relics).toBe(2);
    expect(returned.state.chronicle.filter(id => id === "cistern-find")).toHaveLength(1);
    expect(decodeSave(encodeSave(returned.state))).toEqual(returned.state);
  });
});
