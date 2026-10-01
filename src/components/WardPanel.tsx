import { ProvisionsPanel } from "./ProvisionsPanel";
import type { GameAction, GameState } from "@/game/types";
import { WorkerPanel } from "./WorkerPanel";
import { currentObjective } from "@/game/objective";
import { economyRates } from "@/game/simulation";

export function WardPanel({ state, wait, active, gather, dispatch }: {
  state: GameState;
  wait: number;
  active: boolean;
  gather: () => void;
  dispatch: (action: GameAction) => void;
}) {
  const objective = currentObjective(state);
  const rates = economyRates(state);

  return <div className="ward-layout">
    <section aria-labelledby="ward-heading" className="ward-operations">
      <div className="region-heading"><span className="machine-label">01 / Keeper’s station</span><span className="machine-label">Outer Ward</span></div>
      <div className="obligation">
        <p className="machine-label">Next obligation</p>
        <h2 id="ward-heading">{objective.title}</h2>
        <p className="objective-copy">{objective.text}</p>
        <p className="narrative">Beyond the last inhabited street, the road climbs toward the Citadel. At dusk, its windows disappear. The lamps of the Ward must not.</p>
        {rates.starving && <p className="shortage-warning" role="status">Food exhausted / other output halved. Assign Foragers or gather provisions.</p>}
        {rates.lampsLimited && <p className="shortage-warning" role="status">Oil supply limited / lamps use only the available flow. Reduce Lamplighters or expand the Oil Press.</p>}
      </div>
      <ProvisionsPanel state={state} wait={wait} active={active} gather={gather} dispatch={dispatch} />
    </section>
    <WorkerPanel state={state} active={active} dispatch={dispatch} />
  </div>;
}
