"use client";

import { useEffect, useState } from "react";
import { CHRONICLE } from "@/content/chronicle";
import type { ChronicleId, GameAction, GameState } from "@/game/types";

export function ChroniclePanel({ state, active, dispatch }: {
  state: GameState;
  active: boolean;
  dispatch: (action: GameAction) => void;
}) {
  const [selected, setSelected] = useState<ChronicleId>(() =>
    state.chronicle[state.chronicle.length - 1],
  );
  const index = Math.max(0, state.chronicle.indexOf(selected));
  const id = state.chronicle[index];
  const unread = !state.readChronicle.includes(id);

  useEffect(() => {
    if (!active || !id || !unread) return;
    // Hidden tabs never acknowledge a record on the player's behalf.
    const acknowledge = () => {
      if (document.visibilityState === "visible") dispatch({ type: "read-chronicle", id });
    };
    acknowledge();
    document.addEventListener("visibilitychange", acknowledge);
    return () => document.removeEventListener("visibilitychange", acknowledge);
  }, [active, dispatch, id, unread]);

  return <section aria-labelledby="chronicle-heading" className="chronicle-region">
    <div className="region-heading"><h2 id="chronicle-heading" className="machine-label">Chronicle / Written record</h2><span className="telemetry">{String(index + 1).padStart(3, "0")} / {String(state.chronicle.length).padStart(3, "0")}</span></div>
    {id && <article key={id} className="chronicle-entry">
      <div className="archive-seal" aria-hidden="true"><svg viewBox="0 0 40 48" fill="none" stroke="currentColor" strokeWidth="1"><path d="M8 4h24v30L20 44 8 34zM14 13h12M14 19h12M14 25h8M20 30v8" /></svg></div>
      <p className="machine-label">Entry / {String(index + 1).padStart(3, "0")}</p>
      <h3>{CHRONICLE[id].title}</h3>
      <p className="narrative">{CHRONICLE[id].text}</p>
    </article>}
    <div className="archive-controls" aria-label="Chronicle entries">
      <button className="machine-button" disabled={index === 0} onClick={() => setSelected(state.chronicle[index - 1])}>← Previous</button>
      <span className="machine-label">Ward archive</span>
      <button className="machine-button" disabled={index === state.chronicle.length - 1} onClick={() => setSelected(state.chronicle[index + 1])}>Next →</button>
    </div>
  </section>;
}
