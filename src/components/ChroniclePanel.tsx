import { CHRONICLE } from "@/content/chronicle";
import type { GameState } from "@/game/types";

export function ChroniclePanel({ state }: { state: GameState }) {
  return <section aria-labelledby="chronicle-heading" className="chronicle-region">
    <div className="region-heading"><span className="machine-label">Archive / Written record</span><span className="telemetry">{String(state.chronicle.length).padStart(2, "0")} {state.chronicle.length === 1 ? "entry" : "entries"}</span></div>
    <h2 id="chronicle-heading" className="section-title">The Ward’s chronicle</h2>
    {state.chronicle.map((id, index) => <article key={id} className="chronicle-entry">
      <p className="machine-label">Entry / {String(index + 1).padStart(3, "0")}</p>
      <div><h3>{CHRONICLE[id].title}</h3><p className="narrative">{CHRONICLE[id].text}</p></div>
    </article>)}
  </section>;
}
