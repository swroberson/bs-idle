import { RESEARCH } from "@/content/research";
import { useState } from "react";
import { AWAKENING } from "@/content/awakening";
import { awakeningRequirements } from "@/game/requirements";
import { CatalogPager } from "./CatalogPager";
import { costText, researchRequirements, prerequisiteRequirements } from "@/game/requirements";
import type { GameAction, GameState, ResearchId } from "@/game/types";

export function StudiesPanel({ state, active, dispatch }: { state: GameState; active: boolean; dispatch: (action: GameAction) => void }) {
  const [page, setPage] = useState(0);
  const items = (Object.keys(RESEARCH) as ResearchId[]).filter(id => state.research.includes(id) || prerequisiteRequirements(state, RESEARCH[id].requirements).length === 0);
  const index = Math.min(page, Math.max(0, items.length - 1));
  const awakeningReady = state.research.includes("restore-conduit") && state.awakenedAt === null;
  const unmetAwakening = awakeningRequirements(state);
  return <section aria-labelledby="studies-heading">
    <div className="region-heading"><h2 id="studies-heading" className="machine-label">Studies / Investigation register</h2><span className="machine-label">Authorized by the Keeper</span></div>
    {awakeningReady && <div className="operation-row junction-operation">
      <h3>{AWAKENING.name}</h3><p className="narrative">{AWAKENING.description}</p>
      <button className="machine-button" disabled={!active || unmetAwakening.length > 0} aria-describedby="awakening-requirements" onClick={() => dispatch({ type: "awaken-junction" })}>Awaken the Junction // No cost</button>
      <p id="awakening-requirements" className="requirements-copy">{unmetAwakening.join(" · ") || "Recorded tests complete / joint seated"}</p>
    </div>}
    {items.slice(index, index + 1).map((id) => {
      const research = RESEARCH[id];
      const complete = state.research.includes(id);
      const unmet = researchRequirements(state, id);
      return <article key={id} className="operation-row">
        <div className="operation-heading"><h3>{research.name}</h3><span className={`machine-label ${complete ? "activity-text" : ""}`}>{complete ? "Recorded" : "Available"}</span></div>
        <p className="narrative">{complete ? research.text : research.description}</p>
        {complete && <p className="effect-readout">{research.effect}</p>}
        {!complete && <>
          <button className="machine-button" aria-describedby={`study-${id}-requirements`} disabled={!active || unmet.length > 0} onClick={() => dispatch({ type: "research", research: id })}>Investigate // {costText(research.cost)}</button>
          <p id={`study-${id}-requirements`} className="requirements-copy">{unmet.join(" · ") || "Stores sufficient / ready"}</p>
        </>}
        {complete && <p className="requirements-copy">Investigation complete / discovery preserved in the Chronicle.</p>}
      </article>;
    })}
    <CatalogPager name="Studies" labels={items.map(id => RESEARCH[id].name)} index={index} select={setPage} />
  </section>;
}
