"use client";

import { useEffect, useRef } from "react";
import { CHRONICLE } from "@/content/chronicle";
import { ILLUSTRATIONS } from "@/content/illustrations";
import type { GameAction, IllustrationId } from "@/game/types";
import { IllustratedRecord } from "./IllustratedRecord";

export function IllustrationReveal({ queue, active, dispatch }: {
  queue: IllustrationId[]; active: boolean;
  dispatch: (action: GameAction) => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const continueRef = useRef<HTMLButtonElement>(null);
  const id = queue[0];

  useEffect(() => {
    if (!active) return;
    const dialog = dialogRef.current;
    if (!dialog) return;
    const previousFocus = document.activeElement;
    dialog.showModal();
    continueRef.current?.focus({ preventScroll: true });
    return () => {
      dialog.close();
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected && previousFocus !== document.body) {
        previousFocus.focus({ preventScroll: true });
      } else document.getElementById("main")?.focus({ preventScroll: true });
    };
  }, [active]);

  // Changing records keeps one native modal open; it never stacks dialogs.
  useEffect(() => {
    if (active && id) {
      dialogRef.current?.scrollTo(0, 0);
      continueRef.current?.focus({ preventScroll: true });
    }
  }, [active, id]);

  return <dialog ref={dialogRef} className="illustration-reveal" aria-labelledby="reveal-heading" aria-describedby="reveal-caption"
    onCancel={event => {
      event.preventDefault();
      if (active && id) dispatch({ type: "dismiss-illustrations", ids: [id] });
    }}>
    {id && <>
      <header className="reveal-heading">
        <p className="machine-label">Chronicle / New record</p>
        <h2 id="reveal-heading" aria-live="polite">{CHRONICLE[ILLUSTRATIONS[id].chronicle].title}</h2>
      </header>
      <IllustratedRecord key={id} id={id} captionId="reveal-caption" eager />
      <div className="reveal-controls">
        <button ref={continueRef} className="machine-button" disabled={!active}
          onClick={() => dispatch({ type: "dismiss-illustrations", ids: [id] })}>Continue</button>
        {queue.length > 1 && <button className="machine-button archive-remainder" disabled={!active}
          onClick={() => dispatch({ type: "dismiss-illustrations", ids: [...queue] })}>Leave remaining in Chronicle</button>}
      </div>
    </>}
  </dialog>;
}
