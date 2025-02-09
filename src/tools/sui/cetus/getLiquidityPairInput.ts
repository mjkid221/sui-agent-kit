import { ClmmPoolUtil, d, TickMath } from "@cetusprotocol/cetus-sui-clmm-sdk";
import { CetusPoolManager } from "./CetusPoolManager";
import BN from "bn.js";
import { sortAddresses } from "@/lib/helpers/sort";
import { CETUS_FEE_TIERS } from "./fees";
import {
  LiquidityInputWithExistingPool,
  LiquidityInputWithNewPool,
} from "./types";

export async function getEstimatedLiquidityFromPool(
  cetusPM: CetusPoolManager,
  poolId: string,
  inputAmount: number,
  inputCoinType: string,
  slippagePercentage: number,
  posId?: string,
): Promise<LiquidityInputWithExistingPool> {
  const pool = await cetusPM.getPoolInfo(poolId);
  const coinTypes = [pool.coinTypeA, pool.coinTypeB];
  if (!coinTypes.includes(inputCoinType)) {
    throw new Error("Base coin type not found in pool");
  }
  const { lowerTick: tickLower, upperTick: tickUpper } = cetusPM.getTickValues(
    pool.current_tick_index,
    Number(pool.tickSpacing),
  );
  const [coinTypeA, coinTypeB] = sortAddresses(coinTypes[0], coinTypes[1]);
  const isFixedAmount = coinTypeA === inputCoinType;

  const coinTypeDecimals = await cetusPM.agent.requestGetCoinDecimals(
    isFixedAmount ? coinTypeA : coinTypeB,
  );
  const curSqrtPrice = new BN(pool.current_sqrt_price);
  const fixCoinAmount = inputAmount * 10 ** coinTypeDecimals;
  const slippageBps = slippagePercentage / 100;
  const liquidityInput = ClmmPoolUtil.estLiquidityAndcoinAmountFromOneAmounts(
    tickLower,
    tickUpper,
    new BN(fixCoinAmount),
    isFixedAmount,
    true,
    slippageBps,
    curSqrtPrice,
  );
  const amountA = isFixedAmount
    ? fixCoinAmount
    : liquidityInput.tokenMaxA.toNumber();
  const amountB = isFixedAmount
    ? liquidityInput.tokenMaxB.toNumber()
    : fixCoinAmount;

  return {
    slippage: slippageBps,
    tick_lower: tickLower,
    tick_upper: tickUpper,
    fix_amount_a: isFixedAmount,
    coinTypeA: pool.coinTypeA,
    coinTypeB: pool.coinTypeB,
    amount_a: amountA,
    amount_b: amountB,
    curSqrtPrice,
    tick_spacing: pool.tickSpacing,
    pool_id: poolId,
    // Defaults
    rewarder_coin_types: [],
    collect_fee: true,
    is_open: true,
    pos_id: posId ?? "",
  };
}

export async function getEstimatedLiquidityFromParams(
  cetusPM: CetusPoolManager,
  coinTypeA: string,
  coinTypeADepositAmount: number,
  coinTypeB: string,
  initialPrice: number,
  feeTier: keyof typeof CETUS_FEE_TIERS,
  slippagePercentage: number,
): Promise<LiquidityInputWithNewPool> {
  const [coinA, coinB] = sortAddresses(coinTypeA, coinTypeB);
  const [coinTypeADecimals, coinTypeBDecimals] = await Promise.all([
    cetusPM.agent.requestGetCoinDecimals(coinA),
    cetusPM.agent.requestGetCoinDecimals(coinB),
  ]);
  const coinMetadataAPromise = cetusPM.agent.client.getCoinMetadata({
    coinType: coinTypeA,
  });
  const coinMetadataBPromise = cetusPM.agent.client.getCoinMetadata({
    coinType: coinTypeB,
  });

  const initialSqrtPrice = TickMath.priceToSqrtPriceX64(
    d(initialPrice),
    coinTypeADecimals,
    coinTypeBDecimals,
  ).toString();

  const {
    lowerTick: tickLower,
    upperTick: tickUpper,
    tickSpacing,
  } = cetusPM.getTickValues(
    TickMath.sqrtPriceX64ToTickIndex(new BN(initialSqrtPrice)),
    CETUS_FEE_TIERS[feeTier],
  );

  // Convert slippage % to bps. 0.01 means 1%
  const slippageBps = slippagePercentage / 100;
  const isFixedAmountA = coinTypeA === coinA;

  // Append correct decimals to the amount
  const fixCoinAmount =
    coinTypeADepositAmount *
    10 ** (isFixedAmountA ? coinTypeADecimals : coinTypeBDecimals);

  const liquidityInput = ClmmPoolUtil.estLiquidityAndcoinAmountFromOneAmounts(
    tickLower,
    tickUpper,
    new BN(fixCoinAmount),
    isFixedAmountA,
    true,
    slippageBps,
    new BN(initialSqrtPrice),
  );

  return {
    slippage: slippageBps,
    tick_lower: tickLower,
    tick_upper: tickUpper,
    fix_amount_a: isFixedAmountA,
    coinTypeA,
    coinTypeB,
    amount_a: liquidityInput.tokenMaxA.toNumber(),
    amount_b: liquidityInput.tokenMaxB.toNumber(),
    initialize_sqrt_price: initialSqrtPrice,
    tick_spacing: tickSpacing,
    metadata_a: (await coinMetadataAPromise)?.id ?? "",
    metadata_b: (await coinMetadataBPromise)?.id ?? "",
    uri: "",
  };
}
