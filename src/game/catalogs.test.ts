import { describe, expect, it } from "vitest";
import { availableStudies, availableWorks } from "./catalogs";
import { createInitialState } from "./state";
import { applyAction } from "./actions";
import { decodeSave, encodeSave } from "./save";
import { reconcile } from "./simulation";

function openedWard() {
  const state = createInitialState(1000);
  state.lifetimeAuthority = 40;
  state.buildings.fields = 1;
  state.buildings["oil-press"] = 1;
  state.triggeredEvents = ["household", "lamp-complaint"];
  state.chronicle.push("household", "lamp-complaint", "oil-press-built");
  return state;
}

describe("unfinished catalogs", () => {
  it("keeps expandable Works and removes maxed repeatable and unique installations", () => {
    const state = openedWard();
    state.buildings["scrivener-house"] = 1;
    expect(availableWorks(state)).toContain("oil-press");
    expect(availableWorks(state)).not.toContain("scrivener-house");
    state.buildings["oil-press"] = 3;
    expect(availableWorks(state)).not.toContain("oil-press");
  });

  it("removes completed studies and reveals prerequisites without requiring supplies or crew", () => {
    const state = openedWard();
    state.resources.food = 0;
    state.resources.authority = 0;
    expect(availableStudies(state)).toEqual(["examine-old-lamps"]);
    state.research.push("examine-old-lamps");
    expect(availableStudies(state)).toEqual(["ledger-keeping"]);
    expect(availableWorks(state)).toContain("oil-press");
  });
});

describe("catalog attention", () => {
  it("acknowledges only the viewed entry, once, without changing production or other attention", () => {
    const state = openedWard();
    const seen = applyAction(state, { type: "view-work", id: "fields" }, 1000);
    expect(seen.seenWorks).toEqual(["fields"]);
    expect(seen.seenStudies).toEqual([]);
    expect(seen.resources).toEqual(state.resources);
    expect(seen.lastSimulatedAt).toBe(state.lastSimulatedAt);
    expect(state.seenWorks).toEqual([]);
    expect(applyAction(seen, { type: "view-work", id: "fields" }, 2000)).toBe(seen);
    expect(decodeSave(encodeSave(seen))).toEqual(seen);
  });

  it("does not treat an expansion or newly sufficient supplies as a new entry", () => {
    let state = openedWard();
    state = applyAction(state, { type: "view-work", id: "oil-press" }, 1000);
    state.buildings["oil-press"] = 2;
    state.resources.food = 500;
    expect(availableWorks(state).filter(id => !state.seenWorks.includes(id))).not.toContain("oil-press");
  });

  it("keeps a newly unlocked study unacknowledged until it is viewed", () => {
    let state = openedWard();
    state = applyAction(state, { type: "view-study", id: "examine-old-lamps" }, 1000);
    state.research.push("examine-old-lamps");
    state.chronicle.push("lamp-examination");
    expect(availableStudies(state).filter(id => !state.seenStudies.includes(id))).toEqual(["ledger-keeping"]);
    state = applyAction(state, { type: "view-study", id: "ledger-keeping" }, 1000);
    expect(availableStudies(state).filter(id => !state.seenStudies.includes(id))).toEqual([]);
    expect(decodeSave(encodeSave(state))).toEqual(state);
  });

  it("rejects viewing locked, completed or unknown entries", () => {
    const state = openedWard();
    expect(applyAction(state, { type: "view-work", id: "buried-engine" }, 1000)).toBe(state);
    expect(applyAction(state, { type: "view-study", id: "ledger-keeping" }, 1000)).toBe(state);
    state.buildings["oil-press"] = 3;
    expect(applyAction(state, { type: "view-work", id: "oil-press" }, 1000)).toBe(state);
    expect(applyAction(state, { type: "view-work", id: "unknown" } as never, 1000)).toBe(state);
  });

  it("migrates version 8 without retroactive alerts or changing progress", () => {
    const state = openedWard();
    const legacy = JSON.parse(JSON.stringify(state));
    legacy.version = 8;
    delete legacy.seenWorks; delete legacy.seenStudies;
    const migrated = decodeSave(JSON.stringify(legacy));
    expect(migrated.version).toBe(9);
    expect(migrated.seenWorks).toEqual(availableWorks(state));
    expect(migrated.seenStudies).toEqual(availableStudies(state));
    expect(migrated.resources).toEqual(state.resources);
    expect(migrated.jobs).toEqual(state.jobs);
    expect(migrated.chronicle).toEqual(state.chronicle);
    expect(migrated.lastSimulatedAt).toBe(state.lastSimulatedAt);
    expect(decodeSave(encodeSave(migrated))).toEqual(migrated);
  });

  it("keeps entries unlocked during offline reconciliation new after migration", () => {
    const legacy = JSON.parse(JSON.stringify(createInitialState(1000)));
    legacy.version = 8;
    delete legacy.seenWorks; delete legacy.seenStudies;
    legacy.lifetimeAuthority = 2.9;
    legacy.jobs.lamplighter = 1;
    const migrated = decodeSave(JSON.stringify(legacy));
    expect(migrated.seenWorks).toEqual([]);
    const returned = reconcile(migrated, 3000).state;
    expect(availableWorks(returned).filter(id => !returned.seenWorks.includes(id))).toEqual(["fields"]);
  });

  it.each([
    { seenWorks: null }, { seenWorks: ["fields", "fields"] }, { seenWorks: ["unknown"] },
    { seenWorks: ["buried-engine"] }, { seenStudies: ["ledger-keeping"] }, { seenStudies: null },
  ])("rejects malformed or unearned acknowledgement: %j", patch => {
    expect(() => decodeSave(JSON.stringify({ ...openedWard(), ...patch }))).toThrow();
  });
});
