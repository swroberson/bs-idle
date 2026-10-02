"use client";

import { useState } from "react";
import { BALANCE } from "@/content/balance";
import { EXPEDITIONS } from "@/content/expeditions";
import { costText, expeditionCost, expeditionRequirements, prerequisiteRequirements } from "@/game/requirements";
import type { ExpeditionId, GameAction, GameState } from "@/game/types";

function duration(ms: number) {
  const seconds = Math.ceil(ms / 1000);
  return `${Math.floor(seconds / 60)}m ${String(seconds % 60).padStart(2, "0")}s`;
}

export function ExpeditionPanel({ state, active, dispatch }: { state: GameState; active: boolean; dispatch: (action: GameAction) => void }) {
  const [workers, setWorkers] = useState(2);
  const party = state.activeExpedition;
  return <section aria-labelledby="expeditions-heading">
    <div className="region-heading"><h2 id="expeditions-heading" className="machine-label">Expeditions / Outer approaches</h2><span className="telemetry">One party / 1–3 inhabitants</span></div>
    {party && <div className="operation-row expedition-active">
      <div className="operation-heading"><h3>{EXPEDITIONS[party.destination].name}</h3><span className="machine-label activity-text">Party away</span></div>
      <p className="effect-readout">{party.workers} inhabitants reserved // Return in {duration(Math.max(0, party.returnsAt - state.lastSimulatedAt))}</p>
      <progress className="expedition-progress" aria-label="Expedition progress" max={party.returnsAt - party.startedAt} value={Math.max(0, state.lastSimulatedAt - party.startedAt)} />
      <p className="requirements-copy">Automatic return, including while away. Returned workers remain idle. Rewards and findings appear in the return log.</p>
    </div>}
    <div className="expedition-allocation">
      <label htmlFor="expedition-workers" className="machine-label">Party size // available inhabitants only</label>
      <select id="expedition-workers" value={workers} disabled={!active || !!party} onChange={event => setWorkers(Number(event.target.value))}>
        {Array.from({ length: BALANCE.expeditionMaxWorkers }, (_, i) => <option key={i + 1} value={i + 1}>{i + 1} {i === 0 ? "inhabitant" : "inhabitants"}</option>)}
      </select>
    </div>
    {(Object.keys(EXPEDITIONS) as ExpeditionId[]).filter(id => prerequisiteRequirements(state, EXPEDITIONS[id].requirements).length === 0).map(id => {
      const destination = EXPEDITIONS[id];
      const unmet = expeditionRequirements(state, id, workers);
      const rewards = Object.fromEntries(Object.entries(destination.rewardsPerWorker).map(([resource, amount]) => [resource, amount * workers]));
      return <article key={id} className="operation-row">
        <div className="operation-heading"><h3>{destination.name}</h3><span className="machine-label">{state.completedExpeditions.includes(id) ? "Surveyed" : "Unvisited"}</span></div>
        <p className="narrative">{destination.description}</p>
        <p className="effect-readout">Duration // {duration(destination.durationMs)}<br />Guaranteed return // {costText(rewards)}<br />{state.completedExpeditions.includes(id) ? "Repeat route / ordinary rewards" : "First return / permanent Chronicle finding"}</p>
        <button className="machine-button" disabled={!active || unmet.length > 0} aria-describedby={`expedition-${id}-requirements`} onClick={() => dispatch({ type: "start-expedition", destination: id, workers })}>Dispatch // {costText(expeditionCost(id, workers))}</button>
        <p id={`expedition-${id}-requirements`} className="requirements-copy">{unmet.join(" · ") || `${workers} inhabitants ready / provisions sufficient`}</p>
      </article>;
    })}
    <div className="region-heading"><h2 className="machine-label">Return log</h2><span className="telemetry">Last {BALANCE.expeditionLogLimit} parties</span></div>
    {state.expeditionLog.length === 0 && <p className="module-note machine-label">No parties returned.</p>}
    {state.expeditionLog.slice().reverse().map((entry, index) => <div className="expedition-return" key={`${entry.startedAt}-${index}`}>
      <p className="machine-label">{EXPEDITIONS[entry.destination].name} {"//"} {entry.workers} returned</p>
      <p className="effect-readout">{costText(entry.rewards)}{entry.firstDiscovery ? " · New finding recorded" : ""}</p>
    </div>)}
  </section>;
}
