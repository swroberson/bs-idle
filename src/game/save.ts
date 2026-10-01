import { BALANCE } from "../content/balance";
import { CHRONICLE } from "../content/chronicle";
import { RESOURCES } from "../content/resources";
import type { GameState } from "./types";

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

export function decodeSave(text: string): GameState {
  if (text.length > MAX_SAVE_LENGTH) throw new Error("The save is too large for this version.");
  let value: unknown;
  try { value = JSON.parse(text); }
  catch { throw new Error("This is not valid JSON. Choose a Buried Sun save or paste its complete text."); }
  if (!record(value)) throw new Error("The save must contain a game object.");
  if (value.version !== 1) throw new Error("Unsupported save version. This scaffold supports version 1.");
  if (!exactKeys(value, ["version", "resources", "population", "chronicle", "lastSimulatedAt", "lastGatheredAt"]) ||
      !record(value.resources) || !exactKeys(value.resources, Object.keys(RESOURCES)) ||
      !Object.values(value.resources).every(finiteNonnegative) ||
      !timestamp(value.population) || value.population < 1 || value.population > BALANCE.populationCap ||
      !timestamp(value.lastSimulatedAt) ||
      (value.lastGatheredAt !== null && !timestamp(value.lastGatheredAt)) ||
      !Array.isArray(value.chronicle) || value.chronicle.length !== 1 ||
      !value.chronicle.every((id) => typeof id === "string" && Object.hasOwn(CHRONICLE, id)) ||
      new Set(value.chronicle).size !== value.chronicle.length) {
    throw new Error("Invalid save data: check resource values, inhabitants, record IDs and timestamps.");
  }
  // Validation above covers every field. Return a fresh JSON object, not user references.
  return value as unknown as GameState;
}

export function encodeSave(state: GameState): string {
  const text = JSON.stringify(state, null, 2);
  decodeSave(text);
  return text;
}
