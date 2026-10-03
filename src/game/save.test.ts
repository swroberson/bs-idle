import { describe, expect, it } from "vitest";
import { createInitialState } from "./state";
import { decodeSave, encodeSave } from "./save";
import { applyAction } from "./actions";

describe("save validation", () => {
  it("round-trips a save after an action", () => {
    const initial = createInitialState(1000);
    const updated = applyAction(initial, { type: "gather-food" }, 1000);
    expect(decodeSave(encodeSave(updated))).toEqual(updated);
    expect(initial.resources.food).toBe(30);
  });

  it("migrates a scaffold save without charging for time before the economy existed", () => {
    const old = { version: 1, resources: { food: 30, oil: 20, authority: 0 }, population: 5, chronicle: ["appointment"], lastSimulatedAt: 1000, lastGatheredAt: null };
    const migrated = decodeSave(JSON.stringify(old), 500_000);
    expect(migrated.version).toBe(6);
    expect(migrated.lastSimulatedAt).toBe(500_000);
    expect(migrated.jobs).toEqual({ forager: 0, lamplighter: 0, scrivener: 0, laborer: 0 });
    expect(migrated.resources).toEqual({ ...createInitialState(0).resources, ...old.resources });
    expect(decodeSave(encodeSave(migrated))).toEqual(migrated);
  });

  it.each([
    { jobs: { forager: 6, lamplighter: 0, scrivener: 0, laborer: 0 } },
    { jobs: { forager: -1, lamplighter: 0, scrivener: 0, laborer: 0 } },
    { jobs: { forager: 1.5, lamplighter: 0, scrivener: 0, laborer: 0 } },
    { buildings: { ...createInitialState(0).buildings, fields: 4 } },
    { pendingEvents: ["household"] },
    { triggeredEvents: ["household", "household"] },
    { research: ["unknown"] },
    { research: ["examine-old-lamps"] },
    { lifetimeAuthority: -1 },
    { resources: { ...createInitialState(0).resources, authority: 5 }, lifetimeAuthority: 0 },
  ])("rejects impossible assignments and inconsistent one-time records: %j", (patch) => {
    expect(() => decodeSave(JSON.stringify({ ...createInitialState(1000), ...patch }))).toThrow();
  });

  it.each([
    "not json", "null", "{}",
    JSON.stringify({ ...createInitialState(1000), version: 999 }),
    JSON.stringify({ ...createInitialState(1000), resources: { food: -1, oil: 20, authority: 0 } }),
    JSON.stringify({ ...createInitialState(1000), resources: { food: 1e309, oil: 20, authority: 0 } }),
    JSON.stringify({ ...createInitialState(1000), resources: { food: 30, oil: 20, authority: 0, unknown: 1 } }),
    JSON.stringify({ ...createInitialState(1000), population: 2.5 }),
    JSON.stringify({ ...createInitialState(1000), chronicle: ["unknown"] }),
    JSON.stringify({ ...createInitialState(1000), chronicle: ["appointment", "appointment"] }),
  ])("rejects invalid or unsupported input: %s", (input) => {
    expect(() => decodeSave(input)).toThrow();
  });
});

describe("opening actions", () => {
  it("allows immediate gathering but prevents repeated clicking and clock rollback", () => {
    const state = createInitialState(1000);
    const gathered = applyAction(state, { type: "gather-food" }, 1000);
    expect(gathered.resources.food).toBe(32);
    expect(applyAction(gathered, { type: "gather-food" }, 1001)).toBe(gathered);
    expect(applyAction(gathered, { type: "gather-food" }, 0)).toBe(gathered);
    expect(applyAction(gathered, { type: "gather-food" }, 31000).resources.food).toBeCloseTo(30.25);
  });

  it("rejects invalid timestamps without altering progress", () => {
    const state = createInitialState(1000);
    expect(applyAction(state, { type: "gather-food" }, Infinity)).toBe(state);
    expect(applyAction(state, { type: "gather-food" }, NaN)).toBe(state);
  });
});

describe("Chronicle attention", () => {
  it("starts unread and preserves acknowledgement through export/import", () => {
    const initial = createInitialState(1000);
    expect(initial.readChronicle).toEqual([]);
    const read = applyAction(initial, { type: "read-chronicle", id: "appointment" }, 1000);
    expect(read.readChronicle).toEqual(["appointment"]);
    expect(decodeSave(encodeSave(read))).toEqual(read);
    expect(initial.readChronicle).toEqual([]);
    expect(applyAction(read, { type: "read-chronicle", id: "appointment" }, 1001)).toBe(read);
    expect(read.resources).toEqual(initial.resources);
    expect(read.lastGatheredAt).toBeNull();
  });

  it("loads earlier economy saves with their entries unread", () => {
    const legacy = JSON.parse(encodeSave(createInitialState(1000)));
    delete legacy.readChronicle;
    expect(decodeSave(JSON.stringify(legacy)).readChronicle).toEqual([]);
  });

  it.each([null, "appointment", ["unknown"], ["appointment", "appointment"]])(
    "rejects malformed read records: %j", (readChronicle) => {
      expect(() => decodeSave(JSON.stringify({ ...createInitialState(1000), readChronicle }))).toThrow();
    },
  );

  it("rejects acknowledgement of an entry absent from the record", () => {
    const initial = createInitialState(1000);
    const withoutEntry = { ...initial, chronicle: [] };
    expect(applyAction(withoutEntry, { type: "read-chronicle", id: "appointment" }, 1000)).toBe(withoutEntry);
  });
});


describe("UI scaffold migration", () => {
  const old = { version: 1, resources: { food: 2165, oil: 20, authority: 0 }, population: 5,
    chronicle: ["appointment"], readChronicle: ["appointment"], workers: { forager: 3, lamplighter: 2 },
    lastSimulatedAt: 1000, lastGatheredAt: null };
  it("preserves allocations, exact stores and read entries when enabling the economy", () => {
    const migrated = decodeSave(JSON.stringify(old), 500_000);
    expect(migrated.jobs).toEqual({ forager: 3, lamplighter: 2, scrivener: 0, laborer: 0 });
    expect(migrated.readChronicle).toEqual(["appointment"]);
    expect(migrated.resources.food).toBe(2165);
    expect(migrated.lastSimulatedAt).toBe(500_000);
    expect(decodeSave(encodeSave(migrated))).toEqual(migrated);
  });
  it.each([null, { forager: 3, lamplighter: 3 }, { forager: -1, lamplighter: 0 }, { forager: 0.5, lamplighter: 0 }])(
    "rejects invalid scaffold allocations: %j", workers => {
      expect(() => decodeSave(JSON.stringify({ ...old, workers }))).toThrow();
    },
  );
  it("rejects acknowledgements of a known but absent entry", () => {
    expect(() => decodeSave(JSON.stringify({ ...old, readChronicle: ["household"] }))).toThrow();
  });
});
