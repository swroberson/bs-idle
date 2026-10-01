import { BALANCE } from "@/content/balance";
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
  const seconds = Math.ceil(wait / 1000);
  const ready = wait === 0;
  const progress = 1 - Math.min(wait / BALANCE.gatheringCooldownMs, 1);
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
      <section aria-labelledby="provisions-heading" className="gathering-station">
        <div className="region-heading"><h3 id="provisions-heading" className="machine-label">Manual / Provisions</h3><span className={`machine-label ${active && ready ? "activity-text" : ""}`}>{!active ? "Unavailable" : ready ? "Ready" : "Recovering"}</span></div>
        <p className="narrative gathering-copy">There is still food growing among the abandoned gardens. Bring a little back for those who remain.</p>
        <button className="machine-button gather-control" disabled={!active || !ready} aria-describedby="gather-status" onClick={gather}>
          <span>Gather provisions</span><span className="control-yield">+{BALANCE.gatheringFood} Food <span aria-hidden="true">↗</span></span>
        </button>
        <div className="cooldown-track" aria-hidden="true"><div style={{ width: `${progress * 100}%` }} /></div>
        <div id="gather-status" className="action-readout">
          <p className="machine-label">{!active ? "Register unavailable" : ready ? "Awaiting input" : "Provisions stored"}</p>
          <p className="telemetry">{ready ? `${BALANCE.gatheringCooldownMs / 1000}s interval` : `${String(seconds).padStart(2, "0")}s / recovery`}</p>
        </div>
        <p className="sr-only" role="status">{!active ? "Gathering unavailable." : ready ? "Ready to gather provisions." : `${BALANCE.gatheringFood} Food stored. Gathering is recovering.`}</p>
      </section>
    </section>
    <WorkerPanel state={state} active={active} dispatch={dispatch} />
  </div>;
}
