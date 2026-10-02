import { BALANCE } from "../content/balance";
import type { GameState } from "./types";
import { BUILDINGS } from "../content/buildings";
import { JOBS } from "../content/jobs";
import { EVENTS } from "../content/events";
import { RESEARCH } from "../content/research";
import { economyModifiers } from "./simulation";
import { costText, buildingCost } from "./requirements";

export function currentObjective(state: GameState) {
  const foragersNeeded = Math.ceil(state.population * BALANCE.foodPerInhabitant / ((JOBS.forager.foodPerSecond + state.buildings.fields * BUILDINGS.fields.foodPerForager) * economyModifiers(state).foodMultiplier));
  if (state.jobs.forager < foragersNeeded) return { title: "Put the gardens to work.", text: `Assign at least ${foragersNeeded} Foragers to cover the ${state.population} inhabitants’ Food consumption. Foraging continues during shortages.` };
  if (state.jobs.lamplighter === 0) return { title: "Keep the lamps burning.", text: "Assign a Lamplighter. Burning Oil earns Authority and opens the Ward’s Works." };
  if (state.lifetimeAuthority < BALANCE.worksAuthority) return { title: "Restore the Keeper’s standing.", text: `Earn ${BALANCE.worksAuthority} lifetime Authority to open Works. Spending Authority will not erase this milestone.` };
  if (state.buildings.fields === 0) return { title: "Reclaim the gardens.", text: `Open Works and construct Fields: ${costText(BUILDINGS.fields.cost)}. Each level adds ${BUILDINGS.fields.foodPerForager.toFixed(2)} Food/s per Forager.` };
  if (state.buildings["oil-press"] === 0) return { title: "Give the lamps a steady supply.", text: `Construct an Oil Press in Works: ${costText(BUILDINGS["oil-press"].cost)}. One level produces ${BUILDINGS["oil-press"].oilPerSecond.toFixed(2)} Oil/s.` };
  if (!state.chronicle.includes("household")) return { title: "Make room in the register.", text: `At ${EVENTS.household.lifetimeAuthority} lifetime Authority a household will arrive. Set aside ${costText(EVENTS.household.cost)} for ${EVENTS.household.population} new inhabitants.` };
  if (!state.chronicle.includes("lamp-complaint")) return { title: "Listen to the lamplighter.", text: `Keep the lamps lit. At ${EVENTS["lamp-complaint"].lifetimeAuthority} lifetime Authority, Orso will bring a report. A shortage may require fewer Lamplighters or another Oil Press.` };
  if (!state.research.includes("examine-old-lamps")) return { title: "Examine the third lamp.", text: `Open Studies. The examination requires ${costText(RESEARCH["examine-old-lamps"].cost)} and records the discovery in the Chronicle.` };
  if (!state.research.includes("ledger-keeping")) return { title: "Give the findings a ledger.", text: `Investigate Ledger Keeping in Studies: ${costText(RESEARCH["ledger-keeping"].cost)}. Trade and scholarship will follow.` };
  for (const id of ["market-stall", "scrivener-house", "ruined-cistern"] as const) {
    if (state.buildings[id] === 0) return { title: `Establish the ${BUILDINGS[id].name}.`, text: `Open Works: ${costText(buildingCost(state, id))}. ${BUILDINGS[id].description}` };
  }
  if (state.jobs.scrivener === 0) return { title: "Put the observations in order.", text: "Assign a Scrivener in Ward to earn Knowledge. Keep Food production positive; new work draws from the same inhabitant register." };
  if (!state.completedExpeditions.includes("old-cistern")) return { title: "Send a party below the waterline.", text: state.activeExpedition ? "The party is away. Its return is automatic, including while the terminal is closed. Returned inhabitants remain idle." : "Release two workers in Ward, then send them to the Old Cistern in Expeditions. Two inhabitants require 20 Food and return in three minutes with two Relics." };
  if (state.buildings["antiquities-house"] === 0) return { title: "Set the recovered objects apart.", text: `Construct the House of Antiquities in Works: ${costText(buildingCost(state, "antiquities-house"))}.` };
  if (!state.research.includes("catalog-relics")) return { title: "Compare the pale fragments.", text: `Investigate Catalog the Relics in Studies: ${costText(RESEARCH["catalog-relics"].cost)}.` };
  if (!state.research.includes("survey-foundations")) return { title: "Measure the wall beneath the chapel.", text: `Survey the Foundations in Studies: ${costText(RESEARCH["survey-foundations"].cost)}. Repeat the Old Cistern expedition if another Relic is needed.` };
  return { title: "The sockets face down.", text: "Foundation survey recorded. This build’s story ends here; the Ward and expeditions remain available. Tracing the buried conduits is the next story increment." };
}
