import { BALANCE } from "../content/balance";
import { BUILDINGS } from "../content/buildings";
import { JOBS } from "../content/jobs";
import { RESEARCH } from "../content/research";
import type { BuildingDefinition, ConstructionProject, GameState, ResearchDefinition } from "./types";

export function constructionWork(state: GameState, project: ConstructionProject): number {
  return project.kind === "building"
    ? Math.ceil(BUILDINGS[project.id].workSeconds * BALANCE.constructionWorkGrowth ** state.buildings[project.id])
    : RESEARCH[project.id].workSeconds;
}

export function constructionSpeed(state: GameState): number {
  return state.research.reduce<number>((speed, id) => {
    const study: ResearchDefinition = RESEARCH[id];
    return speed * (study.modifiers?.constructionSpeedMultiplier ?? 1);
  }, JOBS.laborer.workPerSecond);
}

// The simulation passes economy efficiency so construction follows the same shortage rules.
export function constructionRate(state: GameState, efficiency: number): number {
  return state.activeConstruction ? state.jobs.laborer * constructionSpeed(state) * efficiency : 0;
}

export function completeConstruction(state: GameState): GameState {
  const project = state.activeConstruction;
  if (!project || project.workDone < constructionWork(state, project)) return state;
  if (project.kind === "research") {
    return { ...state, activeConstruction: null, research: [...state.research, project.id],
      chronicle: [...state.chronicle, RESEARCH[project.id].chronicle] };
  }
  const building: BuildingDefinition = BUILDINGS[project.id];
  const record = building.chronicle ?? (project.id === "oil-press" ? "oil-press-built" : undefined);
  return { ...state, activeConstruction: null,
    buildings: { ...state.buildings, [project.id]: state.buildings[project.id] + 1 },
    chronicle: record && state.buildings[project.id] === 0 ? [...state.chronicle, record] : state.chronicle };
}
