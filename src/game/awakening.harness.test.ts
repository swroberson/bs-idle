// Development-only reachability, never used by the browser application.
import { expect, it } from "vitest";
import { createInitialState } from "./state";
import { applyAction } from "./actions";
import { reconcile } from "./simulation";
import { availableWorkers, eventRequirements, researchRequirements, expeditionRequirements, costRequirements } from "./requirements";
import { releaseIdleCrew, startBuilding } from "./construction.test-support";
import { decodeSave, encodeSave } from "./save";
import type { BuildingId, ResearchId, ExpeditionId } from "./types";
import { writeFileSync } from "node:fs";
import { RESEARCH } from "../content/research";
import { LAMPS } from "../content/lamps";
import { BUILDINGS } from "../content/buildings";
import { resourceCapacity } from "./storage";

it.each([[1, false, false, "none"], [3, false, false, "none"], [3, true, false, "none"], [3, true, true, "none"],
  [3, false, false, "opening"], [3, false, false, "scholarship"], [3, false, false, "engine"]] as const)("reaches awakening without grants or manual gathering (Market %i, labor %s, civic %s, absence %s)", (marketLevel, useLabor, useCivic, awayAt) => {
  let state = createInitialState(0);
  const milestones: Record<string, number> = {};
  let absenceSeconds = 0;
  for (let i = 0; i < 3; i++) state = applyAction(state, { type: "assign-worker", job: "forager", delta: 1 }, 0);
  for (let i = 0; i < 2; i++) state = applyAction(state, { type: "assign-worker", job: "lamplighter", delta: 1 }, 0);
  for (let second = 1; second <= 7200; second++) {
    let now = (second + absenceSeconds) * 1000;
    const tick = reconcile(state, now);
    state = tick.state;
    const leave = awayAt === "opening" ? state.buildings["oil-press"] > 0 :
      awayAt === "scholarship" ? state.jobs.scrivener > 0 :
      awayAt === "engine" ? state.buildings["buried-engine"] > 0 : false;
    if (leave && absenceSeconds === 0) {
      absenceSeconds = 7200;
      now += absenceSeconds * 1000;
      state = reconcile(state, now).state;
      expect(state.awakenedAt).toBeNull();
      for (const id of ["food", "oil", "authority", "coin", "knowledge"] as const) {
        expect(state.resources[id]).toBeLessThanOrEqual(resourceCapacity(state, id));
      }
      console.info(`Two-hour return at ${awayAt}:`, state.resources);
      if (process.env.BS_CAPTURE_SAVES) writeFileSync(`/tmp/buried-sun-return-${awayAt}.json`, encodeSave(state));
    }
    for (const project of tick.summary.completedConstruction) milestones[project.id] = second;
    state = releaseIdleCrew(state);
    const event = state.pendingEvents[0];
    if (process.env.BS_CAPTURE_SAVES && event === "repair-household") writeFileSync("/tmp/buried-sun-household.json", encodeSave(state));
    const choice = event === "shared-table" ? "full-meal" : event === "spare-oil" ? "coin" : undefined;
    if (event && !eventRequirements(state, event, choice).length) state = applyAction(state, { type: "choose-event", event, choice }, now);
    // Keep lighting sustainable, including after an early return to an underpowered press.
    if (state.buildings["oil-press"] > 0 && state.buildings["oil-press"] < 3 && state.buildings["oil-press"] * BUILDINGS["oil-press"].oilPerSecond < LAMPS.count * LAMPS.oilPerLampSecond) {
      state = startBuilding(state, "oil-press");
    }
    for (const building of ["fields", "oil-press", "market-stall", "scrivener-house", "ruined-cistern", "antiquities-house", "subterranean-works", "buried-engine"] as BuildingId[]) {
      if (!state.buildings[building]) {
        state = startBuilding(state, building);
      }
    }
    if (state.buildings["scrivener-house"] && !state.jobs.scrivener) state = applyAction(state, { type: "assign-worker", job: "scrivener", delta: 1 }, now);
    if (useLabor && state.buildings["scrivener-house"]) {
      if (!state.buildings.smithy) state = startBuilding(state, "smithy");
      if (state.buildings.fields < 2) state = startBuilding(state, "fields");
      if (!state.research.includes("stoneworking") && !researchRequirements(state, "stoneworking").length) {
        if (process.env.BS_CAPTURE_SAVES) writeFileSync("/tmp/buried-sun-stoneworking.json", encodeSave(state));
        state = applyAction(state, { type: "research", research: "stoneworking" }, now);
        milestones.stoneworking = second;
      }
    }
    if (state.research.includes("survey-foundations")) {
      if (state.jobs.scrivener === 1) {
        if (state.jobs.forager > 2) state = applyAction(state, { type: "assign-worker", job: "forager", delta: -1 }, now);
        state = applyAction(state, { type: "assign-worker", job: "scrivener", delta: 1 }, now);
      }
      if (state.buildings["market-stall"] < marketLevel) {
        state = startBuilding(state, "market-stall");
      }
    }
    if (useCivic) {
      for (const research of ["provision-stores", "apprenticed-hands", "collated-records"] as const) {
        if (!state.research.includes(research) && !researchRequirements(state, research).length) {
          state = applyAction(state, { type: "research", research }, now); milestones[research] = second;
        }
      }
    }
    if (state.research.includes("study-engine") && !state.research.includes("restore-conduit") && !state.jobs.laborer && !state.activeConstruction && !costRequirements(state, RESEARCH["restore-conduit"].cost).length) {
      if (!availableWorkers(state)) state = applyAction(state, { type: "assign-worker", job: "forager", delta: -1 }, now);
      state = applyAction(state, { type: "assign-worker", job: "laborer", delta: 1 }, now);
    }
    for (const research of ["examine-old-lamps", "ledger-keeping", "catalog-relics", "survey-foundations", "trace-conduits", "open-chamber", "study-engine", "restore-conduit"] as ResearchId[]) {
      if (!state.research.includes(research) && !researchRequirements(state, research).length) {
        state = applyAction(state, { type: "research", research }, now); milestones[research] = second;
        expect(decodeSave(encodeSave(state))).toEqual(state);
      }
    }
    let destination: ExpeditionId | null = null;
    if (!state.completedExpeditions.includes("old-cistern")) destination = "old-cistern";
    else if (state.research.includes("survey-foundations") && !state.completedExpeditions.includes("ruined-aqueduct")) destination = "ruined-aqueduct";
    else if (state.buildings["subterranean-works"] && !state.completedExpeditions.includes("chapel-foundations")) destination = "chapel-foundations";
    else if (state.research.includes("study-engine") && !state.research.includes("restore-conduit") && state.resources.relics < 2 && state.activeConstruction?.kind !== "research") destination = "old-cistern";
    if (destination && !state.activeExpedition && state.buildings["ruined-cistern"]) {
      while (state.jobs.scavenger < 2 && availableWorkers(state) > 0) state = applyAction(state, { type: "assign-worker", job: "scavenger", delta: 1 }, now);
    }
    if (destination && !expeditionRequirements(state, destination, 2).length) state = applyAction(state, { type: "start-expedition", destination, workers: 2 }, now);
    if (state.research.includes("restore-conduit")) {
      if (process.env.BS_CAPTURE_SAVES && marketLevel === 3 && !useLabor) writeFileSync("/tmp/buried-sun-repaired.json", encodeSave(state));
      state = applyAction(state, { type: "awaken-junction" }, now);
      if (process.env.BS_CAPTURE_SAVES && marketLevel === 3 && !useLabor) writeFileSync("/tmp/buried-sun-awakened.json", encodeSave(state));
      milestones.awakening = second; break;
    }
  }
  console.info(`Awakening harness (Market ${marketLevel}, labor ${useLabor}, civic ${useCivic}, seconds):`, milestones);
  expect(state.awakenedAt).not.toBeNull();
  expect(milestones.awakening).toBeLessThanOrEqual(3600);
  expect(absenceSeconds).toBe(awayAt === "none" ? 0 : 7200);
  expect(state.completedExpeditions).toEqual(["old-cistern", "ruined-aqueduct", "chapel-foundations"]);
  expect(state.population).toBe(useLabor ? 10 : 8);
  if (useLabor) {
    expect(state.research).toContain("stoneworking");
    expect(state.chronicle).toContain("repair-household");
    expect(state.jobs.laborer).toBe(0);
  }
  if (useCivic) {
    expect(state.research).toEqual(expect.arrayContaining(["provision-stores", "apprenticed-hands", "collated-records"]));
    expect(state.eventChoices).toEqual({ "shared-table": "full-meal", "spare-oil": "coin" });
  }
  expect(availableWorkers(state)).toBe(useLabor ? 4 : 2);
  expect(decodeSave(encodeSave(state))).toEqual(state);
  expect(reconcile(state, state.lastSimulatedAt + 1000).state.resources.current).toBeCloseTo(.02);
});
