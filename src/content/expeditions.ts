import type { ExpeditionDefinition } from "../game/types";

export const EXPEDITIONS = {
  "old-cistern": {
    name: "Old Cistern", description: "The water has fallen below a stair no living inhabitant has used. Something lies beneath the silt.",
    durationMs: 180_000, foodPerWorker: 10, rewardsPerWorker: { relics: 1 },
    requirements: { buildings: { "ruined-cistern": 1 } }, chronicle: "cistern-find",
  },
  "abandoned-farmstead": {
    name: "Abandoned Farmstead", description: "Beyond the cistern road, fruit dries on trees planted in straight lines. The house has no door.",
    durationMs: 240_000, foodPerWorker: 10, rewardsPerWorker: { food: 45, coin: 12 },
    requirements: { buildings: { "ruined-cistern": 1 }, expeditions: ["old-cistern"] }, chronicle: "farmstead-find",
  },
  "collapsed-gatehouse": {
    name: "Collapsed Gatehouse", description: "The upper arch has fallen across the passage. Loose iron and dressed stone lie among the blocks. Clear a working space beneath the remaining vault.",
    durationMs: 180000, foodPerWorker: 12, rewardsPerWorker: { coin: 15 },
    requirements: { research: ["catalog-relics"] }, chronicle: "gatehouse-find",
  },
  "barrow-field": {
    name: "Barrow Field", description: "Low mounds stand among the old boundary stones. Examine the exposed earth where a bank has fallen away.",
    durationMs: 240000, foodPerWorker: 15, rewardsPerWorker: { relics: 1 },
    requirements: { expeditions: ["collapsed-gatehouse"] }, chronicle: "barrow-find",
  },
  "ruined-aqueduct": {
    name: "Ruined Aqueduct", description: "Follow the dry channel to the place where its lining has fallen. Measure the exposed work beneath the channel bed.",
    durationMs: 240000, foodPerWorker: 15, rewardsPerWorker: { relics: 1 },
    requirements: { research: ["survey-foundations"], buildings: { "ruined-cistern": 1 } }, chronicle: "aqueduct-find",
  },
  "chapel-foundations": {
    name: "Foundations Beneath the Chapel", description: "Descend by the newly shored stair. Clear the rubble beside the older opening and record the surfaces beyond the last course of masonry.",
    durationMs: 300000, foodPerWorker: 15, rewardsPerWorker: { relics: 1 },
    requirements: { research: ["trace-conduits"], buildings: { "subterranean-works": 1 } }, chronicle: "chapel-find",
  },
} as const satisfies Record<string, ExpeditionDefinition>;
