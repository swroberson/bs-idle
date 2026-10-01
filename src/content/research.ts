export const RESEARCH = {
  "examine-old-lamps": {
    name: "Examine the Old Lamps",
    text: "There is no wick in the third lamp. Its white lining is cold, yet Orso’s shadow falls behind him when he stands before it. A narrow seam descends from the base into the chapel wall.",
    cost: { food: 15, authority: 15 },
    effect: "Record the anomalous lamp and the seam beneath the chapel. The next story stage will survey the foundations.",
    chronicle: "lamp-examination",
  },
} as const;
