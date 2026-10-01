import { RESOURCES } from "@/content/resources";
import type { GameState, ResourceId } from "@/game/types";

const glyphs: Record<ResourceId, string> = {
  food: "M4 17V9l6-5 6 5v8M7 12h6M10 8v9M3 20h14",
  oil: "M6 4h8M8 4v4l-4 5v7h12v-7l-4-5V4M4 15h12",
  authority: "M4 4h12v12l-6 5-6-5zM7 9h6M7 12h6",
};

export function ResourceReadout({ state }: { state: GameState }) {
  return <section aria-label="Ward stores" className="resource-readout">
    {(Object.keys(RESOURCES) as ResourceId[]).map((id) => <div key={id} className="resource-cell">
      <p className="machine-label resource-label">
        <svg viewBox="0 0 20 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.2"><path d={glyphs[id]} /></svg>
        {RESOURCES[id].name}
      </p>
      <p className="resource-value" key={state.resources[id]}>{state.resources[id].toLocaleString("en-US")}</p>
      {/* The foundation build has no automated production or consumption. */}
      <p className="resource-rate"><span>NET</span> +0<span>/s</span></p>
    </div>)}
  </section>;
}
