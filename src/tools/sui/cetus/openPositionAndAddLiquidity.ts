import { SuiAgentKit } from "@/agent/sui";
import { LiquidityInputWithExistingPool } from "./types";

export const openPositionAndAddLiquidity = async (
  agent: SuiAgentKit,
  params: LiquidityInputWithExistingPool,
) => {
  const { slippage: slippageBps, curSqrtPrice } = params;
  const createAddLiquidityTransactionPayload =
    await agent.cetusPoolManager.cetusSDK.Position.createAddLiquidityFixTokenPayload(
      params,
      {
        slippage: slippageBps,
        curSqrtPrice: curSqrtPrice,
      },
    );

  const { digest } = await agent.wallet.signAndSendTransaction(
    createAddLiquidityTransactionPayload,
  );

  return digest;
};
