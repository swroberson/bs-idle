"use client";

import { useEffect, useRef } from "react";
import { AWAKENING } from "@/content/awakening";
import { economyRates } from "@/game/simulation";
import type { GameAction, GameState } from "@/game/types";
import { ResourceLabel } from "./ResourceAmounts";

export function AwakeningReveal({ state, active, dispatch }: {
  state: GameState; active: boolean; dispatch: (action: GameAction) => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const continueRef = useRef<HTMLButtonElement>(null);
  const passage = AWAKENING.passages[state.finaleStep];
  const final = state.finaleStep === AWAKENING.passages.length - 1;
  const rates = economyRates(state).net;
  const advance = () => dispatch({ type: "advance-awakening", step: state.finaleStep });

  useEffect(() => {
    if (!active) return;
    const dialog = dialogRef.current;
    if (!dialog) return;
    const previousFocus = document.activeElement;
    dialog.showModal();
    continueRef.current?.focus({ preventScroll: true });
    return () => {
      dialog.close();
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected && previousFocus !== document.body) previousFocus.focus({ preventScroll: true });
      else document.getElementById("main")?.focus({ preventScroll: true });
    };
  }, [active]);

  useEffect(() => {
    if (active) {
      dialogRef.current?.scrollTo(0, 0);
      continueRef.current?.focus({ preventScroll: true });
    }
  }, [active, state.finaleStep]);

  return <dialog ref={dialogRef} className="illustration-reveal awakening-reveal" aria-labelledby="awakening-heading" aria-describedby="awakening-passage" onCancel={event => {
    event.preventDefault(); if (active && passage) advance();
  }}>
    {passage && <>
      <header className="reveal-heading"><p className="machine-label">Junction / {state.finaleStep + 1} of {AWAKENING.passages.length}</p><h2 id="awakening-heading" aria-live="polite">{passage.title}</h2></header>
      <div id="awakening-passage" className="awakening-passage narrative">{passage.text.split("\n\n").map(paragraph => <p key={paragraph}>{paragraph}</p>)}</div>
      {final && <div className="awakening-facts telemetry">
        <p>Junction // Active</p><p><ResourceLabel resource="current" /> {"//"} +{rates.current.toFixed(3)}/s</p>
        <p>Restored lamps // 0 <ResourceLabel resource="oil" />/s</p><p><ResourceLabel resource="authority" /> {"//"} +{rates.authority.toFixed(3)}/s</p>
        <p>Outer Ward // Story complete</p>
      </div>}
      <div className="reveal-controls"><button ref={continueRef} className="machine-button" disabled={!active} onClick={advance}>{final ? "Return to Ward" : "Continue"}</button></div>
    </>}
  </dialog>;
}
