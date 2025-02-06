import { SuiAgentKit } from "@/agent/sui";

export const requestGetPoolPositions = async (agent: SuiAgentKit) => {
  const pools = await agent.cetusSDK.Position.getPositionList(
    agent.wallet.toSuiAddress(),
  );
  return pools;
};
