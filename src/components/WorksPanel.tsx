import { BUILDINGS } from "@/content/buildings";
import { buildingCost, buildingRequirements, costText, prerequisiteRequirements } from "@/game/requirements";
import type { BuildingDefinition, BuildingId, GameAction, GameState } from "@/game/types";

export function WorksPanel({ state, active, dispatch }: { state: GameState; active: boolean; dispatch: (action: GameAction) => void }) {
  return <section aria-labelledby="works-heading">
    <div className="region-heading"><h2 id="works-heading" className="machine-label">Works / Civic machinery</h2><span className="telemetry">Immediate construction</span></div>
    {(Object.keys(BUILDINGS) as BuildingId[]).filter((id) => state.buildings[id] > 0 || prerequisiteRequirements(state, BUILDINGS[id].requirements).length === 0).map((id) => {
      const building: BuildingDefinition = BUILDINGS[id];
      const unmet = buildingRequirements(state, id);
      const level = state.buildings[id];
      const effect = building.effect ?? (level > 0 ? building.completedEffect : undefined);
      return <article key={id} className="operation-row">
        <div className="operation-heading"><h3>{building.name}</h3><span className="telemetry">Level {String(level).padStart(2, "0")} / {building.maxLevel}</span></div>
        <p className="narrative">{building.description}</p>
        {effect && <p className="effect-readout">{effect}</p>}
        <button className="machine-button" aria-describedby={`build-${id}-requirements`} disabled={!active || unmet.length > 0} onClick={() => dispatch({ type: "build", building: id })}>
          {level >= building.maxLevel ? "Construction limit reached" : `${level === 0 ? "Construct" : "Expand"} // ${costText(buildingCost(state, id))}`}
        </button>
        <p id={`build-${id}-requirements`} className="requirements-copy">{unmet.join(" · ") || "Stores sufficient / ready"}</p>
      </article>;
    })}
    <p className="module-note machine-label">Automatic production is halved during Food shortages.</p>
  </section>;
}
