import { RESEARCH } from "@/content/research";
import { costText, researchRequirements, prerequisiteRequirements } from "@/game/requirements";
import type { GameAction, GameState, ResearchId } from "@/game/types";

export function StudiesPanel({ state, active, dispatch }: { state: GameState; active: boolean; dispatch: (action: GameAction) => void }) {
  return <section aria-labelledby="studies-heading">
    <div className="region-heading"><h2 id="studies-heading" className="machine-label">Studies / Investigation register</h2><span className="machine-label">Authorized by the Keeper</span></div>
    {(Object.keys(RESEARCH) as ResearchId[]).filter(id => state.research.includes(id) || prerequisiteRequirements(state, RESEARCH[id].requirements).length === 0).map((id) => {
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
  </section>;
}
