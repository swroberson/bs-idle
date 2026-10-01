import type { CHRONICLE } from "../content/chronicle";
import type { RESOURCES } from "../content/resources";
import type { JOBS } from "../content/jobs";
import type { BUILDINGS } from "../content/buildings";
import type { EVENTS } from "../content/events";
import type { RESEARCH } from "../content/research";

export type ResourceId = keyof typeof RESOURCES;
export type ChronicleId = keyof typeof CHRONICLE;
export type JobId = keyof typeof JOBS;
export type BuildingId = keyof typeof BUILDINGS;
export type EventId = keyof typeof EVENTS;
export type ResearchId = keyof typeof RESEARCH;
export type Cost = Partial<Record<ResourceId, number>>;

export interface GameState {
  version: 2;
  resources: Record<ResourceId, number>;
  population: number;
  jobs: Record<JobId, number>;
  buildings: Record<BuildingId, number>;
  lifetimeAuthority: number;
  triggeredEvents: EventId[];
  pendingEvents: EventId[];
  research: ResearchId[];
  chronicle: ChronicleId[];
  lastSimulatedAt: number;
  lastGatheredAt: number | null;
}

export type GameAction =
  | { type: "gather-food" }
  | { type: "assign-worker"; job: JobId; delta: 1 | -1 }
  | { type: "build"; building: BuildingId }
  | { type: "choose-event"; event: EventId }
  | { type: "research"; research: ResearchId };

export interface ReturnSummary {
  elapsedMs: number;
  productionMs: number;
  changes: Record<ResourceId, number>;
  newEvents: EventId[];
}
