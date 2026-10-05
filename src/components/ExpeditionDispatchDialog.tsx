"use client";

import { useEffect, useRef, useState } from "react";
import { BALANCE } from "@/content/balance";
import { EXPEDITIONS } from "@/content/expeditions";
import { availableWorkers, expeditionCost, expeditionRequirements } from "@/game/requirements";
import { ResourceAmounts } from "./ResourceAmounts";
import type { ExpeditionId, GameAction, GameState } from "@/game/types";

export function ExpeditionDispatchDialog({ destination, state, active, dispatch, onClose, onDialogChange }: {
  destination: ExpeditionId; state: GameState; active: boolean; dispatch: (action: GameAction) => void;
  onClose: () => void; onDialogChange: (open: boolean) => void;
}) {
  const definition = EXPEDITIONS[destination];
  const available = definition.staffing === "scavenger" ? state.jobs.scavenger : availableWorkers(state);
  const staffing = definition.staffing === "scavenger" ? "assigned Scavengers" : "idle inhabitants";
  const [workers, setWorkers] = useState(() => Math.min(2, available));
  const dialogRef = useRef<HTMLDialogElement>(null);
  const unmet = expeditionRequirements(state, destination, workers);
  const seconds = Math.ceil(definition.durationMs / 1000);

  useEffect(() => {
    const dialog = dialogRef.current;
    dialog?.showModal();
    onDialogChange(true);
    return () => { dialog?.close(); onDialogChange(false); };
  }, [onDialogChange]);

  useEffect(() => {
    if (!active) dialogRef.current?.close();
  }, [active]);

  return <dialog ref={dialogRef} className="expedition-dispatch" aria-labelledby="dispatch-heading" aria-describedby="dispatch-availability" onClose={onClose}>
    <h2 id="dispatch-heading" className="machine-label">Dispatch / {definition.name}</h2>
    <p id="dispatch-availability" className="effect-readout">{available} {staffing} available</p>
    <fieldset>
      <legend className="machine-label">Party size / Inhabitants</legend>
      <div className="expedition-party-sizes">
        {Array.from({ length: BALANCE.expeditionMaxWorkers }, (_, i) => i + 1).map(size => <button
          key={size} className="machine-button" aria-pressed={workers === size} autoFocus={workers === size}
          disabled={!active || size > available} onClick={() => setWorkers(size)}
        >{size} {size === 1 ? "inhabitant" : "inhabitants"}</button>)}
      </div>
    </fieldset>
    <p className="effect-readout">Duration // {Math.floor(seconds / 60)}m {String(seconds % 60).padStart(2, "0")}s<br />{workers} {staffing} reserved until return</p>
    <div className="dispatch-controls">
      <button className="machine-button" onClick={() => dialogRef.current?.close()}>Cancel</button>
      <button className="machine-button" disabled={!active || unmet.length > 0} aria-describedby="dispatch-requirements" onClick={() => {
        if (!active || unmet.length > 0) return;
        dispatch({ type: "start-expedition", destination, workers });
        dialogRef.current?.close();
      }}><span>Dispatch //</span><ResourceAmounts amounts={expeditionCost(state, destination, workers)} /></button>
    </div>
    <p id="dispatch-requirements" className="requirements-copy" role="status">{unmet.join(" · ") || "Provisions sufficient"}</p>
  </dialog>;
}
