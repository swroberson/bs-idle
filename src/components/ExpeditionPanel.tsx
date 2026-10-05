"use client";

import { useState } from "react";
import { BALANCE } from "@/content/balance";
import { EXPEDITIONS } from "@/content/expeditions";
import { costText, expeditionCost, expeditionRequirements, prerequisiteRequirements } from "@/game/requirements";
import type { ExpeditionId, GameAction, GameState } from "@/game/types";
import { CatalogPager } from "./CatalogPager";
import { ExpeditionDispatchDialog } from "./ExpeditionDispatchDialog";

function duration(ms: number) {
  const seconds = Math.ceil(ms / 1000);
  return `${Math.floor(seconds / 60)}m ${String(seconds % 60).padStart(2, "0")}s`;
}

export function ExpeditionPanel({ state, active, dispatch, onDialogChange }: { state: GameState; active: boolean; dispatch: (action: GameAction) => void; onDialogChange: (open: boolean) => void }) {
  const [destinationToDispatch, setDestinationToDispatch] = useState<ExpeditionId | null>(null);
  const [page, setPage] = useState(0);
  const [view, setView] = useState<"destinations" | "returns">("destinations");
  const items = (Object.keys(EXPEDITIONS) as ExpeditionId[]).filter(id => prerequisiteRequirements(state, EXPEDITIONS[id].requirements).length === 0);
  const entries = state.expeditionLog.slice().reverse();
  const count = view === "destinations" ? items.length : entries.length;
  const index = Math.min(page, Math.max(0, count - 1));
  const party = state.activeExpedition;
  return <section aria-labelledby="expeditions-heading">
    <div className="region-heading"><h2 id="expeditions-heading" className="machine-label">Expeditions / Outer approaches</h2><span className="telemetry">One party / 1–3 inhabitants</span></div>
    <div className="module-selector expedition-selector">
      {(["destinations", "returns"] as const).map(mode => <button key={mode} aria-pressed={view === mode} onClick={() => { setView(mode); setPage(0); }}>{mode === "returns" ? "Return log" : "Destinations"}</button>)}
    </div>
    {party && <div className="operation-row expedition-active">
      <div className="operation-heading"><h3>{EXPEDITIONS[party.destination].name}</h3><span className="machine-label activity-text">Party away</span></div>
      <p className="effect-readout">{party.workers} inhabitants reserved // Return in {duration(Math.max(0, party.returnsAt - state.lastSimulatedAt))}</p>
      <progress className="expedition-progress" aria-label="Expedition progress" max={party.returnsAt - party.startedAt} value={Math.max(0, state.lastSimulatedAt - party.startedAt)} />
      <p className="requirements-copy">Automatic return, including while away. Returned workers remain idle. Rewards and findings appear in the return log.</p>
    </div>}
    {view === "destinations" && <>
    {items.slice(index, index + 1).map(id => {
      const destination = EXPEDITIONS[id];
      const unmet = expeditionRequirements(state, id, 1);
      const staffing = destination.staffing === "scavenger" ? "assigned Scavengers" : "idle inhabitants";
      return <article key={id} className="operation-row">
        <div className="operation-heading"><h3>{destination.name}</h3><span className="machine-label">{state.completedExpeditions.includes(id) ? "Surveyed" : "Unvisited"}</span></div>
        <p className="narrative">{destination.description}</p>
        <p className="effect-readout">Duration // {duration(destination.durationMs)}<br />1–3 {staffing} reserved until return<br />Provisions for 1 inhabitant // {costText(expeditionCost(state, id, 1))}</p>
        <button className="machine-button" disabled={!active || unmet.length > 0} aria-haspopup="dialog" aria-describedby={`expedition-${id}-requirements`} onClick={() => setDestinationToDispatch(id)}>Dispatch expedition</button>
        <p id={`expedition-${id}-requirements`} className="requirements-copy">{unmet.join(" · ") || "Party available / provisions sufficient"}</p>
      </article>;
    })}
    <CatalogPager name="Destinations" labels={items.map(id => EXPEDITIONS[id].name)} index={index} select={setPage} /></>}
    {view === "returns" && <>
    <div className="region-heading"><h2 className="machine-label">Return log</h2><span className="telemetry">Last {BALANCE.expeditionLogLimit} parties</span></div>
    {state.expeditionLog.length === 0 && <p className="module-note machine-label">No parties returned.</p>}
    {entries.slice(index, index + 1).map(entry => <div className="expedition-return" key={entry.startedAt}>
      <p className="machine-label">{EXPEDITIONS[entry.destination].name} {"//"} {entry.workers} returned</p>
      <p className="effect-readout">{costText(entry.rewards)}{entry.firstDiscovery ? " · New finding recorded" : ""}</p>
    </div>)}
    <CatalogPager name="Returns" labels={entries.map((entry, i) => `${entries.length - i} / ${EXPEDITIONS[entry.destination].name}`)} index={index} select={setPage} />
    </>}
    {destinationToDispatch && <ExpeditionDispatchDialog destination={destinationToDispatch} state={state} active={active} dispatch={dispatch} onClose={() => setDestinationToDispatch(null)} onDialogChange={onDialogChange} />}
  </section>;
}
