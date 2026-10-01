import { BALANCE } from "@/content/balance";
import type { GameState } from "@/game/types";

export function WardPanel({ state, wait, active, gather }: {
  state: GameState;
  wait: number;
  active: boolean;
  gather: () => void;
}) {
  const seconds = Math.ceil(wait / 1000);
  const ready = wait === 0;
  const progress = 1 - Math.min(wait / BALANCE.gatheringCooldownMs, 1);

  return <div className="ward-layout">
    <section aria-labelledby="ward-heading" className="ward-operations">
      <div className="region-heading"><span className="machine-label">01 / Keeper’s station</span><span className="machine-label">Outer Ward</span></div>
      <div className="obligation">
        <p className="machine-label">Standing obligation</p>
        <h2 id="ward-heading">Keep the lamps burning.</h2>
        <p className="narrative">Beyond the last inhabited street, the road climbs toward the Citadel. At dusk, its windows disappear. The lamps of the Ward must not.</p>
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
    <aside aria-labelledby="inhabitants-heading" className="inhabitants-region">
      <div className="region-heading"><h2 id="inhabitants-heading" className="machine-label">02 / Inhabitants</h2><span className="machine-label">Register</span></div>
      <div className="population-total"><span className="telemetry">{String(state.population).padStart(2, "0")}</span><span className="machine-label">Those who<br />remain</span></div>
      <div className="population-marks" aria-hidden="true">{Array.from({ length: state.population }, (_, index) => <span key={index} />)}</div>
      <dl className="worker-readout">
        <div><dt>Assigned</dt><dd>0</dd></div>
        <div><dt>Available</dt><dd>{state.population}</dd></div>
      </dl>
      <p className="narrative register-note">The register has room for more names.</p>
      <p className="machine-label module-note">Work assignments / not yet available</p>
    </aside>
  </div>;
}
