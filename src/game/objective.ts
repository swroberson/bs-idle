import { BALANCE } from "../content/balance";
import type { GameState } from "./types";

export function currentObjective(state: GameState) {
  if (state.jobs.forager === 0) return { title: "Put the gardens to work.", text: "Assign two Foragers to cover the five inhabitants’ Food consumption. Foraging continues during shortages." };
  if (state.jobs.lamplighter === 0) return { title: "Keep the lamps burning.", text: "Assign a Lamplighter. Burning Oil earns Authority and opens the Ward’s Works." };
  if (state.lifetimeAuthority < BALANCE.worksAuthority) return { title: "Restore the Keeper’s standing.", text: `Earn ${BALANCE.worksAuthority} lifetime Authority to open Works. Spending Authority will not erase this milestone.` };
  if (state.buildings.fields === 0) return { title: "Reclaim the gardens.", text: "Open Works and construct Fields: 20 Food / 5 Authority. Each level adds 0.04 Food/s per Forager." };
  if (state.buildings["oil-press"] === 0) return { title: "Give the lamps a steady supply.", text: "Construct an Oil Press in Works: 25 Food / 10 Authority. One level produces 0.10 Oil/s." };
  if (!state.chronicle.includes("household")) return { title: "Make room in the register.", text: "At 12 lifetime Authority a household will arrive. Set aside 30 Food / 10 Authority for three new inhabitants." };
  if (!state.chronicle.includes("lamp-complaint")) return { title: "Listen to the lamplighter.", text: "Keep the lamps lit. At 35 lifetime Authority, Orso will bring a report. A shortage may require fewer Lamplighters or another Oil Press." };
  if (!state.research.includes("examine-old-lamps")) return { title: "Examine the third lamp.", text: "Open Studies. The examination requires 15 Food / 15 Authority and records the discovery in the Chronicle." };
  return { title: "A seam descends beneath the chapel.", text: "Opening sequence complete. You may continue tending the Ward. Surveying the foundations will follow in the next story increment." };
}
