import { describe, expect, it } from "vitest";
import { applyAction } from "./actions";
import { createInitialState } from "./state";
import { economyRates, reconcile } from "./simulation";
import { buildingCost, constructionDiscount, expeditionCost } from "./requirements";
import { decodeSave, encodeSave } from "./save";
import type { ResearchId } from "./types";
import { writeFileSync } from "node:fs";

function civicWard() {
  let state = createInitialState(0);
  state.resources = { ...state.resources, food: 1000, oil: 1000, coin: 1000, knowledge: 1000, authority: 1000 };
  state.lifetimeAuthority = 1000;
  for (const building of ["fields", "oil-press"] as const) state = applyAction(state, { type: "build", building }, 0);
  for (const event of ["household", "lamp-complaint"] as const) state = applyAction(state, { type: "choose-event", event }, 0);
  for (const research of ["examine-old-lamps", "ledger-keeping"] as const) state = applyAction(state, { type: "research", research }, 0);
  for (const building of ["market-stall", "scrivener-house", "ruined-cistern", "smithy"] as const) state = applyAction(state, { type: "build", building }, 0);
  state = applyAction(state, { type: "assign-worker", job: "scavenger", delta: 1 }, 0);
  state = applyAction(state, { type: "start-expedition", destination: "old-cistern", workers: 1 }, 0);
  state = reconcile(state, 180000).state;
  state = applyAction(state, { type: "build", building: "antiquities-house" }, 180000);
  for (const research of ["catalog-relics", "stoneworking"] as const) state = applyAction(state, { type: "research", research }, 180000);
  return state;
}

function study(id: ResearchId) {
  const state = civicWard();
  return applyAction(state, { type: "research", research: id }, state.lastSimulatedAt);
}

describe("civic studies", () => {
  it("discounts only expedition Food and rounds the whole party price up once", () => {
    const state = study("provision-stores");
    expect(state.research).toContain("provision-stores");
    expect(expeditionCost(state, "old-cistern", 3)).toEqual({ food: 24 });
    expect(expeditionCost(state, "collapsed-gatehouse", 3)).toEqual({ food: 29 });
    expect(expeditionCost(civicWard(), "collapsed-gatehouse", 3)).toEqual({ food: 36 });
    const assigned = applyAction(state, { type: "assign-worker", job: "scavenger", delta: 1 }, state.lastSimulatedAt);
    const sent = applyAction(assigned, { type: "start-expedition", destination: "old-cistern", workers: 1 }, state.lastSimulatedAt);
    expect(sent.resources.food).toBe(state.resources.food - 8);
    const returned = reconcile(sent, state.lastSimulatedAt + 180000).state;
    expect(returned.resources.relics - state.resources.relics).toBe(1);
    expect(returned.expeditionLog.at(-1)?.rewards).toEqual({ relics: 1 });
    expect(applyAction(state, { type: "research", research: "provision-stores" }, state.lastSimulatedAt)).toBe(state);
    expect(decodeSave(encodeSave(sent))).toEqual(sent);
  });

  it("makes fewer Laborers reach the existing cap and leaves other costs intact", () => {
    const state = study("apprenticed-hands");
    state.jobs.laborer = 1;
    expect(constructionDiscount(state).perLaborer).toBeCloseTo(.075);
    expect(constructionDiscount(state).laborer).toBeCloseTo(.075);
    state.jobs.laborer = 3;
    expect(constructionDiscount(state).laborer).toBe(.2);
    expect(buildingCost(state, "lamp-house")).toEqual({ coin: 15, authority: 15 });
    state.jobs.laborer = 0;
    expect(buildingCost(state, "lamp-house").coin).toBe(18);
    expect(decodeSave(encodeSave(state))).toEqual(state);
  });

  it("improves Scrivener output once, retains shortage rules and foreground/offline consistency", () => {
    const state = study("collated-records");
    state.jobs.scrivener = 2;
    expect(economyRates(state).net.knowledge).toBeCloseTo(.2);
    state.resources.food = 1;
    const offline = reconcile(state, state.lastSimulatedAt + 60000).state;
    let ticking = state;
    for (let n = 1; n <= 60; n++) ticking = reconcile(ticking, state.lastSimulatedAt + n * 1000).state;
    expect(offline.resources.knowledge).toBeCloseTo(ticking.resources.knowledge, 7);
    expect(economyRates(offline).net.knowledge).toBeCloseTo(.1);
    expect(applyAction(state, { type: "research", research: "collated-records" }, state.lastSimulatedAt)).toBe(state);
  });
});

describe("deliberate civic responses", () => {
  it("queues a report offline, keeps it after shortage/reload and never chooses on the player's behalf", () => {
    const state = study("provision-stores");
    state.resources.food = 20;
    const away = reconcile(state, state.lastSimulatedAt + 12 * 60 * 60 * 1000).state;
    expect(away.pendingEvents).toEqual(["shared-table"]);
    expect(away.eventChoices).toEqual({});
    expect(away.chronicle).not.toContain("shared-table");
    expect(decodeSave(encodeSave(away))).toEqual(away);
    expect(applyAction(away, { type: "choose-event", event: "shared-table", choice: "small-meal" }, away.lastSimulatedAt)).toBe(away);
  });

  it.each([["full-meal", 30, 10], ["small-meal", 10, 3]] as const)("records %s and its exact one-time Food/Authority exchange", (choice, food, authority) => {
    const state = study("provision-stores");
    const selected = applyAction(state, { type: "choose-event", event: "shared-table", choice }, state.lastSimulatedAt);
    expect(selected.resources.food).toBe(state.resources.food - food);
    expect(selected.resources.authority).toBe(state.resources.authority + authority);
    expect(selected.lifetimeAuthority).toBe(state.lifetimeAuthority + authority);
    expect(selected.population).toBe(state.population);
    expect(selected.eventChoices["shared-table"]).toBe(choice);
    expect(selected.pendingEvents).toEqual([]);
    expect(selected.chronicle.filter(id => id === "shared-table")).toHaveLength(1);
    expect(applyAction(selected, { type: "choose-event", event: "shared-table", choice }, selected.lastSimulatedAt)).toBe(selected);
    expect(decodeSave(encodeSave(selected))).toEqual(selected);
  });

  it.each(["provisions", "coin"] as const)("pays for spare oil with %s without changing future production", choice => {
    const state = study("apprenticed-hands");
    const chosen = applyAction(state, { type: "choose-event", event: "spare-oil", choice }, state.lastSimulatedAt);
    expect(chosen.resources.oil).toBe(state.resources.oil + 10);
    expect(chosen.resources.food).toBe(state.resources.food - (choice === "provisions" ? 20 : 0));
    expect(chosen.resources.coin).toBe(state.resources.coin - (choice === "coin" ? 12 : 0));
    expect(chosen.jobs).toEqual(state.jobs);
    expect(economyRates(chosen).net).toEqual(economyRates(state).net);
    expect(decodeSave(encodeSave(chosen))).toEqual(chosen);
  });

  it("rejects omitted, unknown, unaffordable and out-of-order responses without consuming the report", () => {
    let state = study("provision-stores");
    state = applyAction(state, { type: "research", research: "apprenticed-hands" }, state.lastSimulatedAt);
    expect(state.pendingEvents).toEqual(["shared-table", "spare-oil"]);
    expect(applyAction(state, { type: "choose-event", event: "shared-table" }, state.lastSimulatedAt)).toBe(state);
    expect(applyAction(state, { type: "choose-event", event: "shared-table", choice: "unknown" }, state.lastSimulatedAt)).toBe(state);
    expect(applyAction(state, { type: "choose-event", event: "spare-oil", choice: "coin" }, state.lastSimulatedAt)).toBe(state);
    state.resources.food = 20;
    expect(applyAction(state, { type: "choose-event", event: "shared-table", choice: "full-meal" }, state.lastSimulatedAt)).toBe(state);
    expect(applyAction(state, { type: "choose-event", event: "shared-table", choice: "small-meal" }, state.lastSimulatedAt).eventChoices["shared-table"]).toBe("small-meal");
  });

  it("rejects forged outcomes, missing prerequisites and new content smuggled into older save versions", () => {
    const pending = study("provision-stores");
    const resolved = applyAction(pending, { type: "choose-event", event: "shared-table", choice: "small-meal" }, pending.lastSimulatedAt);
    for (const eventChoices of [{}, { "shared-table": "unknown" }, { "shared-table": "small-meal", household: "accept" }, null, []]) {
      expect(() => decodeSave(JSON.stringify({ ...resolved, eventChoices }))).toThrow();
    }
    expect(() => decodeSave(JSON.stringify({ ...pending, eventChoices: { "shared-table": "small-meal" } }))).toThrow();
    const missing = { ...pending, research: pending.research.filter(id => id !== "provision-stores"), chronicle: pending.chronicle.filter(id => id !== "provision-stores") };
    expect(() => decodeSave(JSON.stringify(missing))).toThrow();
    const old = JSON.parse(JSON.stringify(pending));
    old.version = 6; delete old.jobs.scavenger; delete old.eventChoices;
    expect(() => decodeSave(JSON.stringify(old))).toThrow();
    const valid = JSON.parse(JSON.stringify(civicWard()));
    valid.version = 6; delete valid.jobs.scavenger; delete valid.eventChoices;
    expect(decodeSave(JSON.stringify(valid)).eventChoices).toEqual({});
    if (process.env.BS_CAPTURE_SAVES) {
      writeFileSync("/tmp/buried-sun-civic.json", encodeSave(civicWard()));
      writeFileSync("/tmp/buried-sun-civic-pending.json", encodeSave(pending));
    }
  });
});
