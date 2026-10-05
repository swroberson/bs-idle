import { BUILDINGS } from "@/content/buildings";
import { RESEARCH } from "@/content/research";
import { useState } from "react";
import { CatalogPager } from "./CatalogPager";
import { buildingCost, buildingRequirements, constructionDiscount, costText, prerequisiteRequirements, resourceVisible } from "@/game/requirements";
import { constructionSpeed, constructionWork } from "@/game/construction";
import { ConstructionPanel } from "./ConstructionPanel";
import type { BuildingDefinition, BuildingId, GameAction, GameState, ResourceId } from "@/game/types";

export function WorksPanel({ state, active, dispatch }: { state: GameState; active: boolean; dispatch: (action: GameAction) => void }) {
  const [page, setPage] = useState(0);
  const items = (Object.keys(BUILDINGS) as BuildingId[]).filter(id => state.buildings[id] > 0 || prerequisiteRequirements(state, BUILDINGS[id].requirements).length === 0);
  const index = Math.min(page, Math.max(0, items.length - 1));
  const discount = constructionDiscount(state);
  if (state.activeConstruction) {
    const project = state.activeConstruction;
    return <section aria-labelledby="works-heading">
      <div className="region-heading"><h2 id="works-heading" className="machine-label">Works / Civic machinery</h2><span className="machine-label">One project</span></div>
      <ConstructionPanel state={state} active={active} dispatch={dispatch} />
      <p className="narrative construction-description">{project.kind === "building" ? BUILDINGS[project.id].description : RESEARCH[project.id].description}</p>
      <p className="module-note machine-label">Construction and automatic production are halved during Food shortages.</p>
    </section>;
  }
  return <section aria-labelledby="works-heading">
    <div className="region-heading"><h2 id="works-heading" className="machine-label">Works / Civic machinery</h2><span className="machine-label">One project</span></div>
    <ConstructionPanel state={state} active={active} dispatch={dispatch} />
    {items.slice(index, index + 1).map((id) => {
      const building: BuildingDefinition = BUILDINGS[id];
      const unmet = buildingRequirements(state, id);
      const level = state.buildings[id];
      const effect = building.effect ?? (level > 0 ? building.completedEffect : undefined);
      const work = constructionWork(state, { kind: "building", id });
      const storage = Object.fromEntries(Object.entries(building.storagePerLevel ?? {}).filter(([resource]) => resourceVisible(state, resource as ResourceId)));
      return <article key={id} className="operation-row">
        <div className="operation-heading"><h3>{building.name}</h3><span className="telemetry">Level {String(level).padStart(2, "0")} / {building.maxLevel}</span></div>
        <p className="narrative">{building.description}</p>
        {effect && <p className="effect-readout">{effect}</p>}
        {Object.keys(storage).length > 0 && <p className="effect-readout">Each level // store capacity +{costText(storage)}</p>}
        <button className="machine-button" aria-describedby={`build-${id}-requirements`} disabled={!active || unmet.length > 0} onClick={() => dispatch({ type: "build", building: id })}>
          {level >= building.maxLevel ? "Construction limit reached" : `${level === 0 ? "Construct" : "Expand"} // ${costText(buildingCost(state, id))}`}
        </button>
        {level < building.maxLevel && <p className="telemetry construction-cost">{work} work / {Math.ceil(work / constructionSpeed(state))}s with 1 Laborer at full output.</p>}
        <p id={`build-${id}-requirements`} className="requirements-copy">{unmet.join(" · ") || "Stores and crew sufficient / ready"}</p>
      </article>;
    })}
    <CatalogPager name="Works" labels={items.map(id => BUILDINGS[id].name)} index={index} select={setPage} />
    {discount.study > 0 && <p className="requirements-copy">Stoneworking / building Coin −{Math.round(discount.study * 100)}%. Final Coin costs round up; other costs unchanged.</p>}
    <p className="module-note machine-label">Construction and automatic production are halved during Food shortages.</p>
  </section>;
}
