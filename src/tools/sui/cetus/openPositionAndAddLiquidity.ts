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

  const { digest } = await agent.client.signAndExecuteTransaction({
    transaction: createAddLiquidityTransactionPayload,
    signer: agent.wallet,
  });

  const response = await agent.client.waitForTransaction({
    digest,
  });

  return response.digest;
};
