import { CHRONICLE } from "@/content/chronicle";
import { SavePanel } from "./SavePanel";
import { WardPanel } from "./WardPanel";
import { WorksPanel } from "./WorksPanel";
import { ExpeditionPanel } from "./ExpeditionPanel";
import { StudiesPanel } from "./StudiesPanel";
import { ChroniclePanel } from "./ChroniclePanel";
import { EventPanel } from "./EventPanel";
import type { useLocalGame } from "./useLocalGame";
import type { GameAction, GameState } from "@/game/types";

export const SECTIONS = { ward: "Ward", works: "Works", studies: "Studies", expeditions: "Expeditions", chronicle: "Chronicle", settings: "Saves" } as const;
export type Section = keyof typeof SECTIONS;

function OpeningPage({ section, state, active, dispatch, wait, showChronicle }: {
  section: Section; state: GameState; active: boolean; dispatch: (action: GameAction) => void; wait: number; showChronicle: () => void;
}) {
  switch (section) {
    case "works": return <WorksPanel state={state} active={active} dispatch={dispatch} />;
    case "expeditions": return <ExpeditionPanel state={state} active={active} dispatch={dispatch} />;
    case "studies": return <StudiesPanel state={state} active={active} dispatch={dispatch} />;
    case "chronicle": return <ChroniclePanel state={state} />;
    case "ward": return <>
      <WardPanel state={state} wait={wait} active={active} gather={() => dispatch({ type: "gather-food" })} dispatch={dispatch} />
      <div className="record-strip"><span className="machine-label">Last entry</span><p>{CHRONICLE[state.chronicle[state.chronicle.length - 1]].title}</p><button className="record-link" onClick={showChronicle}>Read record <span aria-hidden="true">↗</span></button></div>
    </>;
    default: return null;
  }
}

export function GamePages({ game, section, wait, dispatch, setSection, clearFeedback }: {
  game: ReturnType<typeof useLocalGame>; section: Section; wait: number; dispatch: (action: GameAction) => void;
  setSection: (section: Section) => void; clearFeedback: () => void;
}) {
  if (game.status === "loading") return null;
  if (section === "settings" || (game.status === "error" && !game.state)) return <SavePanel
    state={game.state} damagedSave={game.damagedSave} disabled={game.status === "waiting"}
    importSave={(text) => { game.importSave(text); clearFeedback(); }} reset={() => { game.reset(); clearFeedback(); }} />;
  if (!game.state) return null;
  return <>
    <EventPanel state={game.state} active={game.status === "active"} dispatch={dispatch} />
    <OpeningPage section={section} state={game.state} active={game.status === "active"} dispatch={dispatch} wait={wait} showChronicle={() => setSection("chronicle")} />
  </>;
}
