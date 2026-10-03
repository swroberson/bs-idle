import type { ResearchDefinition } from "../game/types";
import { WARD_RECORDS } from "./awakening";

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
  "trace-conduits": {
    name: "Trace the Buried Conduits", description: "Compare the aqueduct measurements with the chapel survey. Clear short sections along the measured line and record each exposed joint.",
    text: WARD_RECORDS["conduit-trace"].text, cost: { coin: 15, knowledge: 16, relics: 1 },
    effect: "Tracing recorded.", chronicle: "conduit-trace",
    requirements: { research: ["survey-foundations"], expeditions: ["ruined-aqueduct"] },
  },
  "open-chamber": {
    name: "Open the Sealed Chamber", description: "Brace the fitted slab. Hold its catch clear and draw the slab outward with the lifting tackle.",
    text: WARD_RECORDS["chamber-opened"].text, cost: { coin: 20, knowledge: 20, relics: 1 },
    effect: "Chamber opened.", chronicle: "chamber-opened",
    requirements: { research: ["trace-conduits"], buildings: { "subterranean-works": 1 }, expeditions: ["chapel-foundations"] },
  },
  "study-engine": {
    name: "Study the Buried Engine", description: "Compare the loose joining piece with the exposed ends. Test the nearby movable stone without forcing it beyond its present stop.",
    text: WARD_RECORDS["engine-study"].text, cost: { knowledge: 24, relics: 1 },
    effect: "Local tests recorded.", chronicle: "engine-study",
    requirements: { research: ["open-chamber"], buildings: { "buried-engine": 1 } },
  },
  "restore-conduit": {
    name: "Restore the Conduit", description: "Lift the joining piece into its measured position. Secure its support and prepare the movable stone for a separate test.",
    text: WARD_RECORDS["conduit-restored"].text, cost: { coin: 150, knowledge: 120, relics: 2, authority: 40 },
    effect: "Connection restored.", chronicle: "conduit-restored",
    requirements: { research: ["study-engine"], buildings: { "buried-engine": 1 } },
  },
  "iron-tools": {
    name: "Iron Tools", description: "Refit the garden tools and compare their work with the old edges.",
    text: WARD_RECORDS["iron-tools"].text, cost: { coin: 15, knowledge: 12 },
    effect: "All Forager Food output increases by 20%, multiplying with Crop Rotation.",
    modifiers: { foodMultiplier: 1.2 }, chronicle: "iron-tools", requirements: { buildings: { smithy: 1 } },
  },
  "improved-presses": {
    name: "Improved Presses", description: "Refit the press bearings and measure a full turn under load.",
    text: WARD_RECORDS["improved-presses"].text, cost: { coin: 20, knowledge: 16 },
    effect: "Oil Press output increases by 25%.", modifiers: { oilOutputMultiplier: 1.25 },
    chronicle: "improved-presses", requirements: { buildings: { smithy: 1, "oil-press": 1 } },
  },
  "study-black-metal": {
    name: "Study the Black Metal", description: "Compare the embedded strip with the cistern fragments.",
    text: WARD_RECORDS["black-metal-study"].text, cost: { knowledge: 12, relics: 1 },
    effect: "Material comparison recorded; production unchanged.", chronicle: "black-metal-study",
    requirements: { buildings: { "antiquities-house": 1 }, expeditions: ["collapsed-gatehouse"] },
  },
} as const satisfies Record<string, ResearchDefinition>;
