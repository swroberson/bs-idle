"use client";

import { useEffect, useState } from "react";
import { CHRONICLE } from "@/content/chronicle";
import { gatheringWaitMs } from "@/game/actions";
import { ResourceReadout } from "./ResourceReadout";
import { SavePanel } from "./SavePanel";
import { WardPanel } from "./WardPanel";
import { useLocalGame } from "./useLocalGame";

const sections = { ward: "Ward", chronicle: "Chronicle", settings: "Save & settings" } as const;

export function GameShell() {
  const game = useLocalGame();
  const [section, setSection] = useState<keyof typeof sections>("ward");
  const [now, setNow] = useState(0);
  const [offlineStatus, setOfflineStatus] = useState("");

  useEffect(() => {
    const clockFrame = window.requestAnimationFrame(() => setNow(Date.now()));
    const interval = window.setInterval(() => setNow(Date.now()), 250);
    if (process.env.NODE_ENV === "production" && "serviceWorker" in navigator) {
      void navigator.serviceWorker.register("/sw.js").then(() => navigator.serviceWorker.ready).then(() => {
        setOfflineStatus("Offline shell / ready");
      }).catch(() => { setOfflineStatus("Offline shell / unavailable. Revisit while online."); });
    }
    return () => { window.cancelAnimationFrame(clockFrame); window.clearInterval(interval); };
  }, []);

  const wait = game.state ? gatheringWaitMs(game.state, Math.max(now, game.state.lastGatheredAt ?? 0)) : 0;
  const recovery = game.status === "error" && !game.state;
  const status = { loading: "Opening", waiting: "Read only", active: "Active", error: "Fault" }[game.status];

  return <div className="terminal-shell">
    <a href="#main" className="skip-link">Skip to content</a>
    <header className="terminal-header">
      <div className="terminal-identity">
        <svg viewBox="0 0 32 40" aria-hidden="true" className="ward-glyph" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M4 4h24v24L16 36 4 28zM10 12h12M10 18h12M16 8v20M10 26h12" /></svg>
        <div><p className="machine-label">Outer Ward / Keeper’s terminal</p><h1>Buried Sun</h1></div>
      </div>
      <p className="connection-status machine-label"><span className={`status-light ${game.status === "active" ? "is-active" : ""}`} aria-hidden="true" />Register <span>{"//"} {status}</span></p>
    </header>
    <div className="terminal-instruments">
      {game.state && <ResourceReadout state={game.state} />}
      <nav aria-label="Keeper’s records" className="terminal-nav">
        {(Object.keys(sections) as (keyof typeof sections)[]).map((id, index) => <button key={id} aria-current={section === id ? "page" : undefined} aria-controls="main" onClick={() => setSection(id)}><span aria-hidden="true" className="nav-index">0{index + 1}</span>{sections[id]}</button>)}
      </nav>
    </div>
    <main id="main" tabIndex={-1}>
      {game.error && <div role="alert" className="terminal-alert"><p className="machine-label">Record fault</p><p>{game.error}</p></div>}
      {game.status === "loading" && <p role="status" className="terminal-notice machine-label">Opening the Keeper’s register…</p>}
      {game.status === "waiting" && <div role="status" className="terminal-notice"><p className="machine-label">Access / held by another tab</p><h2>The register is open elsewhere.</h2><p>Close the other Buried Sun tab to continue here. This tab will then load your latest progress.</p></div>}
      {(section === "settings" || recovery) && game.status !== "loading" && <SavePanel state={game.state} damagedSave={game.damagedSave} disabled={game.status === "waiting"} importSave={game.importSave} reset={game.reset} />}
      {game.state && !recovery && section === "ward" && <>
        <WardPanel state={game.state} wait={wait} active={game.status === "active"} gather={() => game.dispatch({ type: "gather-food" })} dispatch={game.dispatch} />
        {game.state.chronicle.length > 0 && <div className="record-strip"><span className="machine-label">Last entry</span><p>{CHRONICLE[game.state.chronicle[game.state.chronicle.length - 1]].title}</p><button className="record-link" onClick={() => setSection("chronicle")}>Read record <span aria-hidden="true">↗</span></button></div>}
      </>}
      {game.state && section === "chronicle" && <section aria-labelledby="chronicle-heading" className="chronicle-region">
        <div className="region-heading"><span className="machine-label">Archive / Written record</span><span className="telemetry">{String(game.state.chronicle.length).padStart(2, "0")} {game.state.chronicle.length === 1 ? "entry" : "entries"}</span></div>
        <h2 id="chronicle-heading" className="section-title">The Ward’s chronicle</h2>
        {game.state.chronicle.map((id, index) => <article key={id} className="chronicle-entry">
          <p className="machine-label">Entry / {String(index + 1).padStart(3, "0")}</p>
          <div><h3>{CHRONICLE[id].title}</h3><p className="narrative">{CHRONICLE[id].text}</p></div>
        </article>)}
      </section>}
    </main>
    <footer className="terminal-footer">
      <div className="footer-readout machine-label"><span>Phase I / Foundation build</span><span>{game.status === "active" ? "Local record / saved in this browser" : "Local record / unavailable"}</span></div>
      <p>Economy and story progression are still to come. Stores do not yet change while you are away.</p>
      {offlineStatus && <p className="machine-label">{offlineStatus}</p>}
    </footer>
  </div>;
}
