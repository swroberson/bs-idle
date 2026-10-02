import type { BuildingDefinition } from "../game/types";

export const BUILDINGS = {
  fields: {
    name: "Fields", description: "Mark the old gardens for cultivation. Beneath the roots, the soil is warm.",
    effect: "Each level: +0.04 Food/s per Forager.",
    cost: { food: 20, authority: 5 }, costGrowth: 1.7, maxLevel: 3,
    foodPerForager: 0.04, requirements: { lifetimeAuthority: 3 },
  },
  "oil-press": {
    name: "Oil Press", description: "The screw turns easily once cleaned. No one remembers who cut its thread.",
    effect: "Each level: +0.10 Oil/s automatically; half output during Food shortages.",
    cost: { food: 25, authority: 10 }, costGrowth: 1.7, maxLevel: 3,
    oilPerSecond: 0.1, requirements: { buildings: { fields: 1 }, lifetimeAuthority: 3 },
  },
  "market-stall": {
    name: "Market Stall", description: "A counter is set beneath the arch. The first coins bear a face worn entirely smooth.",
    effect: "Each level: +0.10 Coin/s automatically; half output during Food shortages.",
    cost: { food: 30, authority: 15 }, costGrowth: 1.7, maxLevel: 3,
    coinPerSecond: 0.1, requirements: { research: ["ledger-keeping"] },
  },
  "scrivener-house": {
    name: "Scrivener’s House", description: "The room has shelves enough for a thousand books. Only the dust has been disturbed.",
    completedEffect: "Each assigned Scrivener produces 0.08 Knowledge/s.",
    cost: { coin: 12, authority: 10 }, costGrowth: 1, maxLevel: 1,
    requirements: { buildings: { "market-stall": 1 }, research: ["ledger-keeping"] },
  },
  "ruined-cistern": {
    name: "Ruined Cistern", description: "Clear the upper stair and fix a rope to the ring in the stone. The ring is uncorroded.",
    completedEffect: "Parties of 1–3 idle inhabitants; one party may be away at a time.",
    cost: { coin: 15, food: 20, authority: 10 }, costGrowth: 1, maxLevel: 1,
    requirements: { buildings: { "scrivener-house": 1 }, research: ["examine-old-lamps"] },
  },
  "antiquities-house": {
    name: "House of Antiquities", description: "Recovered objects are set apart from ordinary stores. Nothing placed here is called a tool.",
    cost: { coin: 25, authority: 15 }, costGrowth: 1, maxLevel: 1,
    requirements: { expeditions: ["old-cistern"] },
  },
} as const satisfies Record<string, BuildingDefinition>;
