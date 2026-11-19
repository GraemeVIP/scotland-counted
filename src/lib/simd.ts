/**
 * Scottish Index of Multiple Deprivation (SIMD 2020v2) rank helpers.
 *
 * Scotland is divided into 6,976 small areas called data zones.
 * Rank 1 is the most deprived data zone in Scotland; rank 6,976 is the least
 * deprived. Decile 1 is the most deprived 10%; Quintile 1 is the most
 * deprived 20%.
 */

export const SIMD_TOTAL_DATA_ZONES = 6_976;

export type SimdSummary = {
  rank: number;
  total: number;
  decile: number;
  quintile: number;
  /** Plain English band label, e.g. "Most deprived 10% in Scotland". */
  bandLabel: string;
  /** Plain explanation of what the decile means. */
  explanation: string;
};

export function simdFromRank(rawRank: number): SimdSummary | null {
  if (!Number.isFinite(rawRank) || rawRank < 1 || rawRank > SIMD_TOTAL_DATA_ZONES) {
    return null;
  }
  const rank = Math.round(rawRank);
  const decile = Math.min(10, Math.max(1, Math.ceil((rank / SIMD_TOTAL_DATA_ZONES) * 10)));
  const quintile = Math.min(5, Math.max(1, Math.ceil((rank / SIMD_TOTAL_DATA_ZONES) * 5)));

  const bandLabel =
    decile === 1
      ? "Most deprived 10% in Scotland"
      : decile === 2
        ? "Most deprived 20% in Scotland"
        : decile <= 5
          ? `More deprived half (Decile ${decile} of 10)`
          : decile >= 9
            ? `Least deprived ${decile === 10 ? "10%" : "20%"} in Scotland`
            : `Less deprived half (Decile ${decile} of 10)`;

  const explanation =
    decile <= 2
      ? "This data zone sits in Scotland's most deprived fifth (Quintile 1). Many Scottish universities, charities and public schemes use Decile 1 or 2 postcodes for widening access and local support."
      : decile <= 5
        ? "This data zone sits in the more deprived half of Scotland, though outside the most deprived 20%."
        : decile <= 8
          ? "This data zone sits in the less deprived half of Scotland on the combined SIMD score."
          : "This data zone sits in Scotland's least deprived fifth (Quintile 5). Individual households inside any area can still face poverty or low income.";

  return {
    rank,
    total: SIMD_TOTAL_DATA_ZONES,
    decile,
    quintile,
    bandLabel,
    explanation,
  };
}
