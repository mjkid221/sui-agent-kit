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

  const { digest } =
    await agent.wallet.signAndSendTransaction(creatPoolPayload);

  return digest;
};
