import { getFaucetHost, requestSuiFromFaucetV0 } from "@mysten/sui/faucet";
import { SuiAgentKit } from "../../agent/sui";

export const requestFaucetFunds = async (
  agent: SuiAgentKit,
): Promise<string> => {
  if (agent.agentNetwork === "mainnet") {
    throw new Error("Cannot request faucet funds on mainnet");
  }

  const response = await requestSuiFromFaucetV0({
    host: getFaucetHost(agent.agentNetwork),
    recipient: agent.wallet.getPublicKey().toSuiAddress(),
  });
  return response.transferredGasObjects[0].transferTxDigest;
};
