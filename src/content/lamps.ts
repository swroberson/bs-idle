// Ordinary civic fixtures only. The anomalous third lamp is not part of this fuel model.
export const LAMPS = {
  count: 6,
  perLamplighter: 3,
  oilPerLampSecond: 0.0125,
  outageSeconds: 30,
  relightSeconds: 10,
  // Avoid relighting on a fractional trickle that immediately runs dry.
  relightReserveOil: 1,
  darknessGraceSeconds: 120,
  authorityLossPerDarkLampSecond: 0.005,
} as const;
