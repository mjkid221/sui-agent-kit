import { SuiAgentKit } from "@/agent/sui";
import { CETUS_FEE_TIERS } from "./fees";
import { createClmmPool } from "./createClmmPool";
import CetusClmmSDK, {
  adjustForCoinSlippage,
  ClmmPoolUtil,
  initCetusSDK,
  Percentage,
  Position,
  TickMath,
} from "@cetusprotocol/cetus-sui-clmm-sdk";
import { getTickValues } from "./getTickValues";
import {
  getEstimatedLiquidityFromParams,
  getEstimatedLiquidityFromPool,
} from "./getLiquidityPairInput";
import { BaseCacheStore } from "@/lib/classes/cache/BaseCacheStore";
import {
  createLiquidityPairInputWithExistingPoolCacheKey,
  createLiquidityPairInputWithNewPoolCacheKey,
} from "@/lib/helpers/cache/sui/cetusCacheKeys";
import { ms } from "ms-extended";
import { openPositionAndAddLiquidity } from "./openPositionAndAddLiquidity";
import {
  LiquidityInputWithExistingPool,
  LiquidityInputWithNewPool,
} from "./types";
import BN from "bn.js";

/**
 * CetusPoolManager is a wrapper around the Cetus SDK that provides a more user-friendly interface for creating and managing pools
 */
export class CetusPoolManager extends BaseCacheStore {
  public readonly cetusSDK: CetusClmmSDK;
  constructor(
    public readonly agent: SuiAgentKit,
    agentNetwork: "testnet" | "mainnet",
    fullNodeUrl: string,
  ) {
    super();
    this.cetusSDK = initCetusSDK({
      network: agentNetwork,
      fullNodeUrl,
    });
    this.cetusSDK.senderAddress = this.agent.wallet.toSuiAddress();
  }

  /**
   * Create a new pool in the Cetus protocol
   * @param coinTypeA - The coin type of the first token
   * @param coinTypeADepositAmount - The amount of the first token to deposit without decimals.
   * @param coinTypeB - The coin type of the second token
   * @param initialPrice - The initial price of the coinTypeA in relative to coinTypeB.
   * @param feeTier - The fee tier of the pool. Refer to CETUS_FEE_TIERS
   * @param slippagePercentage - The slippage % of the pool. E.g. 5 = 5%
   * @returns The digest of the transaction
   * @example
   * ```ts
   * // Create a pool with 100 SUI with a price of 1 SUI = 0.1 USDC (so roughly 10 USDC deposit required) with a tier 1 fee and 5% slippage
   * const digest = await cetusPoolManager.createClmmPool("0x2::sui::SUI", 100, "0xdba34672e30cb065b1f93e3ab55318768fd6fef66c15942c9f7cb846e2f900e7::usdc::USDC", 0.1, 1, 5);
   * ```
   */
  async createClmmPool(
    coinTypeA: string,
    coinTypeADepositAmount: number,
    coinTypeB: string,
    initialPrice: number,
    feeTier: keyof typeof CETUS_FEE_TIERS,
    slippagePercentage: number,
  ) {
    const { key, value } = await this.getEstimatedLiquidityPairInputWithNewPool(
      coinTypeA,
      coinTypeADepositAmount,
      coinTypeB,
      initialPrice,
      feeTier,
      slippagePercentage,
    );
    const digest = await createClmmPool(this.agent, value);
    await this.cache.del(key);
    return {
      txDigest: digest,
      coinTypeA: value.coinTypeA,
      coinTypeB: value.coinTypeB,
      coinTypeADepositAmount: value.amount_a,
      coinTypeBDepositAmount: value.amount_b,
    };
  }

  /**
   * Open a position and add liquidity to the pool
   * @param poolId - The ID of the pool
   * @param coinTypeA - The coin type of the first token
   * @param amountA - The amount of the first token to deposit without decimals.
   * @param slippagePercentage - The slippage % of the pool. E.g. 5 = 5%
   * @returns The digest of the transaction
   */
  async openPositionAndAddLiquidity(
    poolId: string,
    coinTypeA: string,
    amountA: number,
    slippagePercentage: number,
    existingPositionId?: string,
  ) {
    const { value, key } =
      await this.getEstimatedLiquidityPairInputWithExistingPool(
        poolId,
        amountA,
        coinTypeA,
        slippagePercentage,
        existingPositionId,
      );
    const digest = await openPositionAndAddLiquidity(this.agent, value);
    await this.cache.del(key);
    return digest;
  }

  /**
   * Get all open pool positions of the user
   * @returns {Position[]} The positions of the user
   */
  getPoolPositions(): Promise<Position[]> {
    return this.cetusSDK.Position.getPositionList(
      this.agent.wallet.toSuiAddress(),
    );
  }

  /**
   * Get the pool info of a pool
   * @param poolID - The ID of the pool
   * @returns The pool info
   */
  getPoolInfo(poolID: string) {
    return this.cetusSDK.Pool.getPool(poolID);
  }

  async getPoolByCoins(
    coinTypeA: string,
    coinTypeB: string,
    feeTier?: keyof typeof CETUS_FEE_TIERS,
  ) {
    const pools = await this.cetusSDK.Pool.getPoolByCoins([
      coinTypeA,
      coinTypeB,
    ]);
    if (feeTier) {
      return (
        pools.find((pool) => Number(pool.fee_rate) === feeTier * 100) ?? null
      );
    }
    return pools[0] ?? null;
  }

  /**
   * Close a pool position on Cetus
   * @param positionId - The ID of the position
   * @returns The digest of the transaction
   */
  async closePoolPosition(positionId: string) {
    const position = await this.cetusSDK.Position.getPositionById(positionId);
    const pool = await this.cetusSDK.Pool.getPool(position.pool);
    const lowerSqrtPrice = TickMath.tickIndexToSqrtPriceX64(
      position.tick_lower_index,
    );
    const upperSqrtPrice = TickMath.tickIndexToSqrtPriceX64(
      position.tick_upper_index,
    );

    const liquidity = new BN(position.liquidity);
    const slippageTolerance = new Percentage(new BN(5), new BN(100));
    const curSqrtPrice = new BN(pool.current_sqrt_price);
    const coinAmounts = ClmmPoolUtil.getCoinAmountFromLiquidity(
      liquidity,
      curSqrtPrice,
      lowerSqrtPrice,
      upperSqrtPrice,
      false,
    );
    const { tokenMaxA, tokenMaxB } = adjustForCoinSlippage(
      coinAmounts,
      slippageTolerance,
      false,
    );
    const rewards = await this.cetusSDK.Rewarder.posRewardersAmount(
      position.pool,
      pool.position_manager.positions_handle,
      position.pos_object_id,
    );
    const rewardCoinTypes = rewards
      .filter((item) => Number(item.amount_owed) > 0)
      .map((item) => item.coin_address);

    const closePositionTransactionPayload =
      await this.cetusSDK.Position.closePositionTransactionPayload({
        coinTypeA: pool.coinTypeA,
        coinTypeB: pool.coinTypeB,
        min_amount_a: tokenMaxA.toString(),
        min_amount_b: tokenMaxB.toString(),
        rewarder_coin_types: [...rewardCoinTypes],
        pool_id: pool.poolAddress,
        pos_id: position.pos_object_id,
        collect_fee: true,
      });

    const digest = await this.agent.signExecuteAndWaitForTransaction(
      closePositionTransactionPayload,
    );
    return digest;
  }

  getTickValues(currentTickIndex: number, tickSpacing: number) {
    return getTickValues(currentTickIndex, tickSpacing);
  }

  /**
   * Get the liquidity pair input for an existing pool. The results are cached for 1 minute.
   * @param poolId - The ID of the pool
   * @param inputAmount - The amount of the input token to deposit without decimals.
   * @param inputCoinType - The coin type of the input token
   * @param slippagePercentage - The slippage % of the pool. E.g. 5 = 5%
   * @returns {LiquidityInputWithExistingPool} The liquidity pair object
   */
  async getEstimatedLiquidityPairInputWithExistingPool(
    poolId: string,
    inputAmount: number,
    inputCoinType: string,
    slippagePercentage: number,
    existingPositionId?: string,
  ): Promise<{
    key: string;
    value: LiquidityInputWithExistingPool;
  }> {
    const cacheKey = createLiquidityPairInputWithExistingPoolCacheKey(
      poolId,
      inputAmount,
      inputCoinType,
      slippagePercentage,
      existingPositionId,
    );
    const value = await this.cache.withCache(
      cacheKey,
      () =>
        getEstimatedLiquidityFromPool(
          this,
          poolId,
          inputAmount,
          inputCoinType,
          slippagePercentage,
          existingPositionId,
        ),
      ms("1m"),
    );
    return {
      key: cacheKey,
      value,
    };
  }

  /**
   * Get the liquidity pair input for a new pool. The results are cached for 1 minute.
   * @param coinTypeA - The coin type of the first token
   * @param coinTypeADepositAmount - The amount of the first token to deposit without decimals.
   * @param coinTypeB - The coin type of the second token
   * @param initialPrice - The initial price of the coinTypeA in relative to coinTypeB.
   * @param feeTier - The fee tier of the pool. Refer to CETUS_FEE_TIERS
   * @param slippagePercentage - The slippage % of the pool. E.g. 5 = 5%
   * @returns {LiquidityInputWithNewPool} The liquidity pair object
   */
  async getEstimatedLiquidityPairInputWithNewPool(
    coinTypeA: string,
    coinTypeADepositAmount: number,
    coinTypeB: string,
    initialPrice: number,
    feeTier: keyof typeof CETUS_FEE_TIERS,
    slippagePercentage: number,
  ): Promise<{
    key: string;
    value: LiquidityInputWithNewPool;
  }> {
    const cacheKey = createLiquidityPairInputWithNewPoolCacheKey(
      coinTypeA,
      coinTypeADepositAmount,
      coinTypeB,
      initialPrice,
      feeTier,
      slippagePercentage,
    );
    const value = await this.cache.withCache(
      cacheKey,
      () =>
        getEstimatedLiquidityFromParams(
          this,
          coinTypeA,
          coinTypeADepositAmount,
          coinTypeB,
          initialPrice,
          feeTier,
          slippagePercentage,
        ),
      ms("1m"),
    );
    return {
      key: cacheKey,
      value,
    };
  }
}
