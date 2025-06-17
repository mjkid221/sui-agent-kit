import { SuiAgentKit } from "@/agent/sui";

export const requestGetPoolPositions = async (agent: SuiAgentKit) => {
  const pools = await agent.cetusPoolManager.cetusSDK.Position.getPositionList(
    agent.wallet.publicKey.toSuiAddress(),
  );
  return pools;
};
