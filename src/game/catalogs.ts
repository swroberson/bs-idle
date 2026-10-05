import { BUILDINGS } from "../content/buildings";
import { RESEARCH } from "../content/research";
import { prerequisiteRequirements } from "./requirements";
import type { BuildingId, GameState, ResearchId } from "./types";

export function knownWorks(state: GameState): BuildingId[] {
  return (Object.keys(BUILDINGS) as BuildingId[]).filter(id => state.buildings[id] > 0 || prerequisiteRequirements(state, BUILDINGS[id].requirements).length === 0);
}

export function knownStudies(state: GameState): ResearchId[] {
  return (Object.keys(RESEARCH) as ResearchId[]).filter(id => state.research.includes(id) || prerequisiteRequirements(state, RESEARCH[id].requirements).length === 0);
}

export function availableWorks(state: GameState): BuildingId[] {
  return knownWorks(state).filter(id => state.buildings[id] < BUILDINGS[id].maxLevel);
}

export function availableStudies(state: GameState): ResearchId[] {
  return knownStudies(state).filter(id => !state.research.includes(id));
}
