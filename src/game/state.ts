import { BALANCE } from "../content/balance";
import type { GameState } from "./types";

export function createInitialState(now: number): GameState {
  return {
    version: 9,
    resources: { ...BALANCE.startingResources },
    population: BALANCE.startingPopulation,
    jobs: { forager: 0, lamplighter: 0, laborer: 0, scavenger: 0, scrivener: 0 },
    buildings: { fields: 0, "oil-press": 0, "market-stall": 0, "scrivener-house": 0, "ruined-cistern": 0, "antiquities-house": 0, "lamp-house": 0, smithy: 0, "subterranean-works": 0, "buried-engine": 0 },
    lifetimeAuthority: 0,
    triggeredEvents: [],
    pendingEvents: [],
    eventChoices: {},
    research: [],
    chronicle: ["appointment"],
    readChronicle: [],
    seenWorks: [],
    seenStudies: [],
    dismissedIllustrations: [],
    activeExpedition: null,
    activeConstruction: null,
    completedExpeditions: [],
    expeditionLog: [],
    lastSimulatedAt: now,
    lastGatheredAt: null,
    awakenedAt: null,
    finaleStep: 0,
  };
}
