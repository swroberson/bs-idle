import { BALANCE } from "./balance";

export const JOBS = {
  forager: { name: "Forager", description: "Gather Food from the abandoned gardens.", requirements: {}, foodPerSecond: 0.12 },
  lamplighter: { name: "Lamplighter", description: "Consume Oil to keep the lamps lit and earn Authority.", requirements: {}, oilPerSecond: 0.075, authorityPerSecond: 0.1 },
  laborer: { name: "Laborer", description: "Prepare stone and carry materials for the active construction project. Each assigned Laborer performs one second of work per second; Food shortages halve output. Without a project, no work accumulates.", requirements: { lifetimeAuthority: BALANCE.worksAuthority }, workPerSecond: 1 },
  scavenger: { name: "Scavenger", description: "Prepare for archaeological expeditions. Dispatch draws from assigned Scavengers; returned workers remain idle. No passive output.", requirements: { buildings: { "ruined-cistern": 1 } } },
  scrivener: { name: "Scrivener", description: "Record observations. Produces 0.08 Knowledge/s; output halves during Food shortages.", requirements: { buildings: { "scrivener-house": 1 } }, knowledgePerSecond: 0.08 },
} as const;
