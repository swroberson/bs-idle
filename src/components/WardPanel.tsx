import { EventPanel } from "./EventPanel";
import { ProvisionsPanel } from "./ProvisionsPanel";
import type { GameAction, GameState } from "@/game/types";
import { WorkerPanel } from "./WorkerPanel";
import { economyRates } from "@/game/simulation";
import { jobUnlocked } from "@/game/requirements";

export function WardPanel({ state, wait, active, gather, dispatch }: {
  state: GameState; wait: number; active: boolean; gather: () => void; dispatch: (action: GameAction) => void;
}) {
  const rates = economyRates(state);
  return <div className={`ward-layout${jobUnlocked(state, "laborer") || state.buildings["scrivener-house"] > 0 ? " ward-with-labor" : ""}`}>
    <section aria-labelledby="ward-heading" className="ward-operations">
      <div className="region-heading"><h2 id="ward-heading" className="machine-label">01 / Keeper’s station</h2><span className="machine-label">Outer Ward</span></div>
      {state.pendingEvents.length > 0 ? <EventPanel state={state} active={active} dispatch={dispatch} /> : <div className="ward-scene">
        <div className="ward-inscription" aria-hidden="true"><span />I<span /></div>
        <p className="narrative">Beyond the last inhabited street, the road climbs toward the Citadel. At dusk, its windows disappear. The lamps of the Ward must not.</p>
        <p className="machine-label scene-caption">A register beneath the dark</p>
      </div>}
      {rates.starving && <p className="shortage-warning" role="status">Food exhausted // Other output halved</p>}

      <ProvisionsPanel state={state} wait={wait} active={active} gather={gather} dispatch={dispatch} />
    </section>
    <WorkerPanel state={state} active={active} dispatch={dispatch} />
  </div>;
}
