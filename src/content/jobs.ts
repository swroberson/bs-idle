export const JOBS = {
  forager: { name: "Forager", description: "Gather Food from the abandoned gardens.", requirements: {}, foodPerSecond: 0.12 },
  lamplighter: { name: "Lamplighter", description: "Consume Oil to keep the lamps lit and earn Authority.", requirements: {}, oilPerSecond: 0.075, authorityPerSecond: 0.1 },
  laborer: { name: "Laborer", description: "Prepare stone and carry materials for construction. Assigned Laborers reduce building Coin costs within a fixed cap.", requirements: { buildings: { smithy: 1 } } },
  scrivener: { name: "Scrivener", description: "Record observations. Produces 0.08 Knowledge/s; output halves during Food shortages.", requirements: { buildings: { "scrivener-house": 1 } }, knowledgePerSecond: 0.08 },
} as const;
