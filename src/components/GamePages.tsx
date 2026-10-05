import { SavePanel } from "./SavePanel";
import { WardPanel } from "./WardPanel";
import { WorksPanel } from "./WorksPanel";
import { ExpeditionPanel } from "./ExpeditionPanel";
import { StudiesPanel } from "./StudiesPanel";
import { ChroniclePanel } from "./ChroniclePanel";
import type { useLocalGame } from "./useLocalGame";
import type { GameAction, GameState } from "@/game/types";

export const SECTIONS = { ward: "Ward", works: "Works", studies: "Studies", expeditions: "Expeditions", chronicle: "Chronicle", settings: "Records" } as const;
export type Section = keyof typeof SECTIONS;

function OpeningPage({ section, state, active, dispatch, wait, chronicleVisible, onDialogChange }: {
  section: Section; state: GameState; active: boolean; dispatch: (action: GameAction) => void; wait: number; chronicleVisible: boolean;
  onDialogChange: (open: boolean) => void;
}) {
  switch (section) {
    case "works": return <WorksPanel state={state} active={active} dispatch={dispatch} onDialogChange={onDialogChange} />;
    case "expeditions": return <ExpeditionPanel state={state} active={active} dispatch={dispatch} onDialogChange={onDialogChange} />;
    case "studies": return <StudiesPanel state={state} active={active} dispatch={dispatch} />;
    case "chronicle": return <ChroniclePanel state={state} active={active && chronicleVisible} dispatch={dispatch} />;
    case "ward": return <WardPanel state={state} wait={wait} active={active} gather={() => dispatch({ type: "gather-food" })} dispatch={dispatch} />;
    default: return null;
  }
}

export function GamePages({ game, section, wait, dispatch, clearFeedback, chronicleVisible, onDialogChange }: {
  game: ReturnType<typeof useLocalGame>; section: Section; wait: number; dispatch: (action: GameAction) => void;
  clearFeedback: () => void;
  chronicleVisible: boolean;
  onDialogChange: (open: boolean) => void;
}) {
  if (game.status === "loading") return null;
  if (section === "settings" || (game.status === "error" && !game.state)) return <SavePanel
    state={game.state} damagedSave={game.damagedSave} disabled={game.status === "waiting"}
    importSave={(text) => { game.importSave(text); clearFeedback(); }} reset={() => { game.reset(); clearFeedback(); }} />;
  if (!game.state) return null;
  return <>
    <OpeningPage section={section} state={game.state} active={game.status === "active"} dispatch={dispatch} wait={wait} chronicleVisible={chronicleVisible} onDialogChange={onDialogChange} />
  </>;
}
