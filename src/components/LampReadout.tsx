"use client";

import { useRef } from "react";
import { LAMPS } from "@/content/lamps";
import { economyModifiers, economyRates } from "@/game/simulation";
import type { GameState } from "@/game/types";

export function LampReadout({ state, onDialogChange }: { state: GameState; onDialogChange: (open: boolean) => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const { lamps, authorityProduction } = economyRates(state);
  const restored = state.awakenedAt !== null;
  const dark = LAMPS.count - state.lamps.lit;
  const condition = lamps.transition === "out" ? (lamps.crewCapacity < state.lamps.lit ? "TENDING LIMITED" : "FUEL LIMITED")
    : lamps.transition === "relight" ? "RELIGHTING" : dark === LAMPS.count ? "UNLIT" : dark ? "PARTIAL LIGHTING" : restored ? "WITHOUT OIL" : "BURNING";
  const perLamp = restored ? 0 : LAMPS.oilPerLampSecond * economyModifiers(state).oilDemandMultiplier;
  return <>
    <button className={`lamp-strip${dark || lamps.transition === "out" ? " lamp-strip-warning" : ""}${restored ? " lamp-strip-restored" : ""}`} aria-haspopup="dialog" aria-controls="lamp-details" aria-label={`${restored ? "Restored" : "Ordinary"} lamps: ${state.lamps.lit} of ${LAMPS.count} lit. ${condition}. View lamp conditions.`} onClick={() => {
      dialog.current?.showModal(); onDialogChange(true);
    }}>
      <span className="machine-label">{restored ? "Restored" : "Ordinary"} lamps <strong>{state.lamps.lit} / {LAMPS.count} lit</strong></span>
      <span className="lamp-marks" aria-hidden="true">{Array.from({ length: LAMPS.count }, (_, index) => <svg key={index} className={index < state.lamps.lit ? "lamp-mark is-lit" : "lamp-mark"} viewBox="0 0 12 18" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M3 5h6v8H3zM4 2h4M6 2v3M2 15h8" />{index < state.lamps.lit && <path d="M6 7v4" />}</svg>)}</span>
      <span className="machine-label lamp-condition" role="status">{condition}</span>
    </button>
    <dialog id="lamp-details" ref={dialog} className="resource-details" aria-labelledby="lamp-detail-heading" onClose={() => onDialogChange(false)}>
      <h2 id="lamp-detail-heading" className="machine-label">{restored ? "Restored" : "Ordinary civic"} lamps / Conditions</h2>
      <dl className="lamp-details-readout telemetry">
        <div><dt>Lit</dt><dd>{state.lamps.lit} / {LAMPS.count}</dd></div>
        <div><dt>Tending capacity</dt><dd>{lamps.crewCapacity} / {LAMPS.count}</dd></div>
        <div><dt>Oil draw</dt><dd>{(lamps.oilDraw * 60).toFixed(3)} / min</dd></div>
        {!restored && <div><dt>Oil needed for lit lamps</dt><dd>{(lamps.oilDemand * 60).toFixed(3)} / min</dd></div>}
        <div><dt>Authority earned</dt><dd>{(authorityProduction * 60).toFixed(2)} / min</dd></div>
        <div><dt>Standing lost</dt><dd>{(lamps.authorityLoss * 60).toFixed(2)} / min</dd></div>
      </dl>
      {lamps.transition && <p className="requirements-copy">Next lamp {lamps.transition === "out" ? "out" : "relit"} {"//"} {Math.ceil(lamps.secondsUntilChange)}s</p>}
      <p className="requirements-copy">Each Lamplighter tends up to {LAMPS.perLamplighter} lamps. Authority depends on tended lighting; extra crew does not increase output beyond full coverage. Food shortages halve Authority output.</p>
      {restored ? <p className="requirements-copy">These fixtures burn without Oil and remain lit without a tending crew. Lamplighters still earn Authority by tending them.</p> : <>
        <p className="requirements-copy">Each burning lamp needs {(perLamp * 60).toFixed(4)} Oil/min, independently of its crew. With insufficient fuel or tending, one lamp goes out every {LAMPS.outageSeconds}s. Available fuel flow continues serving the lamps.</p>
        <p className="requirements-copy">Lamps relight automatically, one every {LAMPS.relightSeconds}s, when tending and fuel are available. Relighting begins with {LAMPS.relightReserveOil} Oil in reserve, or enough continuous production for the additional lamp; fuel continues burning during the work.</p>
        <p className="requirements-copy">After {LAMPS.darknessGraceSeconds / 60} minutes of incomplete lighting, each unlit lamp costs {(LAMPS.authorityLossPerDarkLampSecond * 60).toFixed(2)} stored Authority/min. Full lighting clears this delay. Authority never falls below zero; lifetime standing and discoveries are retained. New households require all {LAMPS.count} lamps lit.</p>
      </>}
      <p className="requirements-copy">This count covers the {LAMPS.count} ordinary civic lamps under the Keeper’s care. It does not count every lamp in the Ward.{state.chronicle.includes("lamp-complaint") ? " The third lamp is recorded separately; no Oil draw is assigned to it." : ""}</p>
      <button className="machine-button" onClick={() => dialog.current?.close()}>Close</button>
    </dialog>
  </>;
}
