import { LAMPS } from "@/content/lamps";
import { BALANCE } from "@/content/balance";
import { EXPEDITIONS } from "@/content/expeditions";
import { BUILDINGS } from "@/content/buildings";
import { RESEARCH } from "@/content/research";
import { RESOURCES } from "@/content/resources";
import type { ResourceId, ReturnSummary } from "@/game/types";
import { ResourceLabel } from "./ResourceAmounts";

function duration(ms: number) {
  const seconds = Math.floor(ms / 1000);
  return seconds >= 3600 ? `${Math.floor(seconds / 3600)}h ${Math.floor(seconds % 3600 / 60)}m` : seconds >= 60 ? `${Math.floor(seconds / 60)}m ${seconds % 60}s` : `${seconds}s`;
}

export function ReturnPanel({ summary, dismiss }: { summary: ReturnSummary; dismiss: () => void }) {
  return <section className="return-region" aria-labelledby="return-heading">
    <div className="operation-heading"><h2 id="return-heading" className="machine-label">{summary.elapsedMs >= BALANCE.returnSummaryAfterMs ? "While you were away" : "Party returned"}</h2><button className="record-link" onClick={dismiss}>Dismiss report</button></div>
    <p className="telemetry">Away // {duration(summary.elapsedMs)} · Production // {duration(summary.productionMs)}</p>
    {summary.elapsedMs > summary.productionMs && <p className="requirements-copy">Economy and lamp consequences capped at eight hours. Expedition timers continue beyond the cap.</p>}
    {(summary.lamps.extinguished > 0 || summary.lamps.relit > 0 || summary.lamps.after < LAMPS.count) && <p className="requirements-copy">Lamps // {summary.lamps.before} → {summary.lamps.after} lit; {summary.lamps.extinguished} went out, {summary.lamps.relit} relit automatically.</p>}
    {summary.lamps.darknessMs > 0 && <p className="requirements-copy">Incomplete lighting // {duration(summary.lamps.darknessMs)}. Stored Authority lost // {summary.lamps.authorityLost.toFixed(1)}; lifetime standing retained.</p>}
    {summary.fullStores.length > 0 && <p className="requirements-copy">Stores full // {summary.fullStores.map((id, index) => <span key={id}>{index > 0 && " / "}<ResourceLabel resource={id} /></span>)}. Further gains stop at capacity; other work continues.</p>}
    <dl className="return-changes">{(Object.keys(RESOURCES) as ResourceId[]).filter(id => summary.changes[id] !== 0).map((id) => <div key={id}><dt><ResourceLabel resource={id} /></dt><dd className="telemetry">{summary.changes[id] >= 0 ? "+" : ""}{summary.changes[id].toFixed(1)}</dd></div>)}</dl>
    {summary.completedExpeditions.map(id => <p key={id} className="requirements-copy">{EXPEDITIONS[id].name} {"//"} party returned; rewards included above. Workers are idle.</p>)}
    {summary.completedConstruction.map(project => <p key={project.id} className="requirements-copy">{project.kind === "building" ? BUILDINGS[project.id].name : RESEARCH[project.id].name} {"//"} work complete. Laborers remain assigned.</p>)}
    {summary.newEvents.length > 0 && <p className="requirements-copy">{summary.newEvents.length} new report awaiting your response. No choices were made while away.</p>}
  </section>;
}
