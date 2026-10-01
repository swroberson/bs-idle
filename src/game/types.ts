import type { CHRONICLE } from "../content/chronicle";
import type { RESOURCES } from "../content/resources";

export type ResourceId = keyof typeof RESOURCES;
export type ChronicleId = keyof typeof CHRONICLE;

export interface GameState {
  version: 1;
  resources: Record<ResourceId, number>;
  population: number;
  chronicle: ChronicleId[];
  lastSimulatedAt: number;
  lastGatheredAt: number | null;
}

export type GameAction = { type: "gather-food" };
