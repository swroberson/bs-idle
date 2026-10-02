import { describe, expect, it } from "vitest";
import { formatCompactNumber } from "./formatNumber";

describe("compact resource counts", () => {
  it.each([
    [0, "0"], [30, "30"], [12.39, "12.3"], [999.99, "999.9"],
    [1000, "1k"], [2165, "2.1k"], [2199, "2.1k"], [10_999, "10.9k"],
    [999_999, "999.9k"], [1_000_000, "1m"], [2_165_000, "2.1m"],
    [1_000_000_000, "1b"], [2_165_000_000_000, "2.1t"],
    [1_000_000_000_000_000, "1q"], [Number.MAX_SAFE_INTEGER, "9q"],
    [-2165, "-2.1k"], [NaN, "—"], [Infinity, "—"],
  ])("formats %s as %s", (value, expected) => {
    expect(formatCompactNumber(value)).toBe(expected);
  });

  it("keeps every valid resource magnitude within six characters", () => {
    for (const scale of [1, 1000, 1e6, 1e9, 1e12, 1e15]) {
      for (const coefficient of [1, 2.165, 10.999, 99.999, 999.999]) {
        const value = coefficient * scale;
        if (value <= Number.MAX_SAFE_INTEGER) expect(formatCompactNumber(value).length).toBeLessThanOrEqual(6);
      }
    }
  });
});
