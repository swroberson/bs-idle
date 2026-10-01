import { RESOURCES } from "@/content/resources";
import type { ResourceId, ReturnSummary } from "@/game/types";

function duration(ms: number) {
  const seconds = Math.floor(ms / 1000);
  return seconds >= 3600 ? `${Math.floor(seconds / 3600)}h ${Math.floor(seconds % 3600 / 60)}m` : seconds >= 60 ? `${Math.floor(seconds / 60)}m ${seconds % 60}s` : `${seconds}s`;
}

export function ReturnPanel({ summary, dismiss }: { summary: ReturnSummary; dismiss: () => void }) {
  return <section className="return-region" aria-labelledby="return-heading">
    <div className="operation-heading"><h2 id="return-heading" className="machine-label">While you were away</h2><button className="record-link" onClick={dismiss}>Dismiss report</button></div>
    <p className="telemetry">Away // {duration(summary.elapsedMs)} · Production // {duration(summary.productionMs)}</p>
    {summary.elapsedMs > summary.productionMs && <p className="requirements-copy">Production capped at eight hours. The remaining time earns no resources.</p>}
    <dl className="return-changes">{(Object.keys(RESOURCES) as ResourceId[]).map((id) => <div key={id}><dt>{RESOURCES[id].name}</dt><dd className="telemetry">{summary.changes[id] >= 0 ? "+" : ""}{summary.changes[id].toFixed(1)}</dd></div>)}</dl>
    {summary.newEvents.length > 0 && <p className="requirements-copy">{summary.newEvents.length} new report awaiting your response. No choices were made while away.</p>}
  </section>;
}
