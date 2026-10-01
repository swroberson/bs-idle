import { BALANCE } from "../content/balance";
import type { GameState } from "./types";
import { BUILDINGS } from "../content/buildings";
import { JOBS } from "../content/jobs";
import { EVENTS } from "../content/events";
import { RESEARCH } from "../content/research";
import { costText } from "./requirements";

export function currentObjective(state: GameState) {
  const foragersNeeded = Math.ceil(state.population * BALANCE.foodPerInhabitant / (JOBS.forager.foodPerSecond + state.buildings.fields * BUILDINGS.fields.foodPerForager));
  if (state.jobs.forager < foragersNeeded) return { title: "Put the gardens to work.", text: `Assign at least ${foragersNeeded} Foragers to cover the ${state.population} inhabitants’ Food consumption. Foraging continues during shortages.` };
  if (state.jobs.lamplighter === 0) return { title: "Keep the lamps burning.", text: "Assign a Lamplighter. Burning Oil earns Authority and opens the Ward’s Works." };
  if (state.lifetimeAuthority < BALANCE.worksAuthority) return { title: "Restore the Keeper’s standing.", text: `Earn ${BALANCE.worksAuthority} lifetime Authority to open Works. Spending Authority will not erase this milestone.` };
  if (state.buildings.fields === 0) return { title: "Reclaim the gardens.", text: `Open Works and construct Fields: ${costText(BUILDINGS.fields.cost)}. Each level adds ${BUILDINGS.fields.foodPerForager.toFixed(2)} Food/s per Forager.` };
  if (state.buildings["oil-press"] === 0) return { title: "Give the lamps a steady supply.", text: `Construct an Oil Press in Works: ${costText(BUILDINGS["oil-press"].cost)}. One level produces ${BUILDINGS["oil-press"].oilPerSecond.toFixed(2)} Oil/s.` };
  if (!state.chronicle.includes("household")) return { title: "Make room in the register.", text: `At ${EVENTS.household.lifetimeAuthority} lifetime Authority a household will arrive. Set aside ${costText(EVENTS.household.cost)} for ${EVENTS.household.population} new inhabitants.` };
  if (!state.chronicle.includes("lamp-complaint")) return { title: "Listen to the lamplighter.", text: `Keep the lamps lit. At ${EVENTS["lamp-complaint"].lifetimeAuthority} lifetime Authority, Orso will bring a report. A shortage may require fewer Lamplighters or another Oil Press.` };
  if (!state.research.includes("examine-old-lamps")) return { title: "Examine the third lamp.", text: `Open Studies. The examination requires ${costText(RESEARCH["examine-old-lamps"].cost)} and records the discovery in the Chronicle.` };
  return { title: "A seam descends beneath the chapel.", text: "Opening sequence complete. You may continue tending the Ward. Surveying the foundations will follow in the next story increment." };
}
