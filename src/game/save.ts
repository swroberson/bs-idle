import { BALANCE } from "../content/balance";
import { CHRONICLE } from "../content/chronicle";
import { RESOURCES } from "../content/resources";
import type { BuildingDefinition, GameState } from "./types";
import { JOBS } from "../content/jobs";
import { BUILDINGS } from "../content/buildings";
import { EVENTS } from "../content/events";
import { EXPEDITIONS } from "../content/expeditions";
import { jobUnlocked, prerequisiteRequirements } from "./requirements";
import { RESEARCH } from "../content/research";
import { createInitialState } from "./state";
import { ILLUSTRATIONS } from "../content/illustrations";
import { pendingIllustrations } from "./illustrations";
import { AWAKENING, WARD_RECORDS } from "../content/awakening";

const OLD_RESOURCES = ["food", "oil", "authority", "coin", "knowledge", "relics"];
const OLD_BUILDINGS = ["fields", "oil-press", "market-stall", "scrivener-house", "ruined-cistern", "antiquities-house"];
const OLD_RESEARCH = ["examine-old-lamps", "ledger-keeping", "crop-rotation", "better-wicks", "catalog-relics", "survey-foundations"];
const OLD_EXPEDITIONS = ["old-cistern", "abandoned-farmstead"];
const OLD_CHRONICLE = Object.fromEntries(Object.keys(CHRONICLE).filter(id => !Object.hasOwn(WARD_RECORDS, id)).map(id => [id, true]));
const PRE_LABOR_CHRONICLE = Object.fromEntries(Object.keys(CHRONICLE).filter(id => id !== "stoneworking" && id !== "repair-household").map(id => [id, true]));

function oldIds(value: unknown, allowed: readonly string[]): boolean {
  return Array.isArray(value) && value.every(id => allowed.includes(id));
}

function migrateIllustrations(state: GameState): GameState {
  const backfill = state.buildings["oil-press"] > 0 && !state.chronicle.includes("oil-press-built");
  const next: GameState = { ...state, version: 6, dismissedIllustrations: [],
    chronicle: backfill ? [...state.chronicle, "oil-press-built"] : state.chronicle,
    readChronicle: backfill ? [...state.readChronicle, "oil-press-built"] : state.readChronicle };
  return { ...next, dismissedIllustrations: pendingIllustrations(next) };
}

export const SAVE_KEY = "buried-sun.save";
export const MAX_SAVE_LENGTH = 100_000;

function record(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function finiteNonnegative(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value >= 0 && value <= Number.MAX_SAFE_INTEGER;
}

function timestamp(value: unknown): value is number {
  return finiteNonnegative(value) && Number.isSafeInteger(value);
}

function exactKeys(value: Record<string, unknown>, keys: string[]): boolean {
  return Object.keys(value).length === keys.length && keys.every((key) => Object.hasOwn(value, key));
}

function ids(value: unknown, content: object): value is string[] {
  return Array.isArray(value) && value.every((id) => typeof id === "string" && Object.hasOwn(content, id)) && new Set(value).size === value.length;
}

function migrateWard(value: Record<string, unknown>): Record<string, unknown> {
  if (!record(value.buildings) || !exactKeys(value.buildings, OLD_BUILDINGS) ||
      !oldIds(value.research, OLD_RESEARCH) || !oldIds(value.completedExpeditions, OLD_EXPEDITIONS) ||
      (value.activeExpedition !== null && (!record(value.activeExpedition) || !OLD_EXPEDITIONS.includes(value.activeExpedition.destination as string))) ||
      !Array.isArray(value.expeditionLog) || !value.expeditionLog.every(entry => record(entry) && OLD_EXPEDITIONS.includes(entry.destination as string))) {
    throw new Error("Invalid legacy save: unsupported buildings or findings.");
  }
  return { ...value, version: 6, resources: { current: 0, ...value.resources as object },
    buildings: { ...createInitialState(0).buildings, ...value.buildings }, awakenedAt: null, finaleStep: 0 };
}

function validateRestoration(state: GameState): void {
  if ((state.awakenedAt !== null && (!timestamp(state.awakenedAt) || state.awakenedAt > state.lastSimulatedAt)) ||
      !timestamp(state.finaleStep) || state.finaleStep > AWAKENING.passages.length ||
      (state.awakenedAt !== null) !== state.chronicle.includes("junction-awakened") ||
      (state.awakenedAt === null && (state.resources.current !== 0 || state.finaleStep !== 0)) ||
      (state.awakenedAt !== null && prerequisiteRequirements(state, AWAKENING.requirements).length)) {
    throw new Error("Invalid save: awakening, Current, and completion records disagree.");
  }
  for (const id of Object.keys(BUILDINGS) as (keyof typeof BUILDINGS)[]) {
    const building: BuildingDefinition = BUILDINGS[id];
    if (building.chronicle && ((state.buildings[id] > 0) !== state.chronicle.includes(building.chronicle) ||
        (state.buildings[id] > 0 && prerequisiteRequirements(state, building.requirements).length))) {
      throw new Error("Invalid save: construction records or prerequisites disagree.");
    }
  }
}

export function decodeSave(text: string, migrationAt?: number): GameState {
  if (text.length > MAX_SAVE_LENGTH) throw new Error("The save is too large for this version.");
  let value: unknown;
  try { value = JSON.parse(text); }
  catch { throw new Error("This is not valid JSON. Choose a Buried Sun save or paste its complete text."); }
  if (!record(value)) throw new Error("The save must contain a game object.");
  if (![1, 2, 3, 4, 5, 6].includes(value.version as number)) throw new Error("Unsupported save version. This game supports versions 1–6.");
  const originalVersion = value.version as number;
  const legacyIllustrations = originalVersion < 4;
  const chronicle = value.chronicle;
  const readChronicle = Object.hasOwn(value, "readChronicle") ? value.readChronicle : [];
  if (!ids(readChronicle, CHRONICLE) || !Array.isArray(chronicle) ||
      !readChronicle.every(id => chronicle.includes(id))) {
    throw new Error("Invalid save data: read Chronicle records are malformed.");
  }
  // The UI scaffold stored allocations as workers; the economy uses jobs.
  const hasWorkers = value.version === 1 && Object.hasOwn(value, "workers");
  if (hasWorkers && (!record(value.workers) || !exactKeys(value.workers, ["forager", "lamplighter"]) ||
      !Object.values(value.workers).every(timestamp) ||
      Object.values(value.workers).reduce<number>((sum, count) => sum + (count as number), 0) > (value.population as number))) {
    throw new Error("Invalid save data: worker assignments exceed the population or are malformed.");
  }
  const baseKeys = ["version", "resources", "population", "chronicle", "lastSimulatedAt", "lastGatheredAt"];
  const extraKeys = ["jobs", "buildings", "lifetimeAuthority", "triggeredEvents", "pendingEvents", "research"];
  const expeditionKeys = ["activeExpedition", "completedExpeditions", "expeditionLog"];
  if (originalVersion >= 4) expeditionKeys.push("dismissedIllustrations");
  if (originalVersion >= 5) expeditionKeys.push("awakenedAt", "finaleStep");
  if (Object.hasOwn(value, "readChronicle")) baseKeys.push("readChronicle");
  if (hasWorkers) baseKeys.push("workers");
  const legacy = value.version === 1 || value.version === 2;
  if (!exactKeys(value, value.version === 1 ? baseKeys : value.version === 2 ? [...baseKeys, ...extraKeys] : [...baseKeys, ...extraKeys, ...expeditionKeys]) ||
      !record(value.resources) || !exactKeys(value.resources, legacy ? ["food", "oil", "authority"] : originalVersion < 5 ? OLD_RESOURCES : Object.keys(RESOURCES)) ||
      !Object.values(value.resources).every(finiteNonnegative) ||
      !timestamp(value.population) || value.population < 1 || value.population > BALANCE.populationCap ||
      !timestamp(value.lastSimulatedAt) ||
      (value.lastGatheredAt !== null && !timestamp(value.lastGatheredAt)) ||
      !ids(value.chronicle, CHRONICLE) || value.chronicle[0] !== "appointment") {
    throw new Error("Invalid save data: check resource values, inhabitants, record IDs and timestamps.");
  }
  if (originalVersion < 5 && (!ids(value.chronicle, OLD_CHRONICLE) || !ids(readChronicle, OLD_CHRONICLE))) {
    throw new Error("Invalid legacy save: unsupported discovery records.");
  }
  if (originalVersion < 6 && (!ids(value.chronicle, PRE_LABOR_CHRONICLE) || !ids(readChronicle, PRE_LABOR_CHRONICLE) ||
      (originalVersion > 1 && (!oldIds(value.triggeredEvents, ["household", "lamp-complaint"]) ||
        !oldIds(value.pendingEvents, ["household", "lamp-complaint"]) || !oldIds(value.research, Object.keys(RESEARCH).filter(id => id !== "stoneworking")))))) {
    throw new Error("Invalid legacy save: unsupported household or study records.");
  }
  if (value.version === 1) {
    if (value.chronicle.length !== 1) throw new Error("Invalid scaffold chronicle.");
    if (migrationAt !== undefined && !timestamp(migrationAt)) throw new Error("Invalid migration timestamp.");
    return migrateIllustrations({ ...createInitialState(Math.max(value.lastSimulatedAt as number, migrationAt ?? 0)),
      resources: { ...createInitialState(0).resources, ...value.resources } as GameState["resources"], population: value.population as number,
      readChronicle: readChronicle as GameState["readChronicle"],
      jobs: { ...createInitialState(0).jobs, ...(hasWorkers ? value.workers as object : {}) },
      lifetimeAuthority: value.resources.authority as number, lastGatheredAt: value.lastGatheredAt as number | null });
  }
  if (value.version === 2) {
    if (!record(value.jobs) || !exactKeys(value.jobs, ["forager", "lamplighter"]) ||
        !record(value.buildings) || !exactKeys(value.buildings, ["fields", "oil-press"]) ||
        !ids(value.research, { "examine-old-lamps": true }) ||
        !ids(value.chronicle, { appointment: true, household: true, "lamp-complaint": true, "lamp-examination": true })) {
      throw new Error("Invalid opening save data.");
    }
    const defaults = createInitialState(0);
    value = { ...value, version: 6, resources: { ...defaults.resources, ...value.resources as object },
      jobs: { ...defaults.jobs, ...value.jobs }, buildings: { ...defaults.buildings, ...value.buildings },
      activeExpedition: null, completedExpeditions: [], expeditionLog: [], awakenedAt: null, finaleStep: 0 };
  }
  if (!record(value)) throw new Error("Invalid migrated save.");
  if (originalVersion === 3 || originalVersion === 4) value = migrateWard(value);
  if (!record(value)) throw new Error("Invalid migrated save.");
  if (originalVersion >= 3 && originalVersion <= 5) {
    if (!record(value.jobs) || !exactKeys(value.jobs, ["forager", "lamplighter", "scrivener"])) {
      throw new Error("Invalid legacy save: worker assignments are malformed.");
    }
    value = { ...value, version: 6, jobs: { ...value.jobs, laborer: 0 } };
  }
  if (!record(value)) throw new Error("Invalid migrated save.");
  if (!record(value.resources) || !ids(value.chronicle, CHRONICLE) ||
      !record(value.jobs) || !exactKeys(value.jobs, Object.keys(JOBS)) || !Object.values(value.jobs).every(timestamp) ||
      Object.values(value.jobs).reduce<number>((sum, count) => sum + (count as number), 0) > (value.population as number) ||
      !record(value.buildings) || !exactKeys(value.buildings, Object.keys(BUILDINGS)) ||
      !Object.entries(value.buildings).every(([id, level]) => timestamp(level) && level <= BUILDINGS[id as keyof typeof BUILDINGS].maxLevel) ||
      !finiteNonnegative(value.lifetimeAuthority) || value.lifetimeAuthority < (value.resources.authority as number) ||
      !ids(value.triggeredEvents, EVENTS) || !ids(value.pendingEvents, EVENTS) || !ids(value.research, RESEARCH) ||
      !value.pendingEvents.every((id) => (value.triggeredEvents as string[]).includes(id))) {
    throw new Error("Invalid save data: check worker assignments, building levels, lifetime Authority and discovery IDs.");
  }
  for (const id of Object.keys(EVENTS) as (keyof typeof EVENTS)[]) {
    const resolved = value.triggeredEvents.includes(id) && !value.pendingEvents.includes(id);
    if (resolved !== value.chronicle.includes(EVENTS[id].chronicle)) throw new Error("Invalid save: event choices and chronicle disagree.");
  }
  for (const id of Object.keys(RESEARCH) as (keyof typeof RESEARCH)[]) {
    if (value.research.includes(id) !== value.chronicle.includes(RESEARCH[id].chronicle) ||
        (value.research.includes(id) && !value.chronicle.includes("lamp-complaint"))) throw new Error("Invalid save: investigation records disagree.");
  }
  if (value.triggeredEvents.includes("lamp-complaint") && !value.chronicle.includes("household")) throw new Error("Invalid save: the household record is missing.");
  const state = value as unknown as GameState;
  if (state.triggeredEvents.includes("repair-household") && prerequisiteRequirements(state, EVENTS["repair-household"].requirements).length) {
    throw new Error("Invalid save: household arrival prerequisites are missing.");
  }
  validateRestoration(state);
  if (!ids(value.completedExpeditions, EXPEDITIONS) || !Array.isArray(value.expeditionLog) || value.expeditionLog.length > BALANCE.expeditionLogLimit ||
      (Object.keys(JOBS) as (keyof typeof JOBS)[]).some(id => state.jobs[id] > 0 && !jobUnlocked(state, id))) throw new Error("Invalid expedition or worker records.");
  for (const id of Object.keys(EXPEDITIONS) as (keyof typeof EXPEDITIONS)[]) {
    if (state.completedExpeditions.includes(id) !== state.chronicle.includes(EXPEDITIONS[id].chronicle) ||
        (state.completedExpeditions.includes(id) && prerequisiteRequirements(state, EXPEDITIONS[id].requirements).length)) throw new Error("Invalid save: expedition discoveries disagree.");
  }
  for (const id of state.research) if (prerequisiteRequirements(state, RESEARCH[id].requirements).length) throw new Error("Invalid save: research prerequisites are missing.");
  function validParty(party: unknown, log: boolean): boolean {
    if (!record(party) || !exactKeys(party, log ? ["destination", "workers", "startedAt", "returnsAt", "returnedAt", "rewards", "firstDiscovery"] : ["destination", "workers", "startedAt", "returnsAt"]) ||
        typeof party.destination !== "string" || !Object.hasOwn(EXPEDITIONS, party.destination) ||
        !timestamp(party.workers) || party.workers < 1 || party.workers > BALANCE.expeditionMaxWorkers ||
        !timestamp(party.startedAt) || !timestamp(party.returnsAt) || party.startedAt > state.lastSimulatedAt) return false;
    const destination = EXPEDITIONS[party.destination as keyof typeof EXPEDITIONS];
    if (party.returnsAt - party.startedAt !== destination.durationMs || prerequisiteRequirements(state, destination.requirements).length) return false;
    if (!log) return party.returnsAt > state.lastSimulatedAt;
    return party.returnedAt === party.returnsAt && party.returnsAt <= state.lastSimulatedAt &&
      typeof party.firstDiscovery === "boolean" && state.completedExpeditions.includes(party.destination as keyof typeof EXPEDITIONS) &&
      record(party.rewards) && exactKeys(party.rewards, Object.keys(destination.rewardsPerWorker)) &&
      Object.entries(party.rewards).every(([id, amount]) => finiteNonnegative(amount) && amount <= (destination.rewardsPerWorker as Record<string, number>)[id] * (party.workers as number));
  }
  if ((value.activeExpedition !== null && !validParty(value.activeExpedition, false)) ||
      !state.expeditionLog.every(entry => validParty(entry, true)) ||
      Object.values(state.jobs).reduce((sum, count) => sum + count, 0) + (state.activeExpedition?.workers ?? 0) > state.population) throw new Error("Invalid save: check expedition workers, timers and rewards.");
  const firsts = new Set<string>();
  let previousReturn = 0;
  for (const entry of state.expeditionLog) {
    if (entry.startedAt < previousReturn || (entry.firstDiscovery && firsts.has(entry.destination))) throw new Error("Invalid save: expedition history overlaps or repeats a discovery.");
    previousReturn = entry.returnedAt;
    if (entry.firstDiscovery) firsts.add(entry.destination);
  }
  if (state.activeExpedition && state.activeExpedition.startedAt < previousReturn) throw new Error("Invalid save: overlapping expeditions.");
  const result = legacyIllustrations ? migrateIllustrations({ ...state, readChronicle } as GameState) : { ...state, readChronicle } as GameState;
  if ((result.buildings["oil-press"] > 0) !== result.chronicle.includes("oil-press-built")) {
    throw new Error("Invalid save: Oil Press construction and Chronicle disagree.");
  }
  if (!ids(result.dismissedIllustrations, ILLUSTRATIONS) ||
      !result.dismissedIllustrations.every(id => result.chronicle.includes(ILLUSTRATIONS[id].chronicle))) {
    throw new Error("Invalid save data: illustration dismissals are malformed or unearned.");
  }
  // Validation above covers every field. Return a fresh JSON object, not user references.
  return result;
}

export function encodeSave(state: GameState): string {
  const text = JSON.stringify(state, null, 2);
  decodeSave(text);
  return text;
}
