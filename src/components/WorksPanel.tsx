import { BUILDINGS } from "@/content/buildings";
import { BALANCE } from "@/content/balance";
import { useState } from "react";
import { CatalogPager } from "./CatalogPager";
import { buildingCost, buildingRequirements, constructionDiscount, costText, jobUnlocked, prerequisiteRequirements } from "@/game/requirements";
import type { BuildingDefinition, BuildingId, GameAction, GameState } from "@/game/types";

export function WorksPanel({ state, active, dispatch }: { state: GameState; active: boolean; dispatch: (action: GameAction) => void }) {
  const [page, setPage] = useState(0);
  const items = (Object.keys(BUILDINGS) as BuildingId[]).filter(id => state.buildings[id] > 0 || prerequisiteRequirements(state, BUILDINGS[id].requirements).length === 0);
  const index = Math.min(page, Math.max(0, items.length - 1));
  const discount = constructionDiscount(state);
  return <section aria-labelledby="works-heading">
    <div className="region-heading"><h2 id="works-heading" className="machine-label">Works / Civic machinery</h2><span className="telemetry">Immediate construction</span></div>
    {items.slice(index, index + 1).map((id) => {
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
    <CatalogPager name="Works" labels={items.map(id => BUILDINGS[id].name)} index={index} select={setPage} />
    {jobUnlocked(state, "laborer") && <p className="requirements-copy">Building Coin / Laborers: {state.jobs.laborer} assigned, −{Number((discount.laborer * 100).toFixed(2))}% (cap {BALANCE.laborerDiscountCap * 100}%).{discount.study > 0 && ` Stoneworking: −${Math.round(discount.study * 100)}%; combined −${Number(((1 - discount.coinMultiplier) * 100).toFixed(2))}%.`} Final Coin costs round up. Other costs unchanged.</p>}
    <p className="module-note machine-label">Automatic production is halved during Food shortages.</p>
  </section>;
}
