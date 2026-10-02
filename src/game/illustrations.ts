import { ILLUSTRATIONS } from "../content/illustrations";
import type { ChronicleId, GameState, IllustrationId } from "./types";

export function illustrationForRecord(record: ChronicleId): IllustrationId | undefined {
  return (Object.keys(ILLUSTRATIONS) as IllustrationId[]).find(id => ILLUSTRATIONS[id].chronicle === record);
}

export function pendingIllustrations(state: GameState): IllustrationId[] {
  return state.chronicle.flatMap(record => {
    const id = illustrationForRecord(record);
    return id && !state.dismissedIllustrations.includes(id) ? [id] : [];
  });
}
