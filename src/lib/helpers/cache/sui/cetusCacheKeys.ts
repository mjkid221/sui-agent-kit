import { CETUS_FEE_TIERS } from "@/tools/sui/cetus/fees";

export const createLiquidityPairInputWithExistingPoolCacheKey = (
  poolId: string,
  inputAmount: number,
  inputCoinType: string,
  slippagePercentage: number,
  existingPositionId?: string,
) =>
  `liquidityPairInputWithExistingPool-${poolId}-${inputAmount}-${inputCoinType}-${slippagePercentage}-${existingPositionId}`;

export const createLiquidityPairInputWithNewPoolCacheKey = (
  coinTypeA: string,
  coinTypeADepositAmount: number,
  coinTypeB: string,
  initialPrice: number,
  feeTier: keyof typeof CETUS_FEE_TIERS,
  slippagePercentage: number,
) =>
  `liquidityPairInputWithNewPool-${coinTypeA}-${coinTypeADepositAmount}-${coinTypeB}-${initialPrice}-${feeTier}-${slippagePercentage}`;
