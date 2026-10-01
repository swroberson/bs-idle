import { BALANCE } from "../content/balance";
import { CHRONICLE } from "../content/chronicle";
import { RESOURCES } from "../content/resources";
import type { GameState } from "./types";
import { JOBS } from "../content/jobs";
import { BUILDINGS } from "../content/buildings";
import { EVENTS } from "../content/events";
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
  if (value.version !== 1 && value.version !== 2) throw new Error("Unsupported save version. This game supports versions 1 and 2.");
  const baseKeys = ["version", "resources", "population", "chronicle", "lastSimulatedAt", "lastGatheredAt"];
  const extraKeys = ["jobs", "buildings", "lifetimeAuthority", "triggeredEvents", "pendingEvents", "research"];
  if (!exactKeys(value, value.version === 1 ? baseKeys : [...baseKeys, ...extraKeys]) ||
      !record(value.resources) || !exactKeys(value.resources, Object.keys(RESOURCES)) ||
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
      resources: value.resources as GameState["resources"], population: value.population as number,
      lifetimeAuthority: value.resources.authority as number, lastGatheredAt: value.lastGatheredAt as number | null };
  }
  if (!record(value.jobs) || !exactKeys(value.jobs, Object.keys(JOBS)) || !Object.values(value.jobs).every(timestamp) ||
      (value.jobs.forager as number) + (value.jobs.lamplighter as number) > (value.population as number) ||
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
  // Validation above covers every field. Return a fresh JSON object, not user references.
  return value as unknown as GameState;
}

export function encodeSave(state: GameState): string {
  const text = JSON.stringify(state, null, 2);
  decodeSave(text);
  return text;
}
