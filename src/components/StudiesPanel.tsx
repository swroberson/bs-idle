import { RESEARCH } from "@/content/research";
import { costText, researchRequirements } from "@/game/requirements";
import type { GameAction, GameState, ResearchId } from "@/game/types";

export function StudiesPanel({ state, active, dispatch }: { state: GameState; active: boolean; dispatch: (action: GameAction) => void }) {
  return <section aria-labelledby="studies-heading">
    <div className="region-heading"><h2 id="studies-heading" className="machine-label">Studies / Lamp examination</h2><span className="machine-label">Authorized by the Keeper</span></div>
    {(Object.keys(RESEARCH) as ResearchId[]).map((id) => {
      const research = RESEARCH[id];
      const complete = state.research.includes(id);
      const unmet = researchRequirements(state, id);
      return <article key={id} className="operation-row">
        <div className="operation-heading"><h3>{research.name}</h3><span className={`machine-label ${complete ? "activity-text" : ""}`}>{complete ? "Recorded" : "Unexamined"}</span></div>
        <p className="narrative">{complete ? research.text : "Inspect the third lamp and record the shape of its casing. Orso will bring it no closer to the others."}</p>
        <p className="effect-readout">{research.effect}</p>
        {!complete && <>
          <button className="machine-button" aria-describedby={`study-${id}-requirements`} disabled={!active || unmet.length > 0} onClick={() => dispatch({ type: "research", research: id })}>Examine // {costText(research.cost)}</button>
          <p id={`study-${id}-requirements`} className="requirements-copy">{unmet.join(" · ") || "Stores sufficient / ready"}</p>
        </>}
        {complete && <p className="requirements-copy">Opening sequence complete / discovery preserved in the Chronicle.</p>}
      </article>;
    })}
  </section>;
}
