import { BALANCE } from "../content/balance";
import { CHRONICLE } from "../content/chronicle";
import { RESOURCES } from "../content/resources";
import type { GameState } from "./types";
import { JOBS } from "../content/jobs";
import { BUILDINGS } from "../content/buildings";
import { EVENTS } from "../content/events";
import { EXPEDITIONS } from "../content/expeditions";
import { prerequisiteRequirements } from "./requirements";
import { RESEARCH } from "../content/research";
import { createInitialState } from "./state";

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

export function decodeSave(text: string, migrationAt?: number): GameState {
  if (text.length > MAX_SAVE_LENGTH) throw new Error("The save is too large for this version.");
  let value: unknown;
  try { value = JSON.parse(text); }
  catch { throw new Error("This is not valid JSON. Choose a Buried Sun save or paste its complete text."); }
  if (!record(value)) throw new Error("The save must contain a game object.");
  if (value.version !== 1 && value.version !== 2 && value.version !== 3) throw new Error("Unsupported save version. This game supports versions 1, 2 and 3.");
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
  if (Object.hasOwn(value, "readChronicle")) baseKeys.push("readChronicle");
  if (hasWorkers) baseKeys.push("workers");
  const legacy = value.version !== 3;
  if (!exactKeys(value, value.version === 1 ? baseKeys : value.version === 2 ? [...baseKeys, ...extraKeys] : [...baseKeys, ...extraKeys, ...expeditionKeys]) ||
      !record(value.resources) || !exactKeys(value.resources, legacy ? ["food", "oil", "authority"] : Object.keys(RESOURCES)) ||
      !Object.values(value.resources).every(finiteNonnegative) ||
      !timestamp(value.population) || value.population < 1 || value.population > BALANCE.populationCap ||
      !timestamp(value.lastSimulatedAt) ||
      (value.lastGatheredAt !== null && !timestamp(value.lastGatheredAt)) ||
      !ids(value.chronicle, CHRONICLE) || value.chronicle[0] !== "appointment") {
    throw new Error("Invalid save data: check resource values, inhabitants, record IDs and timestamps.");
  }
  if (value.version === 1) {
    if (value.chronicle.length !== 1) throw new Error("Invalid scaffold chronicle.");
    if (migrationAt !== undefined && !timestamp(migrationAt)) throw new Error("Invalid migration timestamp.");
    return { ...createInitialState(Math.max(value.lastSimulatedAt as number, migrationAt ?? 0)),
      resources: { ...createInitialState(0).resources, ...value.resources } as GameState["resources"], population: value.population as number,
      readChronicle: readChronicle as GameState["readChronicle"],
      jobs: { ...createInitialState(0).jobs, ...(hasWorkers ? value.workers as object : {}) },
      lifetimeAuthority: value.resources.authority as number, lastGatheredAt: value.lastGatheredAt as number | null };
  }
  if (value.version === 2) {
    if (!record(value.jobs) || !exactKeys(value.jobs, ["forager", "lamplighter"]) ||
        !record(value.buildings) || !exactKeys(value.buildings, ["fields", "oil-press"]) ||
        !ids(value.research, { "examine-old-lamps": true }) ||
        !ids(value.chronicle, { appointment: true, household: true, "lamp-complaint": true, "lamp-examination": true })) {
      throw new Error("Invalid opening save data.");
    }
    const defaults = createInitialState(0);
    value = { ...value, version: 3, resources: { ...defaults.resources, ...value.resources as object },
      jobs: { ...defaults.jobs, ...value.jobs }, buildings: { ...defaults.buildings, ...value.buildings },
      activeExpedition: null, completedExpeditions: [], expeditionLog: [] };
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
  if (!ids(value.completedExpeditions, EXPEDITIONS) || !Array.isArray(value.expeditionLog) || value.expeditionLog.length > BALANCE.expeditionLogLimit ||
      (state.jobs.scrivener > 0 && state.buildings["scrivener-house"] === 0)) throw new Error("Invalid expedition or scholarship records.");
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
  // Validation above covers every field. Return a fresh JSON object, not user references.
  return { ...value, readChronicle } as unknown as GameState;
}

export function encodeSave(state: GameState): string {
  const text = JSON.stringify(state, null, 2);
  decodeSave(text);
  return text;
}
