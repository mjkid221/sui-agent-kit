/**
 * Fee tiers bps to tick spacing in Cetus.
 *
 * @remarks
 * 1 bps (fee rate * 10000) = 2 tick spacing.
 * Refer to https://cetus-1.gitbook.io/cetus-developer-docs/developer/via-sdk/features-available/create-clmm-pool.
 *
 * @example
 * const tickSpacing = CETUS_FEE_TIERS[1]; // returns 2
 */
export const CETUS_FEE_TIERS = {
  1: 2,
  5: 10,
  10: 20,
  25: 60,
  100: 200,
  200: 220,
} as const;
