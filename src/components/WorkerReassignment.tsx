"use client";

import { useEffect, useRef, useState } from "react";
import type { GameAction, GameState } from "@/game/types";
import { WorkerPanel } from "./WorkerPanel";

export function WorkerReassignment({ state, active, dispatch, onDialogChange }: {
  state: GameState; active: boolean; dispatch: (action: GameAction) => void;
  onDialogChange: (open: boolean) => void;
}) {
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const dialog = dialogRef.current;
    const trigger = triggerRef.current;
    dialog?.showModal();
    onDialogChange(true);
    return () => {
      dialog?.close();
      onDialogChange(false);
      if (trigger?.isConnected) trigger.focus({ preventScroll: true });
    };
  }, [open, onDialogChange]);

  useEffect(() => {
    if (!active) dialogRef.current?.close();
  }, [active]);

  return <>
    <div className="crew-controls">
      <button ref={triggerRef} className="machine-button" disabled={!active} aria-haspopup="dialog" aria-controls="worker-reassignment" onClick={() => setOpen(true)}>Reassign workers</button>
    </div>
    <dialog ref={dialogRef} id="worker-reassignment" className="worker-reassignment" aria-label="Reassign workers" onClose={() => setOpen(false)}>
      <div className="region-heading"><span className="machine-label">Works / Crew register</span><button className="machine-button" autoFocus onClick={() => dialogRef.current?.close()}>Close</button></div>
      {open && <WorkerPanel state={state} active={active} dispatch={dispatch} initialGroup="field" />}
    </dialog>
  </>;
}
