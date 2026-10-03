"use client";

import { useRef, useState } from "react";
import { RESOURCES } from "@/content/resources";
import type { GameState, ResourceId } from "@/game/types";
import { resourceVisible } from "@/game/requirements";
import { economyRates } from "@/game/simulation";
import { formatCompactNumber } from "./formatNumber";

const glyphs: Record<ResourceId, string> = {
  current: "M10 2v4M10 18v4M2 12h4M14 12h4M6 5l2 3M12 16l2 3M14 5l-2 3M8 16l-2 3M10 7l4 5-4 5-4-5z",
  food: "M4 17V9l6-5 6 5v8M7 12h6M10 8v9M3 20h14",
  oil: "M6 4h8M8 4v4l-4 5v7h12v-7l-4-5V4M4 15h12",
  coin: "M4 6h12v12H4zM7 9h6v6H7z",
  knowledge: "M4 4h12v16H4zM7 8h6M7 12h6M7 16h3",
  relics: "M10 3l6 7-3 10H7L4 10zM4 10h12M10 3v17",
  authority: "M4 4h12v12l-6 5-6-5zM7 9h6M7 12h6",
};

export function ResourceReadout({ state, onDialogChange }: { state: GameState; onDialogChange?: (open: boolean) => void }) {
  const { net } = economyRates(state);
  const amountDialog = useRef<HTMLDialogElement>(null);
  const [selected, setSelected] = useState<ResourceId | null>(null);

  return <><section aria-label="Ward stores" className="resource-readout">
    {(Object.keys(RESOURCES) as ResourceId[]).filter(id => resourceVisible(state, id)).map((id) => {
      const exact = state.resources[id].toLocaleString("en-US", { maximumFractionDigits: 20 });
      return <button key={id} className={`resource-cell ${id === "current" ? "current-instrument" : ""}`} title={`${RESOURCES[id].name}: ${exact}`} aria-label={`${RESOURCES[id].name}: ${exact}. View exact amount.`} aria-describedby={`${id}-rate`} aria-haspopup="dialog" aria-controls="resource-details" onClick={() => {
        setSelected(id);
        amountDialog.current?.showModal();
        onDialogChange?.(true);
      }}>
      <span className="machine-label resource-label">
        <svg viewBox="0 0 20 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.2"><path d={glyphs[id]} /></svg>
        {RESOURCES[id].name}
      </span>
      <span className="resource-value"><span key={state.resources[id]}>{formatCompactNumber(state.resources[id])}</span></span>
      <span id={`${id}-rate`} className="resource-rate" title="Net rate per second"><span className="sr-only">Net </span>{net[id] >= 0 ? "+" : ""}{net[id].toFixed(3)}<span>/s</span></span>
    </button>;
    })}
  </section>
  <dialog id="resource-details" ref={amountDialog} className="resource-details" aria-labelledby="resource-detail-heading" aria-describedby="resource-detail-amount" onClose={() => onDialogChange?.(false)}>
    <h2 id="resource-detail-heading" className="machine-label">{selected ? RESOURCES[selected].name : "Stores"} / Exact amount</h2>
    <p id="resource-detail-amount" className="exact-amount">{selected !== null && state.resources[selected].toLocaleString("en-US", { maximumFractionDigits: 20 })}</p>
    <button className="machine-button" onClick={() => amountDialog.current?.close()}>Close</button>
  </dialog></>;
}
