export const BUILDINGS = {
  fields: {
    name: "Fields", description: "Mark the old gardens for cultivation. Beneath the roots, the soil is warm.",
    cost: { food: 20, authority: 5 }, costGrowth: 1.7, maxLevel: 3,
    foodPerForager: 0.04,
  },
  "oil-press": {
    name: "Oil Press", description: "The screw turns easily once cleaned. No one remembers who cut its thread.",
    cost: { food: 25, authority: 10 }, costGrowth: 1.7, maxLevel: 3,
    oilPerSecond: 0.1,
  },
} as const;
