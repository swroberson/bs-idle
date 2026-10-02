import type { CHRONICLE } from "../content/chronicle";
import type { RESOURCES } from "../content/resources";
import type { JOBS } from "../content/jobs";
import type { BUILDINGS } from "../content/buildings";
import type { EVENTS } from "../content/events";
import type { EXPEDITIONS } from "../content/expeditions";
import type { RESEARCH } from "../content/research";

export type ResourceId = keyof typeof RESOURCES;
export type ChronicleId = keyof typeof CHRONICLE;
export type JobId = keyof typeof JOBS;
export type BuildingId = keyof typeof BUILDINGS;
export type EventId = keyof typeof EVENTS;
export type ResearchId = keyof typeof RESEARCH;
export type ExpeditionId = keyof typeof EXPEDITIONS;
export type Cost = Partial<Record<ResourceId, number>>;

export interface GameState {
  version: 3;
  resources: Record<ResourceId, number>;
  population: number;
  jobs: Record<JobId, number>;
  buildings: Record<BuildingId, number>;
  lifetimeAuthority: number;
  triggeredEvents: EventId[];
  pendingEvents: EventId[];
  research: ResearchId[];
  chronicle: ChronicleId[];
  readChronicle: ChronicleId[];
  activeExpedition: ActiveExpedition | null;
  completedExpeditions: ExpeditionId[];
  expeditionLog: ExpeditionReturn[];
  lastSimulatedAt: number;
  lastGatheredAt: number | null;
}

export type GameAction =
  | { type: "read-chronicle"; id: ChronicleId }
  | { type: "gather-food" }
  | { type: "render-oil" }
  | { type: "assign-worker"; job: JobId; delta: 1 | -1 }
  | { type: "build"; building: BuildingId }
  | { type: "choose-event"; event: EventId }
  | { type: "research"; research: ResearchId }
  | { type: "start-expedition"; destination: ExpeditionId; workers: number };

export interface ReturnSummary {
  elapsedMs: number;
  productionMs: number;
  changes: Record<ResourceId, number>;
  newEvents: EventId[];
  completedExpeditions: ExpeditionId[];
}

// Content prerequisites use stable IDs; the save boundary validates persisted IDs.
export interface ContentRequirements {
  buildings?: Record<string, number>;
  research?: readonly string[];
  chronicle?: readonly string[];
  expeditions?: readonly string[];
  lifetimeAuthority?: number;
}
export interface Modifiers {
  foodMultiplier?: number;
  oilDemandMultiplier?: number;
}
export interface BuildingDefinition {
  name: string; description: string; effect: string; cost: Cost;
  costGrowth: number; maxLevel: number; requirements: ContentRequirements;
  foodPerForager?: number; oilPerSecond?: number; coinPerSecond?: number;
}
export interface ResearchDefinition {
  name: string; text: string; description: string; effect: string; cost: Cost;
  chronicle: ChronicleId; requirements: ContentRequirements; modifiers?: Modifiers;
}
export interface ExpeditionDefinition {
  name: string; description: string; durationMs: number; foodPerWorker: number;
  rewardsPerWorker: Cost; requirements: ContentRequirements; chronicle: ChronicleId;
}
export interface ActiveExpedition {
  destination: ExpeditionId; workers: number; startedAt: number; returnsAt: number;
}
export interface ExpeditionReturn extends ActiveExpedition {
  returnedAt: number; rewards: Cost; firstDiscovery: boolean;
}
