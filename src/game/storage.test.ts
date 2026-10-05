import { describe, expect, it } from "vitest";
import { createInitialState } from "./state";
import { applyAction } from "./actions";
import { economyRates, reconcile } from "./simulation";
import { resourceCapacity } from "./storage";
import { completeExpedition } from "./expeditions";
import { decodeSave, encodeSave } from "./save";
import { RESEARCH } from "../content/research";
import { startBuilding, finishConstruction } from "./construction.test-support";

describe("bounded stores", () => {
  it("banks a few purchases after two hours instead of unlimited production", () => {
    const state = createInitialState(0);
    state.jobs = { ...state.jobs, forager: 2, scrivener: 1, lamplighter: 1 };
    state.buildings.fields = 1;
    state.buildings["oil-press"] = 1;
    state.buildings["market-stall"] = 1;
    state.buildings["scrivener-house"] = 1;
    const result = reconcile(state, 7_200_000);
    for (const id of ["food", "oil", "coin", "knowledge", "authority"] as const) {
      expect(result.state.resources[id]).toBe(resourceCapacity(state, id));
      expect(economyRates(result.state).net[id]).toBe(0);
    }
    expect(result.state.resources.coin).toBeLessThanOrEqual(80);
    expect(result.state.resources.knowledge).toBeLessThanOrEqual(60);
    expect(result.summary.changes.coin).toBe(result.state.resources.coin);
    expect(result.state.lifetimeAuthority).toBeCloseTo(720);
    expect(reconcile(result.state, 7_200_000).state).toBe(result.state);
  });

  it("preserves old saved surpluses while stopping gains until they are spent", () => {
    const state = createInitialState(0);
    state.resources.food = 2000;
    state.jobs.forager = 5;
    const saved = decodeSave(encodeSave(state));
    expect(reconcile(saved, 7_200_000).state.resources.food).toBe(2000);
    const refused = applyAction(saved, { type: "gather-food" }, 0);
    expect(refused.resources.food).toBe(2000);
    expect(refused.lastGatheredAt).toBeNull();
    saved.jobs.forager = 0;
    expect(reconcile(saved, 10_000).state.resources.food).toBeCloseTo(1998.75);
    expect(saved.resources.food).toBe(2000);
  });

  it("limits manual gains and records only accepted expedition rewards", () => {
    const state = createInitialState(0);
    state.resources.food = resourceCapacity(state, "food") - 1;
    expect(applyAction(state, { type: "gather-food" }, 0).resources.food).toBe(resourceCapacity(state, "food"));
    state.resources.oil = resourceCapacity(state, "oil") - 1;
    expect(applyAction(state, { type: "render-oil" }, 0).resources.oil).toBe(resourceCapacity(state, "oil"));
    state.resources.coin = resourceCapacity(state, "coin") - 2;
    state.activeExpedition = { destination: "abandoned-farmstead", workers: 2, startedAt: 0, returnsAt: 240_000 };
    const returned = completeExpedition(state, 240_000);
    expect(returned.resources.food).toBe(resourceCapacity(state, "food"));
    expect(returned.resources.coin).toBe(resourceCapacity(state, "coin"));
    expect(returned.expeditionLog[0].rewards).toEqual({ food: 1, coin: 2 });
    expect(returned.activeExpedition).toBeNull();
    expect(completeExpedition(returned, 240_000)).toBe(returned);
  });

  it("expands storage at construction completion and fits the final restoration", () => {
    let state = createInitialState(0);
    state.lifetimeAuthority = 10;
    state.resources.authority = 10;
    state.resources.food = 80;
    state.jobs.forager = 2;
    state = startBuilding(state, "fields");
    expect(resourceCapacity(state, "food")).toBe(80);
    state = finishConstruction(state);
    expect(resourceCapacity(state, "food")).toBe(120);
    state.buildings["market-stall"] = 1;
    state.buildings["scrivener-house"] = 1;
    state.buildings["antiquities-house"] = 1;
    state.buildings["buried-engine"] = 1;
    for (const [id, cost] of Object.entries(RESEARCH["restore-conduit"].cost)) {
      expect(resourceCapacity(state, id as keyof typeof state.resources)).toBeGreaterThanOrEqual(cost);
    }
  });

  it("limits civic rewards at capacity while still earning lifetime Authority", () => {
    const state = createInitialState(0);
    state.resources.authority = resourceCapacity(state, "authority") - 2;
    state.lifetimeAuthority = 100;
    state.pendingEvents = ["shared-table"];
    state.triggeredEvents = ["shared-table"];
    const chosen = applyAction(state, { type: "choose-event", event: "shared-table", choice: "full-meal" }, 0);
    expect(chosen.resources.authority).toBe(resourceCapacity(chosen, "authority"));
    expect(chosen.lifetimeAuthority).toBe(110);
    expect(chosen.resources.food).toBe(0);
    expect(chosen.eventChoices["shared-table"]).toBe("full-meal");
    expect(applyAction(chosen, { type: "choose-event", event: "shared-table", choice: "full-meal" }, 0)).toBe(chosen);
  });

  it("resumes production after spending from full stores", () => {
    const state = createInitialState(0);
    state.jobs = { ...state.jobs, forager: 2, lamplighter: 1 };
    state.resources.food = resourceCapacity(state, "food");
    state.resources.authority = resourceCapacity(state, "authority");
    state.lifetimeAuthority = state.resources.authority;
    state.pendingEvents = ["household"];
    state.triggeredEvents = ["household"];
    const spent = applyAction(state, { type: "choose-event", event: "household" }, 0);
    expect(economyRates(spent).net.food).toBeGreaterThan(0);
    expect(economyRates(spent).net.authority).toBeGreaterThan(0);
    const refilled = reconcile(spent, 7_200_000).state;
    expect(refilled.resources.food).toBe(resourceCapacity(refilled, "food"));
    expect(refilled.resources.authority).toBe(resourceCapacity(refilled, "authority"));
  });

  it("agrees across capacity, shortage, construction and expedition boundaries", () => {
    const state = createInitialState(0);
    state.lifetimeAuthority = 40;
    state.jobs = { ...state.jobs, forager: 1, lamplighter: 2, laborer: 1 };
    state.resources.food = 1;
    state.resources.oil = 1;
    state.resources.authority = resourceCapacity(state, "authority") - 1;
    state.buildings["oil-press"] = 1;
    state.buildings["market-stall"] = 1;
    state.activeConstruction = { kind: "building", id: "fields", workDone: 0, startedAt: 0 };
    state.activeExpedition = { destination: "abandoned-farmstead", workers: 1, startedAt: 0, returnsAt: 240_000 };
    const away = reconcile(state, 7_200_000).state;
    let foreground = state;
    for (let now = 1000; now <= 7_200_000; now += 1000) foreground = reconcile(foreground, now).state;
    for (const id of Object.keys(state.resources) as (keyof typeof state.resources)[]) {
      expect(foreground.resources[id]).toBeCloseTo(away.resources[id], 7);
    }
    expect(foreground.lifetimeAuthority).toBeCloseTo(away.lifetimeAuthority, 7);
    expect(foreground.pendingEvents).toEqual(away.pendingEvents);
    expect(foreground.expeditionLog[0].returnedAt).toBe(away.expeditionLog[0].returnedAt);
    for (const id of ["food", "coin"] as const) expect(foreground.expeditionLog[0].rewards[id]).toBeCloseTo(away.expeditionLog[0].rewards[id]!, 7);
    expect(away.buildings.fields).toBe(1);
  });
});
