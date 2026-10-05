import { LAMPS } from "../content/lamps";
import type { GameState, LampState } from "./types";

export function initialLamps(): LampState {
  return { lit: LAMPS.count, transition: null, transitionSeconds: 0, darknessSeconds: 0 };
}

export function lampStatus(state: GameState, oilOutput: number, oilMultiplier: number) {
  const restored = state.awakenedAt !== null;
  const crewCapacity = Math.min(LAMPS.count, state.jobs.lamplighter * LAMPS.perLamplighter);
  const oilPerLamp = restored ? 0 : LAMPS.oilPerLampSecond * oilMultiplier;
  const sustainable = restored ? LAMPS.count : Math.min(LAMPS.count, Math.floor(oilOutput / oilPerLamp + 1e-9));
  const fueled = state.resources.oil > 0 ? LAMPS.count : sustainable;
  let target = restored ? LAMPS.count : Math.min(crewCapacity, fueled);
  if (!restored && target > state.lamps.lit && state.resources.oil < LAMPS.relightReserveOil && state.lamps.transition !== "relight") {
    target = Math.max(state.lamps.lit, Math.min(target, sustainable));
  }
  const transition: LampState["transition"] = target < state.lamps.lit ? "out" : target > state.lamps.lit ? "relight" : null;
  const transitionDuration = transition === "out" ? LAMPS.outageSeconds : LAMPS.relightSeconds;
  const transitionSeconds = transition === state.lamps.transition ? state.lamps.transitionSeconds : 0;
  const oilDemand = state.lamps.lit * oilPerLamp;
  const oilDraw = state.resources.oil > 0 ? oilDemand : Math.min(oilDemand, oilOutput);
  const authorityLoss = !restored && state.lamps.darknessSeconds >= LAMPS.darknessGraceSeconds
    ? (LAMPS.count - state.lamps.lit) * LAMPS.authorityLossPerDarkLampSecond : 0;
  const fuelFraction = oilDemand > 0 ? oilDraw / oilDemand : 1;
  return { crewCapacity, target, transition, transitionSeconds, oilDemand, oilDraw, authorityLoss, fuelFraction,
    maintained: Math.min(state.lamps.lit, crewCapacity),
    secondsUntilChange: transition ? transitionDuration - transitionSeconds : Infinity };
}

type LampStatus = ReturnType<typeof lampStatus>;

export function prepareLamps(state: GameState, status: LampStatus): GameState {
  if (state.lamps.transition === status.transition && (status.transition !== null || state.lamps.transitionSeconds === 0)) return state;
  return { ...state, lamps: { ...state.lamps, transition: status.transition, transitionSeconds: 0 } };
}

export function advanceLamps(state: GameState, status: LampStatus, seconds: number): GameState {
  let lit = state.lamps.lit;
  let transition = status.transition;
  let transitionSeconds = status.transition ? status.transitionSeconds + seconds : 0;
  const darknessSeconds = lit < LAMPS.count ? Math.min(LAMPS.darknessGraceSeconds, state.lamps.darknessSeconds + seconds) : 0;
  if (status.transition && seconds >= status.secondsUntilChange) {
    lit += status.transition === "out" ? -1 : 1;
    transition = null;
    transitionSeconds = 0;
  }
  const firstOutage = lit < LAMPS.count && !state.chronicle.includes("lamp-outage");
  return { ...state, lamps: { lit, transition, transitionSeconds,
    darknessSeconds: lit === LAMPS.count ? 0 : darknessSeconds },
    chronicle: firstOutage ? [...state.chronicle, "lamp-outage"] : state.chronicle };
}
