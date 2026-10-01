export const JOBS = {
  forager: { name: "Forager", description: "Gather Food from the abandoned gardens.", foodPerSecond: 0.12 },
  lamplighter: { name: "Lamplighter", description: "Consume Oil to keep the lamps lit and earn Authority.", oilPerSecond: 0.075, authorityPerSecond: 0.1 },
} as const;
