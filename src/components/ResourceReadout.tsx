"use client";

import { useRef, useState } from "react";
import { RESOURCES } from "@/content/resources";
import type { GameState, ResourceId } from "@/game/types";
import { resourceVisible } from "@/game/requirements";
import { economyRates } from "@/game/simulation";
import { resourceCapacity } from "@/game/storage";
import { formatCompactNumber } from "./formatNumber";
import { ResourceLabel } from "./ResourceAmounts";

export function ResourceReadout({ state, onDialogChange }: { state: GameState; onDialogChange?: (open: boolean) => void }) {
  const { net } = economyRates(state);
  const amountDialog = useRef<HTMLDialogElement>(null);
  const [selected, setSelected] = useState<ResourceId | null>(null);

  return <><section aria-label="Ward stores" className="resource-readout">
    {(Object.keys(RESOURCES) as ResourceId[]).filter(id => resourceVisible(state, id)).map((id) => {
      const exact = state.resources[id].toLocaleString("en-US", { maximumFractionDigits: 20 });
      const capacity = resourceCapacity(state, id);
      const bounded = capacity < Number.MAX_SAFE_INTEGER;
      const capacityText = bounded ? ` / Capacity ${capacity}${state.resources[id] >= capacity ? ". Store full; further gains stop" : ""}` : "";
      return <button key={id} className={`resource-cell ${id === "current" ? "current-instrument" : ""}`} title={`${RESOURCES[id].name}: ${exact}${capacityText}`} aria-label={`${RESOURCES[id].name}: ${exact}${capacityText}. View exact amount.`} aria-describedby={`${id}-rate`} aria-haspopup="dialog" aria-controls="resource-details" onClick={() => {
        setSelected(id);
        amountDialog.current?.showModal();
        onDialogChange?.(true);
      }}>
      <span className="machine-label resource-label">
        <ResourceLabel resource={id} />
      </span>
      <span className="resource-value"><span key={state.resources[id]}>{formatCompactNumber(state.resources[id])}</span>{bounded && <small className="resource-capacity"> / {formatCompactNumber(capacity)}</small>}</span>
      <span id={`${id}-rate`} className="resource-rate" title="Net rate per second"><span className="sr-only">Net </span>{net[id] >= 0 ? "+" : ""}{net[id].toFixed(3)}<span>/s</span></span>
    </button>;
    })}
  </section>
  <dialog id="resource-details" ref={amountDialog} className="resource-details" aria-labelledby="resource-detail-heading" aria-describedby="resource-detail-amount" onClose={() => onDialogChange?.(false)}>
    <h2 id="resource-detail-heading" className="machine-label">{selected ? <ResourceLabel resource={selected} /> : "Stores"} / Exact amount</h2>
    <p id="resource-detail-amount" className="exact-amount">{selected !== null && state.resources[selected].toLocaleString("en-US", { maximumFractionDigits: 20 })}</p>
    {selected !== null && resourceCapacity(state, selected) < Number.MAX_SAFE_INTEGER && <>
      <p className="telemetry">Capacity // {resourceCapacity(state, selected)}</p>
      <p className="requirements-copy">{state.resources[selected] > resourceCapacity(state, selected) ? "Saved surplus retained / further gains stop until stores fall below capacity." : state.resources[selected] === resourceCapacity(state, selected) ? "Store full / further gains stop until supplies are used." : "Gains stop at capacity / consumption and other work continue."}</p>
      {selected === "authority" && <p className="requirements-copy">Lamps continue earning lifetime Authority when this store is full.</p>}
    </>}
    <button className="machine-button" onClick={() => amountDialog.current?.close()}>Close</button>
  </dialog></>;
}
