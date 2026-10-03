// Development-only reachability, never used by the browser application.
import { expect, it } from "vitest";
import { createInitialState } from "./state";
import { applyAction } from "./actions";
import { reconcile } from "./simulation";
import { availableWorkers, buildingRequirements, eventRequirements, researchRequirements, expeditionRequirements } from "./requirements";
import { decodeSave, encodeSave } from "./save";
import type { BuildingId, ResearchId, ExpeditionId } from "./types";
import { writeFileSync } from "node:fs";

it.each([[1, false], [3, false], [3, true]] as const)("reaches awakening without grants or manual gathering (Market %i, labor %s)", (marketLevel, useLabor) => {
  let state = createInitialState(0);
  const milestones: Record<string, number> = {};
  for (let i = 0; i < 3; i++) state = applyAction(state, { type: "assign-worker", job: "forager", delta: 1 }, 0);
  for (let i = 0; i < 2; i++) state = applyAction(state, { type: "assign-worker", job: "lamplighter", delta: 1 }, 0);
  for (let second = 1; second <= 7200; second++) {
    const now = second * 1000;
    state = reconcile(state, now).state;
    const event = state.pendingEvents[0];
    if (process.env.BS_CAPTURE_SAVES && event === "repair-household") writeFileSync("/tmp/buried-sun-household.json", encodeSave(state));
    if (event && !eventRequirements(state, event).length) state = applyAction(state, { type: "choose-event", event }, now);
    for (const building of ["fields", "oil-press", "market-stall", "scrivener-house", "ruined-cistern", "antiquities-house", "subterranean-works", "buried-engine"] as BuildingId[]) {
      if (!state.buildings[building] && !buildingRequirements(state, building).length) {
        state = applyAction(state, { type: "build", building }, now); milestones[building] = second;
      }
    }
    if (state.buildings["scrivener-house"] && !state.jobs.scrivener) state = applyAction(state, { type: "assign-worker", job: "scrivener", delta: 1 }, now);
    if (useLabor && state.buildings["scrivener-house"]) {
      if (!state.buildings.smithy && !buildingRequirements(state, "smithy").length) state = applyAction(state, { type: "build", building: "smithy" }, now);
      if (state.buildings.smithy && !state.jobs.laborer && availableWorkers(state) > 0) state = applyAction(state, { type: "assign-worker", job: "laborer", delta: 1 }, now);
      if (state.buildings.fields < 2 && !buildingRequirements(state, "fields").length) state = applyAction(state, { type: "build", building: "fields" }, now);
      if (!state.research.includes("stoneworking") && !researchRequirements(state, "stoneworking").length) {
        if (process.env.BS_CAPTURE_SAVES) writeFileSync("/tmp/buried-sun-stoneworking.json", encodeSave(state));
        state = applyAction(state, { type: "research", research: "stoneworking" }, now);
        milestones.stoneworking = second;
      }
    }
    if (state.research.includes("survey-foundations")) {
      if (state.jobs.lamplighter === 2) {
        state = applyAction(state, { type: "assign-worker", job: "lamplighter", delta: -1 }, now);
        state = applyAction(state, { type: "assign-worker", job: "scrivener", delta: 1 }, now);
      }
      if (state.buildings["market-stall"] < marketLevel && !buildingRequirements(state, "market-stall").length) {
        state = applyAction(state, { type: "build", building: "market-stall" }, now);
      }
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
    else if (state.research.includes("study-engine") && !state.research.includes("restore-conduit") && state.resources.relics < 2) destination = "old-cistern";
    if (destination && !expeditionRequirements(state, destination, 2).length) state = applyAction(state, { type: "start-expedition", destination, workers: 2 }, now);
    if (state.research.includes("restore-conduit")) {
      if (process.env.BS_CAPTURE_SAVES && marketLevel === 3 && !useLabor) writeFileSync("/tmp/buried-sun-repaired.json", encodeSave(state));
      state = applyAction(state, { type: "awaken-junction" }, now);
      if (process.env.BS_CAPTURE_SAVES && marketLevel === 3 && !useLabor) writeFileSync("/tmp/buried-sun-awakened.json", encodeSave(state));
      milestones.awakening = second; break;
    }
  }
  console.info(`Awakening harness (Market ${marketLevel}, labor ${useLabor}, seconds):`, milestones);
  expect(state.awakenedAt).not.toBeNull();
  expect(milestones.awakening).toBeLessThanOrEqual(3600);
  expect(state.completedExpeditions).toEqual(["old-cistern", "ruined-aqueduct", "chapel-foundations"]);
  expect(state.population).toBe(useLabor ? 10 : 8);
  if (useLabor) {
    expect(state.research).toContain("stoneworking");
    expect(state.chronicle).toContain("repair-household");
    expect(state.jobs.laborer).toBe(1);
  }
  expect(availableWorkers(state)).toBe(useLabor ? 3 : 2);
  expect(decodeSave(encodeSave(state))).toEqual(state);
  expect(reconcile(state, state.lastSimulatedAt + 1000).state.resources.current).toBeCloseTo(.02);
});
