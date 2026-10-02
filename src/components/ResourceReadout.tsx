import { RESOURCES } from "@/content/resources";
import type { GameState, ResourceId } from "@/game/types";
import { resourceVisible } from "@/game/requirements";
import { economyRates } from "@/game/simulation";

const glyphs: Record<ResourceId, string> = {
  food: "M4 17V9l6-5 6 5v8M7 12h6M10 8v9M3 20h14",
  oil: "M6 4h8M8 4v4l-4 5v7h12v-7l-4-5V4M4 15h12",
  coin: "M4 6h12v12H4zM7 9h6v6H7z",
  knowledge: "M4 4h12v16H4zM7 8h6M7 12h6M7 16h3",
  relics: "M10 3l6 7-3 10H7L4 10zM4 10h12M10 3v17",
  authority: "M4 4h12v12l-6 5-6-5zM7 9h6M7 12h6",
};

export function ResourceReadout({ state }: { state: GameState }) {
  const { net } = economyRates(state);
  return <section aria-label="Ward stores" className="resource-readout">
    {(Object.keys(RESOURCES) as ResourceId[]).filter(id => resourceVisible(state, id)).map((id) => <div key={id} className="resource-cell">
      <p className="machine-label resource-label">
        <svg viewBox="0 0 20 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.2"><path d={glyphs[id]} /></svg>
        {RESOURCES[id].name}
      </p>
      <p className="resource-value">{state.resources[id].toLocaleString("en-US", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}</p>
      <p className="resource-rate"><span>NET</span> {net[id] >= 0 ? "+" : ""}{net[id].toFixed(3)}<span>/s</span></p>
    </div>)}
  </section>;
}
