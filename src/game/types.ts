import type { CHRONICLE } from "../content/chronicle";
import type { RESOURCES } from "../content/resources";
import type { JOBS } from "../content/jobs";
import type { BUILDINGS } from "../content/buildings";
import type { EVENTS } from "../content/events";
import type { EXPEDITIONS } from "../content/expeditions";
import type { RESEARCH } from "../content/research";
import type { ILLUSTRATIONS } from "../content/illustrations";

export type ResourceId = keyof typeof RESOURCES;
export type ChronicleId = keyof typeof CHRONICLE;
export type JobId = keyof typeof JOBS;
export type BuildingId = keyof typeof BUILDINGS;
export type EventId = keyof typeof EVENTS;
export type ResearchId = keyof typeof RESEARCH;
export type ExpeditionId = keyof typeof EXPEDITIONS;
export type IllustrationId = keyof typeof ILLUSTRATIONS;
export type Cost = Partial<Record<ResourceId, number>>;

export interface GameState {
  version: 9;
  resources: Record<ResourceId, number>;
  population: number;
  jobs: Record<JobId, number>;
  buildings: Record<BuildingId, number>;
  lifetimeAuthority: number;
  triggeredEvents: EventId[];
  pendingEvents: EventId[];
  eventChoices: Partial<Record<EventId, string>>;
  research: ResearchId[];
  chronicle: ChronicleId[];
  readChronicle: ChronicleId[];
  seenWorks: BuildingId[];
  seenStudies: ResearchId[];
  dismissedIllustrations: IllustrationId[];
  activeExpedition: ActiveExpedition | null;
  activeConstruction: ActiveConstruction | null;
  completedExpeditions: ExpeditionId[];
  expeditionLog: ExpeditionReturn[];
  lastSimulatedAt: number;
  lastGatheredAt: number | null;
  awakenedAt: number | null;
  finaleStep: number;
}

export type GameAction =
  | { type: "awaken-junction" }
  | { type: "advance-awakening"; step: number }
  | { type: "dismiss-illustrations"; ids: IllustrationId[] }
  | { type: "read-chronicle"; id: ChronicleId }
  | { type: "view-work"; id: BuildingId }
  | { type: "view-study"; id: ResearchId }
  | { type: "gather-food" }
  | { type: "render-oil" }
  | { type: "assign-worker"; job: JobId; delta: 1 | -1 }
  | { type: "build"; building: BuildingId }
  | { type: "choose-event"; event: EventId; choice?: string }
  | { type: "research"; research: ResearchId }
  | { type: "start-expedition"; destination: ExpeditionId; workers: number };

export interface ReturnSummary {
  elapsedMs: number;
  productionMs: number;
  changes: Record<ResourceId, number>;
  newEvents: EventId[];
  completedExpeditions: ExpeditionId[];
  completedConstruction: ConstructionProject[];
  fullStores: ResourceId[];
}

export type ConstructionProject =
  | { kind: "building"; id: BuildingId }
  | { kind: "research"; id: "restore-conduit" };
export type ActiveConstruction = ConstructionProject & { workDone: number; startedAt: number };

// Content prerequisites use stable IDs; the save boundary validates persisted IDs.
export interface ContentRequirements {
  buildings?: Record<string, number>;
  research?: readonly string[];
  chronicle?: readonly string[];
  expeditions?: readonly string[];
  lifetimeAuthority?: number;
}
export interface Modifiers {
  constructionCoinMultiplier?: number;
  constructionSpeedMultiplier?: number;
  expeditionFoodMultiplier?: number;
  knowledgeMultiplier?: number;
  foodMultiplier?: number;
  oilDemandMultiplier?: number;
  oilOutputMultiplier?: number;
}
export interface BuildingDefinition {
  name: string; description: string; effect?: string; completedEffect?: string; cost: Cost;
  costGrowth: number; maxLevel: number; requirements: ContentRequirements; workSeconds: number;
  foodPerForager?: number; oilPerSecond?: number; coinPerSecond?: number;
  authorityPerLamplighter?: number; chronicle?: ChronicleId;
  storagePerLevel?: Cost;
}
export interface ResearchDefinition {
  name: string; text: string; description: string; effect: string; cost: Cost;
  chronicle: ChronicleId; requirements: ContentRequirements; modifiers?: Modifiers; workSeconds?: number;
}
interface EventBase {
  title: string; text: string; population: number;
  chronicle: ChronicleId; requirements: ContentRequirements;
}
export type EventDefinition = EventBase & (
  { choice: string; cost: Cost; provisionedArrival?: boolean; choices?: never } |
  { choices: readonly EventChoice[]; choice?: never; cost?: never; provisionedArrival?: never }
);
export interface EventChoice {
  id: string; label: string; cost: Cost; rewards: Cost;
}
export interface ExpeditionDefinition {
  name: string; description: string; durationMs: number; foodPerWorker: number;
  rewardsPerWorker: Cost; requirements: ContentRequirements; chronicle: ChronicleId;
  staffing: "scavenger" | "idle";
}
export interface ActiveExpedition {
  destination: ExpeditionId; workers: number; startedAt: number; returnsAt: number;
}
export interface ExpeditionReturn extends ActiveExpedition {
  returnedAt: number; rewards: Cost; firstDiscovery: boolean;
}
