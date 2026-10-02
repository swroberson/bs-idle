import type { ResearchDefinition } from "../game/types";

export const RESEARCH = {
  "examine-old-lamps": {
    name: "Examine the Old Lamps",
    description: "Inspect the third lamp and record the shape of its casing. Orso will bring it no closer to the others.",
    text: "There is no wick in the third lamp. Its white lining is cold, yet Orso’s shadow falls behind him when he stands before it. A narrow seam descends from the base into the chapel wall.",
    cost: { food: 15, authority: 15 }, effect: "Lamp examination recorded.",
    chronicle: "lamp-examination", requirements: { chronicle: ["lamp-complaint"] },
  },
  "ledger-keeping": {
    name: "Ledger Keeping", description: "Separate the Keeper's observations from the household register. Leave room for measurements.",
    text: "The scrivener copies the third lamp's outline onto a fresh leaf. Beneath it she writes a question, then crosses out the question mark.",
    cost: { food: 20, authority: 12 }, effect: "Observations entered in a separate ledger.",
    chronicle: "ledger-keeping", requirements: { research: ["examine-old-lamps"] },
  },
  "crop-rotation": {
    name: "Crop Rotation", description: "Compare Nera's planting notes with the old garden boundaries.",
    text: "Each third bed is left fallow. In the empty beds, the roots of the neighboring plants turn toward the chapel.",
    cost: { coin: 15, knowledge: 10 }, effect: "Increases all Forager Food output by 25%, including Fields bonuses.",
    modifiers: { foodMultiplier: 1.25 }, chronicle: "crop-rotation", requirements: { buildings: { "scrivener-house": 1 } },
  },
  "better-wicks": {
    name: "Better Wicks", description: "Try a tighter weave in the ordinary lamps. The third lamp must remain untouched.",
    text: "The new wicks draw less oil. Orso enters the saving in the ledger and leaves the third lamp's column blank.",
    cost: { coin: 10, knowledge: 12 }, effect: "Reduces ordinary Lamplighter Oil consumption by 25%. Authority output is unchanged.",
    modifiers: { oilDemandMultiplier: 0.75 }, chronicle: "better-wicks", requirements: { buildings: { "scrivener-house": 1 } },
  },
  "catalog-relics": {
    name: "Catalog the Relics", description: "Compare the cistern objects with the seam drawn in the lamp record.",
    text: "The smallest fragment bears the same pale lining as the lamp. On its broken edge, six narrow channels run side by side. The scrivener declines to call them veins.",
    cost: { knowledge: 15, relics: 1 }, effect: "Recovered fragments cataloged.",
    chronicle: "relic-catalog", requirements: { buildings: { "antiquities-house": 1 }, expeditions: ["old-cistern"] },
  },
  "survey-foundations": {
    name: "Survey the Foundations", description: "Measure the chapel wall against the fragments recovered below the cistern.",
    text: "The chapel is built across an older opening. The seam passes through its foundations without a joint. Below the lowest course, the surveyors find a row of sockets, each facing down.",
    cost: { coin: 20, knowledge: 30, relics: 1 }, effect: "Foundation measurements recorded.",
    chronicle: "foundation-survey", requirements: { research: ["examine-old-lamps", "catalog-relics"], buildings: { "antiquities-house": 1 } },
  },
} as const satisfies Record<string, ResearchDefinition>;
