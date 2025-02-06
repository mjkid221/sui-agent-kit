import { SuiAgentKit } from "@/agent/sui";
import { sortCoin } from "./sortCoin";
import { ClmmPoolUtil, d, TickMath } from "@cetusprotocol/cetus-sui-clmm-sdk";
import { CETUS_FEE_TIERS } from "./fees";
import BN from "bn.js";

export const requestCreateClmmPool = async (
  agent: SuiAgentKit,
  coinTypeA: string,
  coinTypeADepositAmount: number,
  coinTypeB: string,
  initialPrice: number,
  feeTier: keyof typeof CETUS_FEE_TIERS,
  slippage: number = 5, // 5%
) => {
  const [coinA, coinB] = sortCoin(coinTypeA, coinTypeB);
  const [coinTypeADecimals, coinTypeBDecimals] = await Promise.all([
    agent.requestGetCoinDecimals(coinA),
    agent.requestGetCoinDecimals(coinB),
  ]);
  const coinMetadataAPromise = agent.client.getCoinMetadata({
    coinType: coinTypeA,
  });
  const coinMetadataBPromise = agent.client.getCoinMetadata({
    coinType: coinTypeB,
  });

  const initialSqrtPrice = TickMath.priceToSqrtPriceX64(
    d(initialPrice),
    coinTypeADecimals,
    coinTypeBDecimals,
  ).toString();

  const tickSpacing = CETUS_FEE_TIERS[feeTier];
  const currentTickIndex = TickMath.sqrtPriceX64ToTickIndex(
    new BN(initialSqrtPrice),
  );
  const tickLower = TickMath.getPrevInitializableTickIndex(
    new BN(currentTickIndex).toNumber(),
    new BN(tickSpacing).toNumber(),
  );
  const tickUpper = TickMath.getNextInitializableTickIndex(
    new BN(currentTickIndex).toNumber(),
    new BN(tickSpacing).toNumber(),
  );
  // Convert slippage to bps
  const slippageBps = slippage / 100;
  const isFixedAmountA = coinTypeA === coinA;

  const fixCoinAmount = coinTypeADepositAmount;

  const liquidityInput = ClmmPoolUtil.estLiquidityAndcoinAmountFromOneAmounts(
    tickLower,
    tickUpper,
    new BN(fixCoinAmount),
    isFixedAmountA,
    true,
    slippageBps,
    new BN(initialSqrtPrice),
  );
  const amountA = isFixedAmountA
    ? fixCoinAmount
    : liquidityInput.tokenMaxA.toNumber();

  const amountB = isFixedAmountA
    ? liquidityInput.tokenMaxB.toNumber()
    : fixCoinAmount;

  const creatPoolPayload =
    await agent.cetusSDK.Pool.createPoolTransactionPayload({
      coinTypeA,
      coinTypeB,
      tick_spacing: tickSpacing,
      initialize_sqrt_price: initialSqrtPrice,
      uri: "",
      amount_a: amountA,
      amount_b: amountB,
      fix_amount_a: isFixedAmountA,
      tick_lower: tickLower,
      tick_upper: tickUpper,
      metadata_a: (await coinMetadataAPromise)?.id ?? "",
      metadata_b: (await coinMetadataBPromise)?.id ?? "",
      slippage: slippageBps,
    });

  const { digest } = await agent.client.signAndExecuteTransaction({
    transaction: creatPoolPayload,
    signer: agent.wallet,
  });

  const response = await agent.client.waitForTransaction({
    digest,
  });

  return response.digest;
};
