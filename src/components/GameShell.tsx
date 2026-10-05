"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { gatheringWaitMs } from "@/game/actions";
import { ResourceReadout } from "./ResourceReadout";
import { useLocalGame } from "./useLocalGame";
import { BALANCE } from "@/content/balance";
import { ReturnPanel } from "./ReturnPanel";
import type { BuildingId, GameAction, ResearchId } from "@/game/types";
import { GamePages, SECTIONS, type Section } from "./GamePages";
import { actionFeedback } from "./actionFeedback";
import { AttentionBadge } from "./AttentionBadge";
import { pendingIllustrations } from "@/game/illustrations";
import { IllustrationReveal } from "./IllustrationReveal";
import { AwakeningReveal } from "./AwakeningReveal";
import { AWAKENING } from "@/content/awakening";
import { availableStudies, availableWorks } from "@/game/catalogs";
import { WorkerReassignment } from "./WorkerReassignment";

function subscribeVisibility(onChange: () => void) {
  document.addEventListener("visibilitychange", onChange);
  return () => document.removeEventListener("visibilitychange", onChange);
}
const pageVisible = () => document.visibilityState === "visible";
const serverVisible = () => false;

export function GameShell() {
  const game = useLocalGame();
  const [section, setSection] = useState<Section>("ward");
  const [selectedWork, selectWork] = useState<BuildingId | null>(null);
  const [selectedStudy, selectStudy] = useState<ResearchId | null>(null);
  const [now, setNow] = useState(0);
  const [offlineStatus, setOfflineStatus] = useState<"pending" | "ready" | "failed">("pending");
  const [feedback, setFeedback] = useState("");
  const [detailsOpen, setDetailsOpen] = useState(false);
  const visible = useSyncExternalStore(subscribeVisibility, pageVisible, serverVisible);
  const reveals = game.state ? pendingIllustrations(game.state) : [];
  const endingPending = !!game.state && game.state.awakenedAt !== null && game.state.finaleStep < AWAKENING.passages.length;
  const canReveal = visible && game.status === "active" && !game.error && !game.returnSummary && !detailsOpen;
  const endingActive = endingPending && canReveal;
  const revealActive = !endingPending && canReveal && reveals.length > 0;

  useEffect(() => {
    const clockFrame = window.requestAnimationFrame(() => setNow(Date.now()));
    const interval = window.setInterval(() => setNow(Date.now()), 250);
    if (process.env.NODE_ENV === "production" && "serviceWorker" in navigator) {
      void navigator.serviceWorker.register("/sw.js").then(() => navigator.serviceWorker.ready).then(() => {
        setOfflineStatus("ready");
      }).catch(() => { setOfflineStatus("failed"); });
    }
    return () => { window.cancelAnimationFrame(clockFrame); window.clearInterval(interval); };
  }, []);

  const wait = game.state ? gatheringWaitMs(game.state, Math.max(now, game.state.lastGatheredAt ?? 0)) : 0;
  const status = { loading: "Opening", waiting: "Read only", active: "Active", error: "Fault" }[game.status];
  const worksOpen = !!game.state && game.state.lifetimeAuthority >= BALANCE.worksAuthority;
  const studiesOpen = !!game.state?.chronicle.includes("lamp-complaint");
  const expeditionsOpen = !!game.state && game.state.buildings["ruined-cistern"] > 0;
  const visibleSections = (Object.keys(SECTIONS) as Section[]).filter((id) => (id !== "works" || worksOpen) && (id !== "studies" || studiesOpen) && (id !== "expeditions" || expeditionsOpen));
  const shownSection = game.status === "error" && !game.state ? "settings" : visibleSections.includes(section) ? section : "ward";
  const emptyStores = game.state ? Number(game.state.resources.food === 0) + Number(game.state.awakenedAt === null && game.state.resources.oil === 0) : 0;
  const pending = game.state?.pendingEvents.length ?? 0;
  const faults = Number(Boolean(game.error)) + Number(offlineStatus === "failed");
  const returns = game.returnSummary?.completedExpeditions.length ?? 0;
  const works = game.state ? availableWorks(game.state) : [];
  const studies = game.state ? availableStudies(game.state) : [];
  const newWorks = works.filter(id => !game.state?.seenWorks.includes(id)).length;
  const newStudies = studies.filter(id => !game.state?.seenStudies.includes(id)).length;
  const workId = works.find(id => id === selectedWork) ?? works[0];
  const studyId = studies.find(id => id === selectedStudy) ?? studies[0];
  const catalogVisible = canReveal && !endingPending && reveals.length === 0;

  useEffect(() => {
    if (!catalogVisible || !game.state) return;
    if (shownSection === "works" && !game.state.activeConstruction && workId && !game.state.seenWorks.includes(workId)) {
      game.dispatch({ type: "view-work", id: workId });
    }
    if (shownSection === "studies" && studyId && !game.state.seenStudies.includes(studyId)) {
      game.dispatch({ type: "view-study", id: studyId });
    }
  }, [catalogVisible, game, shownSection, workId, studyId]);

  const attention = {
    ward: { count: pending + emptyStores, label: "reports or empty stores", warning: emptyStores > 0 },
    works: { count: newWorks, label: "new entries" }, studies: { count: newStudies, label: "new entries" },
    expeditions: { count: returns, label: "returned parties" },
    chronicle: { count: 0, label: "entries" },
    settings: { count: faults, label: "record faults", warning: true },
  };
  const dispatch = (action: GameAction) => {
    if (!game.dispatch(action)) return;
    if (action.type !== "read-chronicle" && action.type !== "view-work" && action.type !== "view-study" && action.type !== "dismiss-illustrations" && action.type !== "advance-awakening") setFeedback(actionFeedback(action));
    if (action.type === "advance-awakening" && action.step === AWAKENING.passages.length - 1) setSection("ward");
  };

  return <div className="terminal-shell">
    <a href="#main" className="skip-link">Skip to content</a>
    <header className="terminal-header">
      <div className="terminal-identity">
        <svg viewBox="0 0 32 40" aria-hidden="true" className="ward-glyph" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M4 4h24v24L16 36 4 28zM10 12h12M10 18h12M16 8v20M10 26h12" /></svg>
        <div><p className="machine-label">The Outer Ward</p><h1>Buried Sun</h1></div>
      </div>
      <div className="terminal-header-controls">
        <p className="connection-status machine-label"><span className={`status-light ${game.status === "active" ? "is-active" : ""}`} aria-hidden="true" /><span>{status}</span></p>
        {game.state && <WorkerReassignment state={game.state} active={game.status === "active" && !game.error && !game.returnSummary && !endingPending && reveals.length === 0} dispatch={dispatch} onDialogChange={setDetailsOpen} initialGroup={shownSection === "studies" ? "study" : shownSection === "works" || shownSection === "expeditions" ? "field" : "daily"} />}
      </div>
    </header>
    <div className="terminal-instruments">{game.state && <ResourceReadout state={game.state} onDialogChange={setDetailsOpen} />}</div>
    <main id="main" tabIndex={-1} aria-label={SECTIONS[shownSection]}>
      {game.returnSummary ? <ReturnPanel summary={game.returnSummary} dismiss={game.dismissSummary} /> : <>
        {game.error && <div role="alert" className="terminal-alert"><p className="machine-label">Record fault</p><p>{game.error}</p></div>}
        {game.status === "loading" && <p role="status" className="terminal-notice machine-label">Opening the Keeper’s register…</p>}
        {game.status === "waiting" && <div role="status" className="terminal-notice"><p className="machine-label">Access / held by another tab</p><h2>The register is open elsewhere.</h2><p>Close the other Buried Sun tab to continue here. This tab will then load your latest progress.</p></div>}
        {shownSection === "settings" && offlineStatus === "failed" && <p role="alert" className="terminal-alert">Offline shell unavailable. Revisit while online.</p>}
        <GamePages game={game} section={shownSection} wait={wait} dispatch={dispatch} clearFeedback={() => setFeedback("")} chronicleVisible={visible && !endingPending && reveals.length === 0 && !detailsOpen} onDialogChange={setDetailsOpen} selectedWork={selectedWork} selectWork={selectWork} selectedStudy={selectedStudy} selectStudy={selectStudy} />
      </>}
    </main>
    <IllustrationReveal queue={reveals} active={revealActive} dispatch={dispatch} />
    {game.state && <AwakeningReveal state={game.state} active={endingActive} dispatch={dispatch} />}
    <nav aria-label="Keeper’s records" className="terminal-nav">
      {visibleSections.map((id, index) => <button key={id} aria-current={shownSection === id ? "page" : undefined} aria-controls="main" onClick={() => { setSection(id); setFeedback(""); game.dismissSummary(); }}>
        <span aria-hidden="true" className="nav-index">0{index + 1}</span><span>{SECTIONS[id]}</span><AttentionBadge {...attention[id]} />
      </button>)}
    </nav>
    <footer className="terminal-footer machine-label"><span role="status">{feedback || `Register // ${game.state ? "Local" : "—"}`}</span><span>{game.state && game.state.awakenedAt !== null ? "Outer Ward // Story complete" : offlineStatus === "ready" ? "Offline shell // ready" : "Outer Ward // I"}</span></footer>
    <p className="sr-only" role="status" aria-atomic="true">{pending ? `Ward: ${pending} pending reports.` : ""}{emptyStores ? ` Ward: ${emptyStores} empty stores.` : ""}{newWorks ? ` Works: ${newWorks} new entries.` : ""}{newStudies ? ` Studies: ${newStudies} new entries.` : ""}{returns ? ` Expeditions: ${returns} returned parties.` : ""}{faults ? ` Records: ${faults} faults.` : ""}</p>
  </div>;
}
