"use client";

import { useId, useState } from "react";
import { JOBS } from "@/content/jobs";
import { availableWorkers, jobUnlocked } from "@/game/requirements";
import { constructionSpeed } from "@/game/construction";
import type { GameAction, GameState, JobId } from "@/game/types";

export function WorkerPanel({ state, active, dispatch, initialGroup = "daily" }: { state: GameState; active: boolean; dispatch: (action: GameAction) => void; initialGroup?: "daily" | "field" | "study" }) {
  const [selected, setSelected] = useState<string>(initialGroup);
  const headingId = useId();
  const available = availableWorkers(state);
  const groups = [
    { id: "daily", label: "Daily work", roles: ["forager", "lamplighter"] },
    { id: "field", label: "Fieldwork", roles: ["laborer", "scavenger"] },
    { id: "study", label: "Scholarship", roles: ["scrivener"] },
  ].map(group => ({ ...group, roles: group.roles.filter(id => jobUnlocked(state, id as JobId)) as JobId[] }))
    .filter(group => group.roles.length > 0);
  const group = groups.find(group => group.id === selected) ?? groups[0];
  return <aside aria-labelledby={headingId} className="inhabitants-region">
    <div className="region-heading"><h2 id={headingId} className="machine-label">02 / Inhabitants</h2><span className="machine-label">Register</span></div>
    <div className="population-register">
      <div className="population-total"><span className="telemetry">{String(state.population).padStart(2, "0")}</span><span className="machine-label">Those who<br />remain</span></div>
      <div className="population-marks" aria-hidden="true">{Array.from({ length: state.population }, (_, index) => <span key={index} />)}</div>
      <dl className="worker-readout">
        <div><dt>Assigned</dt><dd>{Object.values(state.jobs).reduce((sum, count) => sum + count, 0)}</dd></div>
        {state.buildings["ruined-cistern"] > 0 && <div><dt>Away</dt><dd>{state.activeExpedition?.workers ?? 0}</dd></div>}
        <div><dt>Available</dt><dd>{available}</dd></div>
      </dl>
    </div>
    {groups.length > 1 && <div className="module-selector worker-selector" aria-label="Staffing views" style={{ gridTemplateColumns: `repeat(${groups.length}, minmax(0, 1fr))` }}>
      {groups.map(item => <button key={item.id} aria-pressed={group.id === item.id} onClick={() => setSelected(item.id)}>{item.label}</button>)}
    </div>}
    <div className="worker-allocations">
      {group.roles.map((id) => <div className="worker-allocation" key={id}>
        <div className="worker-role"><p>{JOBS[id].name}</p><p className="machine-label">{id === "forager" ? "Gardens" : id === "lamplighter" ? "Ward lamps" : id === "laborer" ? (state.activeConstruction ? "Construction crew" : "No active project") : id === "scavenger" ? "Expedition readiness" : "Scriptorium"}</p></div>
        <button className="worker-step" disabled={!active || state.jobs[id] === 0} aria-label={`Release one ${JOBS[id].name}`} onClick={() => dispatch({ type: "assign-worker", job: id, delta: -1 })}>−</button>
        <span className="worker-count" aria-label={`${state.jobs[id]} assigned ${JOBS[id].name}s`}>{String(state.jobs[id]).padStart(2, "0")}</span>
        <button className="worker-step" disabled={!active || available === 0} aria-label={`Assign one ${JOBS[id].name}`} onClick={() => dispatch({ type: "assign-worker", job: id, delta: 1 })}>+</button>
      </div>)}
    </div>
    {group.roles.includes("laborer") && <p className="allocation-note machine-label">{constructionSpeed(state)} work/s per Laborer. Food shortages halve work. With no crew, project progress is retained.</p>}
    {group.roles.includes("scavenger") && <p className="allocation-note machine-label">Archaeological parties draw from Scavengers. Return idle.</p>}
    <p className="allocation-note machine-label">All inhabitants consume Food.</p>
  </aside>;
}
