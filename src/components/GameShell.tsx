"use client";

import { useEffect, useState } from "react";
import { gatheringWaitMs } from "@/game/actions";
import { ResourceReadout } from "./ResourceReadout";
import { useLocalGame } from "./useLocalGame";
import { BALANCE } from "@/content/balance";
import { ReturnPanel } from "./ReturnPanel";
import type { GameAction } from "@/game/types";
import { GamePages, SECTIONS, type Section } from "./GamePages";
import { actionFeedback } from "./actionFeedback";

export function GameShell() {
  const game = useLocalGame();
  const [section, setSection] = useState<Section>("ward");
  const [now, setNow] = useState(0);
  const [offlineStatus, setOfflineStatus] = useState("");
  const [feedback, setFeedback] = useState("");

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
  const status = { loading: "Opening", waiting: "Read only", active: "Active", error: "Fault" }[game.status];
  const worksOpen = !!game.state && game.state.lifetimeAuthority >= BALANCE.worksAuthority;
  const studiesOpen = !!game.state?.chronicle.includes("lamp-complaint");
  const expeditionsOpen = !!game.state && game.state.buildings["ruined-cistern"] > 0;
  const visibleSections = (Object.keys(SECTIONS) as (Section)[]).filter((id) => (id !== "works" || worksOpen) && (id !== "studies" || studiesOpen) && (id !== "expeditions" || expeditionsOpen));
  const shownSection = visibleSections.includes(section) ? section : "ward";
  const dispatch = (action: GameAction) => {
    if (game.dispatch(action)) setFeedback(actionFeedback(action));
  };

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
        {visibleSections.map((id) => <button key={id} aria-current={shownSection === id ? "page" : undefined} aria-controls="main" onClick={() => setSection(id)}>{SECTIONS[id]}</button>)}
      </nav>
    </div>
    <main id="main" tabIndex={-1}>
      {game.returnSummary && <ReturnPanel summary={game.returnSummary} dismiss={game.dismissSummary} />}
      {feedback && <p role="status" className="action-feedback machine-label">{feedback}</p>}
      {game.error && <div role="alert" className="terminal-alert"><p className="machine-label">Record fault</p><p>{game.error}</p></div>}
      {game.status === "loading" && <p role="status" className="terminal-notice machine-label">Opening the Keeper’s register…</p>}
      {game.status === "waiting" && <div role="status" className="terminal-notice"><p className="machine-label">Access / held by another tab</p><h2>The register is open elsewhere.</h2><p>Close the other Buried Sun tab to continue here. This tab will then load your latest progress.</p></div>}
      <GamePages game={game} section={shownSection} wait={wait} dispatch={dispatch} setSection={setSection} clearFeedback={() => setFeedback("")} />
    </main>
    <footer className="terminal-footer">
      <div className="footer-readout machine-label"><span>Phase I / The Outer Ward</span><span>{game.status === "active" ? "Local record / autosaves every 15s" : "Local record / unavailable"}</span></div>
      <p>Production continues while away, up to eight hours. This build reaches the survey beneath the chapel.</p>
      {offlineStatus && <p className="machine-label">{offlineStatus}</p>}
    </footer>
  </div>;
}
