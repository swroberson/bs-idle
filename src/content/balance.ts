// Provisional opening values, in resources per second where applicable.
export const BALANCE = {
  startingPopulation: 5,
  populationCap: 20,
  startingResources: { food: 30, oil: 20, authority: 0, coin: 0, knowledge: 0, relics: 0 },
  gatheringFood: 2,
  gatheringCooldownMs: 30_000,
  emergencyOil: 2,
  emergencyOilFood: 5,
  offlineProductionCapMs: 8 * 60 * 60 * 1000,
  foodPerInhabitant: 0.025,
  shortageOutputMultiplier: 0.5,
  worksAuthority: 3,
  expeditionMaxWorkers: 3,
  expeditionLogLimit: 20,
  returnSummaryAfterMs: 10_000,
} as const;
