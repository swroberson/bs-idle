// Provisional opening values. Economy rates belong here in the next milestone.
export const BALANCE = {
  startingPopulation: 5,
  populationCap: 20,
  startingResources: { food: 30, oil: 20, authority: 0 },
  gatheringFood: 2,
  gatheringCooldownMs: 30_000,
  offlineProductionCapMs: 8 * 60 * 60 * 1000,
} as const;
