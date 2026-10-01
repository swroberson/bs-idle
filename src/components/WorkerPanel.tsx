import { JOBS } from "@/content/jobs";
import { availableWorkers } from "@/game/requirements";
import type { GameAction, GameState, JobId } from "@/game/types";

export function WorkerPanel({ state, active, dispatch }: { state: GameState; active: boolean; dispatch: (action: GameAction) => void }) {
  const available = availableWorkers(state);
  return <aside aria-labelledby="inhabitants-heading" className="inhabitants-region">
    <div className="region-heading"><h2 id="inhabitants-heading" className="machine-label">02 / Inhabitants</h2><span className="machine-label">Register</span></div>
    <div className="population-total"><span className="telemetry">{String(state.population).padStart(2, "0")}</span><span className="machine-label">Those who<br />remain</span></div>
    <div className="population-marks" aria-hidden="true">{Array.from({ length: state.population }, (_, index) => <span key={index} />)}</div>
    <dl className="worker-readout">
      <div><dt>Assigned</dt><dd>{state.population - available}</dd></div>
      <div><dt>Available</dt><dd>{available}</dd></div>
    </dl>
    <p className="module-note machine-label">All inhabitants consume Food, including idle workers.</p>
    {(Object.keys(JOBS) as JobId[]).map((id) => <section className="job-row" key={id} aria-labelledby={`job-${id}`}>
      <h3 id={`job-${id}`}>{JOBS[id].name}</h3>
      <p>{JOBS[id].description}</p>
      <div className="assignment-control">
        <button className="machine-button" disabled={!active || state.jobs[id] === 0} aria-label={`Release one ${JOBS[id].name}`} onClick={() => dispatch({ type: "assign-worker", job: id, delta: -1 })}>−</button>
        <span className="telemetry" aria-label={`${state.jobs[id]} assigned ${JOBS[id].name}s`}>{String(state.jobs[id]).padStart(2, "0")}</span>
        <button className="machine-button" disabled={!active || available === 0} aria-label={`Assign one ${JOBS[id].name}`} onClick={() => dispatch({ type: "assign-worker", job: id, delta: 1 })}>+</button>
      </div>
    </section>)}
    <p className="module-note machine-label" role="status">{available === 0 ? "All inhabitants assigned / release a worker to reallocate" : `${available} available / assign with +`}</p>
  </aside>;
}
