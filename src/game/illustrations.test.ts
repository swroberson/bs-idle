import { describe, expect, it } from "vitest";
import { applyAction } from "./actions";
import { pendingIllustrations } from "./illustrations";
import { createInitialState } from "./state";
import { decodeSave, encodeSave } from "./save";
import { reconcile } from "./simulation";
import { readFileSync } from "node:fs";
import { ILLUSTRATIONS } from "../content/illustrations";

function accomplished() {
  let state = createInitialState(0);
  state.resources = { ...state.resources, food: 20_000, oil: 20_000, coin: 1000, authority: 1000 };
  state.lifetimeAuthority = 1000;
  state = applyAction(state, { type: "build", building: "fields" }, 0);
  state = applyAction(state, { type: "build", building: "oil-press" }, 0);
  state = applyAction(state, { type: "choose-event", event: "household" }, 0);
  state = applyAction(state, { type: "choose-event", event: "lamp-complaint" }, 0);
  state = applyAction(state, { type: "research", research: "examine-old-lamps" }, 0);
  state = applyAction(state, { type: "research", research: "ledger-keeping" }, 0);
  for (const building of ["market-stall", "scrivener-house", "ruined-cistern"] as const) {
    state = applyAction(state, { type: "build", building }, 0);
  }
  return applyAction(state, { type: "assign-worker", job: "scavenger", delta: 1 }, 0);
}

describe("illustrated accomplishments", () => {
  it("starts with an office reveal; reading the Chronicle does not dismiss it", () => {
    const initial = createInitialState(0);
    expect(pendingIllustrations(initial)).toEqual(["keeper-office"]);
    const read = applyAction(initial, { type: "read-chronicle", id: "appointment" }, 0);
    expect(pendingIllustrations(read)).toEqual(["keeper-office"]);
  });

  it("does not reveal available content or failed actions", () => {
    const state = createInitialState(0);
    expect(applyAction(state, { type: "build", building: "oil-press" }, 0)).toBe(state);
    expect(applyAction(state, { type: "research", research: "examine-old-lamps" }, 0)).toBe(state);
    expect(applyAction(state, { type: "start-expedition", destination: "old-cistern", workers: 1 }, 0)).toBe(state);
    expect(pendingIllustrations(state)).toEqual(["keeper-office"]);
  });

  it("records first construction and research in accomplishment order, without repeats", () => {
    const state = accomplished();
    expect(pendingIllustrations(state)).toEqual(["keeper-office", "oil-press", "lamp-examination"]);
    const upgraded = applyAction(state, { type: "build", building: "oil-press" }, 0);
    expect(upgraded.chronicle.filter(id => id === "oil-press-built")).toHaveLength(1);
    expect(pendingIllustrations(upgraded)).toEqual(pendingIllustrations(state));
    expect(applyAction(upgraded, { type: "research", research: "examine-old-lamps" }, 0)).toBe(upgraded);
  });

  it("reveals a first return offline and never replays a repeated expedition", () => {
    const sent = applyAction(accomplished(), { type: "start-expedition", destination: "old-cistern", workers: 1 }, 0);
    expect(pendingIllustrations(sent)).not.toContain("cistern-find");
    const returned = reconcile(sent, 180_000).state;
    expect(pendingIllustrations(returned)).toEqual(["keeper-office", "oil-press", "lamp-examination", "cistern-find"]);
    const dismissed = applyAction(returned, { type: "dismiss-illustrations", ids: pendingIllustrations(returned) }, 180_000);
    const reassigned = applyAction(dismissed, { type: "assign-worker", job: "scavenger", delta: 1 }, 180_000);
    const repeat = applyAction(reassigned, { type: "start-expedition", destination: "old-cistern", workers: 1 }, 180_000);
    expect(pendingIllustrations(reconcile(repeat, 360_000).state)).toEqual([]);
  });

  it("dismisses only the selected reveal and persists both pending and dismissed art", () => {
    const state = accomplished();
    const next = applyAction(state, { type: "dismiss-illustrations", ids: ["keeper-office"] }, 0);
    expect(pendingIllustrations(next)).toEqual(["oil-press", "lamp-examination"]);
    expect(next.readChronicle).toEqual([]);
    expect(next.resources).toEqual(state.resources);
    expect(decodeSave(encodeSave(next))).toEqual(next);
    expect(pendingIllustrations(decodeSave(encodeSave(next)))).toEqual(["oil-press", "lamp-examination"]);
    expect(applyAction(next, { type: "dismiss-illustrations", ids: ["keeper-office"] }, 0)).toBe(next);
  });

  it("leaves a queue snapshot in the Chronicle without dismissing a later discovery", () => {
    const state = accomplished();
    const waiting = pendingIllustrations(state);
    const sent = applyAction(state, { type: "start-expedition", destination: "old-cistern", workers: 1 }, 0);
    const returned = reconcile(sent, 180_000).state;
    const skipped = applyAction(returned, { type: "dismiss-illustrations", ids: waiting }, 180_000);
    expect(pendingIllustrations(skipped)).toEqual(["cistern-find"]);
    expect(skipped.chronicle).toEqual(returned.chronicle);
    expect(skipped.readChronicle).toEqual([]);
  });

  it("continues the economy while a reveal is waiting", () => {
    let state = createInitialState(0);
    for (let i = 0; i < 2; i++) state = applyAction(state, { type: "assign-worker", job: "forager", delta: 1 }, 0);
    const later = reconcile(state, 10_000).state;
    expect(later.resources.food).toBeGreaterThan(state.resources.food);
    expect(pendingIllustrations(later)).toEqual(["keeper-office"]);
  });

  it("reveals the Smithy only after its first construction and persists dismissal", () => {
    const before = accomplished();
    expect(pendingIllustrations(before)).not.toContain("smithy");
    const built = applyAction(before, { type: "build", building: "smithy" }, 0);
    expect(pendingIllustrations(built)).toContain("smithy");
    const dismissed = applyAction(built, { type: "dismiss-illustrations", ids: ["smithy"] }, 0);
    expect(pendingIllustrations(decodeSave(encodeSave(dismissed)))).not.toContain("smithy");
    expect(applyAction(dismissed, { type: "build", building: "smithy" }, 0)).toBe(dismissed);
    expect(dismissed.chronicle.filter(id => id === "smithy-built")).toHaveLength(1);
  });

  it.each([["unknown"], [null], [{}], ["__proto__"], ["oil-press"], ["keeper-office", "keeper-office"], null, "keeper-office"])(
    "rejects invalid or unearned dismissal actions: %j", ids => {
      const state = createInitialState(0);
      expect(applyAction(state, { type: "dismiss-illustrations", ids } as never, 0)).toBe(state);
    },
  );
});

describe("offline illustration assets", () => {
  it("ships a unique Chronicle binding and a local WebP below 300 KB for each illustration", () => {
    const records = Object.values(ILLUSTRATIONS).map(art => art.chronicle);
    expect(new Set(records).size).toBe(records.length);
    for (const art of Object.values(ILLUSTRATIONS)) {
      const asset = readFileSync(new URL(`../../public${art.src}`, import.meta.url));
      expect(asset.subarray(0, 4).toString()).toBe("RIFF");
      expect(asset.subarray(8, 12).toString()).toBe("WEBP");
      expect(asset.length).toBeLessThanOrEqual(300_000);
    }
  });
});

describe("illustration save migration", () => {
  it("migrates version 3 without replaying art or changing existing unread records", () => {
    const state = accomplished();
    const old = JSON.parse(JSON.stringify(state));
    delete old.dismissedIllustrations;
    delete old.awakenedAt; delete old.finaleStep; delete old.jobs.laborer; delete old.jobs.scavenger; delete old.eventChoices; delete old.resources.current;
    for (const id of ["lamp-house", "smithy", "subterranean-works", "buried-engine"]) delete old.buildings[id];
    const chronicle = state.chronicle.filter(id => id !== "oil-press-built");
    const migrated = decodeSave(JSON.stringify({ ...old, version: 3, chronicle, readChronicle: ["appointment"] }));
    expect(migrated.version).toBe(7);
    expect(migrated.resources).toEqual(state.resources);
    expect(migrated.lastSimulatedAt).toBe(state.lastSimulatedAt);
    expect(migrated.chronicle).toEqual([...chronicle, "oil-press-built"]);
    expect(migrated.readChronicle).toEqual(["appointment", "oil-press-built"]);
    expect(pendingIllustrations(migrated)).toEqual([]);
    expect(decodeSave(encodeSave(migrated))).toEqual(migrated);
  });

  it("migrates scaffold saves with their office reveal already dismissed", () => {
    const old = { version: 1, resources: { food: 30, oil: 20, authority: 0 }, population: 5,
      chronicle: ["appointment"], lastSimulatedAt: 0, lastGatheredAt: null };
    const migrated = decodeSave(JSON.stringify(old), 1000);
    expect(migrated.dismissedIllustrations).toEqual(["keeper-office"]);
    expect(migrated.readChronicle).toEqual([]);
    expect(migrated.lastSimulatedAt).toBe(1000);
  });

  it.each([undefined, null, "keeper-office", ["unknown"], ["keeper-office", "keeper-office"], ["oil-press"]])(
    "rejects malformed or unearned dismissal records in version 4: %j", dismissedIllustrations => {
      const original = createInitialState(0);
      expect(() => decodeSave(JSON.stringify({ ...original, dismissedIllustrations }))).toThrow();
      expect(original.dismissedIllustrations).toEqual([]);
    },
  );

  it("requires the Oil Press record to agree with its construction in version 4", () => {
    const state = accomplished();
    expect(() => decodeSave(JSON.stringify({ ...state, chronicle: state.chronicle.filter(id => id !== "oil-press-built") }))).toThrow();
    const initial = createInitialState(0);
    expect(() => decodeSave(JSON.stringify({ ...initial, chronicle: [...initial.chronicle, "oil-press-built"] }))).toThrow();
  });
});
