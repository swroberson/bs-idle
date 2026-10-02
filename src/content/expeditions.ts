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
} as const satisfies Record<string, ExpeditionDefinition>;
