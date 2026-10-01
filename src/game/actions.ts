import { BALANCE } from "../content/balance";
import type { GameAction, GameState } from "./types";

export function gatheringWaitMs(state: GameState, now: number): number {
  return state.lastGatheredAt === null ? 0 : Math.max(0, state.lastGatheredAt + BALANCE.gatheringCooldownMs - now);
}

export function applyAction(state: GameState, action: GameAction, now: number): GameState {
  if (!Number.isSafeInteger(now) || now < 0) return state;
  if (action.type !== "gather-food" || gatheringWaitMs(state, now) > 0) return state;
  return {
    ...state,
    lastGatheredAt: now,
    resources: { ...state.resources, food: Math.min(Number.MAX_SAFE_INTEGER, state.resources.food + BALANCE.gatheringFood) },
  };
}
