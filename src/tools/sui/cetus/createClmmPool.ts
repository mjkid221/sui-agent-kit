import { SuiAgentKit } from "@/agent/sui";
import { LiquidityInputWithNewPool } from "./types";

export const createClmmPool = async (
  agent: SuiAgentKit,
  params: LiquidityInputWithNewPool,
) => {
  const creatPoolPayload =
    await agent.cetusPoolManager.cetusSDK.Pool.createPoolTransactionPayload(
      params,
    );

  const { digest } = await agent.client.signAndExecuteTransaction({
    transaction: creatPoolPayload,
    signer: agent.wallet,
  });

  const response = await agent.client.waitForTransaction({
    digest,
  });

  return response.digest;
};
