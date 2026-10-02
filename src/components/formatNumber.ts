const units = [[1e15, "q"], [1e12, "t"], [1e9, "b"], [1e6, "m"], [1e3, "k"]] as const;

/** Truncate rather than round up: a readout must not imply extra resources. */
export function formatCompactNumber(value: number): string {
  if (!Number.isFinite(value)) return "—";
  const magnitude = Math.abs(value);
  // Saves currently cap resources at MAX_SAFE_INTEGER (9q). Keep a bounded
  // fallback if a later economy expands beyond the named units.
  if (magnitude >= 1e18) return value.toExponential(1).replace("e+", "e");
  const unit = units.find(([threshold]) => magnitude >= threshold);
  const scaled = magnitude / (unit?.[0] ?? 1);
  const truncated = Math.floor(scaled * 10) / 10;
  return `${value < 0 && truncated !== 0 ? "-" : ""}${truncated}${unit?.[1] ?? ""}`;
}
