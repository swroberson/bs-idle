import { BUILDINGS } from "@/content/buildings";
import { RESEARCH } from "@/content/research";
import { availableWorkers } from "@/game/requirements";
import { constructionRate, constructionSpeed, constructionWork } from "@/game/construction";
import { economyRates } from "@/game/simulation";
import type { GameAction, GameState } from "@/game/types";

export function ConstructionPanel({ state, active, dispatch }: {
  state: GameState; active: boolean; dispatch: (action: GameAction) => void;
}) {
  const project = state.activeConstruction;
  const rate = constructionRate(state, economyRates(state).efficiency);
  const total = project ? constructionWork(state, project) : 0;
  const remaining = project && rate > 0 ? Math.ceil((total - project.workDone) / rate) : null;
  return <div className="construction-region">
    <div className="worker-allocation">
      <div className="worker-role"><p>Laborers</p><p className="machine-label">{project ? "Assigned crew" : "No active project"}</p></div>
      <button className="worker-step" disabled={!active || state.jobs.laborer === 0} aria-label="Release one Laborer" onClick={() => dispatch({ type: "assign-worker", job: "laborer", delta: -1 })}>−</button>
      <span className="worker-count" aria-label={`${state.jobs.laborer} assigned Laborers`}>{String(state.jobs.laborer).padStart(2, "0")}</span>
      <button className="worker-step" disabled={!active || availableWorkers(state) === 0} aria-label="Assign one Laborer" onClick={() => dispatch({ type: "assign-worker", job: "laborer", delta: 1 })}>+</button>
    </div>
    <p className="requirements-copy">{constructionSpeed(state)} work/s per Laborer · {availableWorkers(state)} inhabitants available.</p>
    {project && <div className="construction-readout">
      <div className="operation-heading"><h3>{project.kind === "building" ? BUILDINGS[project.id].name : RESEARCH[project.id].name}</h3><span className="machine-label" role="status">{rate > 0 ? "Work active" : "Paused / no crew"}</span></div>
      <progress value={project.workDone} max={total} aria-label="Construction progress" />
      <p className="telemetry">{Math.floor(project.workDone)} / {total} work · {rate > 0 ? `${rate} work/s · ${remaining}s remaining` : "Progress retained"}</p>
      <p className="requirements-copy">Supplies paid / completion automatic. Laborers remain assigned.</p>
      {economyRates(state).starving && <p className="requirements-copy warning-text">Food shortage / work halved.</p>}
    </div>}
  </div>;
}
