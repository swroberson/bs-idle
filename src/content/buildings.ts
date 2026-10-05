import type { BuildingDefinition } from "../game/types";

export const BUILDINGS = {
  fields: {
    name: "Fields", description: "Mark the old gardens for cultivation. Beneath the roots, the soil is warm.",
    effect: "Each level: +0.04 Food/s per Forager.",
    cost: { food: 20, authority: 5 }, workSeconds: 30, costGrowth: 1.7, maxLevel: 3,
    foodPerForager: 0.04, storagePerLevel: { food: 40 }, requirements: { lifetimeAuthority: 3 },
  },
  "oil-press": {
    name: "Oil Press", description: "The screw turns easily once cleaned. No one remembers who cut its thread.",
    effect: "Each level: +0.10 Oil/s automatically; half output during Food shortages.",
    cost: { food: 25, authority: 10 }, workSeconds: 45, costGrowth: 1.7, maxLevel: 3,
    oilPerSecond: 0.1, storagePerLevel: { oil: 40 }, requirements: { buildings: { fields: 1 }, lifetimeAuthority: 3 },
  },
  "market-stall": {
    name: "Market Stall", description: "A counter is set beneath the arch. The first coins bear a face worn entirely smooth.",
    effect: "Each level: +0.10 Coin/s automatically; half output during Food shortages.",
    cost: { food: 30, authority: 15 }, workSeconds: 45, costGrowth: 1.7, maxLevel: 3,
    coinPerSecond: 0.1, storagePerLevel: { coin: 20, authority: 10 }, requirements: { research: ["ledger-keeping"] },
  },
  "scrivener-house": {
    name: "Scrivener’s House", description: "The room has shelves enough for a thousand books. Only the dust has been disturbed.",
    completedEffect: "Each assigned Scrivener produces 0.08 Knowledge/s.",
    cost: { coin: 12, authority: 10 }, workSeconds: 45, costGrowth: 1, maxLevel: 1,
    storagePerLevel: { knowledge: 15 },
    requirements: { buildings: { "market-stall": 1 }, research: ["ledger-keeping"] },
  },
  "ruined-cistern": {
    name: "Ruined Cistern", description: "Clear the upper stair and fix a rope to the ring in the stone. The ring is uncorroded.",
    completedEffect: "Parties of 1–3 idle inhabitants; one party may be away at a time.",
    cost: { coin: 15, food: 20, authority: 10 }, workSeconds: 60, costGrowth: 1, maxLevel: 1,
    requirements: { buildings: { "scrivener-house": 1 }, research: ["examine-old-lamps"] },
  },
  "antiquities-house": {
    name: "House of Antiquities", description: "Recovered objects are set apart from ordinary stores. Nothing placed here is called a tool.",
    cost: { coin: 25, authority: 15 }, workSeconds: 60, costGrowth: 1, maxLevel: 1,
    storagePerLevel: { knowledge: 15 },
    requirements: { expeditions: ["old-cistern"] },
  },
  "lamp-house": {
    name: "Lamp House", description: "Set a bench and measured vessels beside the lamp stores.",
    effect: "Each level: +0.025 Authority/s per Lamplighter; Oil demand unchanged.",
    authorityPerLamplighter: .025, chronicle: "lamp-house-built",
    storagePerLevel: { authority: 20 },
    cost: { coin: 20, authority: 15 }, workSeconds: 45, costGrowth: 1.7, maxLevel: 3,
    requirements: { buildings: { "oil-press": 1 }, research: ["ledger-keeping"] },
  },
  smithy: {
    name: "Smithy", description: "Clear a hearth and set an anvil for repairing the Ward's tools.",
    completedEffect: "Repair workspace established.", chronicle: "smithy-built",
    cost: { coin: 25, food: 15 }, workSeconds: 60, costGrowth: 1, maxLevel: 1,
    requirements: { buildings: { "market-stall": 1 }, research: ["ledger-keeping"] },
  },
  "subterranean-works": {
    name: "Subterranean Works", description: "Shore the stair beneath the chapel and set lifting tackle beside the older opening. Keep the descent clear for a small party.",
    completedEffect: "Safe access established.", chronicle: "subterranean-works-built",
    cost: { coin: 30, food: 30, authority: 20 }, workSeconds: 90, costGrowth: 1, maxLevel: 1,
    requirements: { research: ["trace-conduits"] },
  },
  "buried-engine": {
    name: "The Buried Engine", description: "Lay a working platform inside the chamber. Support the loose length and place lamps where its exposed surfaces can be examined.",
    completedEffect: "Inspection platform installed.", chronicle: "engine-works-built",
    cost: { coin: 25, knowledge: 8 }, workSeconds: 90, costGrowth: 1, maxLevel: 1,
    storagePerLevel: { coin: 100, knowledge: 90 },
    requirements: { research: ["open-chamber"] },
  },
} as const satisfies Record<string, BuildingDefinition>;
