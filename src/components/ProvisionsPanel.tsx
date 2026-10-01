import { BALANCE } from "@/content/balance";
import type { GameAction, GameState } from "@/game/types";

export function ProvisionsPanel({ state, wait, active, gather, dispatch }: {
  state: GameState; wait: number; active: boolean; gather: () => void; dispatch: (action: GameAction) => void;
}) {
  const seconds = Math.ceil(wait / 1000);
  const ready = wait === 0;
  const progress = 1 - Math.min(wait / BALANCE.gatheringCooldownMs, 1);
  return <section aria-labelledby="provisions-heading" className="gathering-station">
        <div className="region-heading"><h3 id="provisions-heading" className="machine-label">Manual / Provisions</h3><span className={`machine-label ${active && ready ? "activity-text" : ""}`}>{!active ? "Unavailable" : ready ? "Ready" : "Recovering"}</span></div>
        <p className="narrative gathering-copy">There is still food growing among the abandoned gardens. Bring a little back for those who remain.</p>
        <button className="machine-button gather-control" disabled={!active || !ready} aria-describedby="gather-status" onClick={gather}>
          <span>Gather provisions</span><span className="control-yield">+{BALANCE.gatheringFood} Food <span aria-hidden="true">↗</span></span>
        </button>
        <div className="cooldown-track" aria-hidden="true"><div style={{ width: `${progress * 100}%` }} /></div>
        <div id="gather-status" className="action-readout">
          <p className="machine-label">{!active ? "Register unavailable" : ready ? "Awaiting input" : "Manual work recorded"}</p>
          <p className="telemetry">{ready ? `${BALANCE.gatheringCooldownMs / 1000}s interval` : `${String(seconds).padStart(2, "0")}s / recovery`}</p>
        </div>
        <p className="sr-only" role="status">{!active ? "Gathering unavailable." : ready ? "Ready to gather provisions." : "Manual work is recovering."}</p>
        {state.resources.oil <= BALANCE.emergencyOil && <div className="fuel-recovery">
          <p className="machine-label">Emergency / Lamp fuel</p>
          <p className="requirements-copy">Render a little Oil from provisions. Shares the gathering recovery interval.</p>
          <button className="machine-button" disabled={!active || !ready || state.resources.food < BALANCE.emergencyOilFood} aria-describedby="fuel-requirement" onClick={() => dispatch({ type: "render-oil" })}>Render Oil // {BALANCE.emergencyOilFood} Food → {BALANCE.emergencyOil} Oil</button>
          <p className="requirements-copy" id="fuel-requirement">{!ready ? `${seconds}s recovery` : state.resources.food < BALANCE.emergencyOilFood ? `Food ${state.resources.food.toFixed(1)} / ${BALANCE.emergencyOilFood}` : "Stores sufficient / ready"}</p>
        </div>}
      </section>;
}
