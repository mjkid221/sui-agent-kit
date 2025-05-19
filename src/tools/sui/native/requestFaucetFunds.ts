import { getFaucetHost, requestSuiFromFaucetV0 } from "@mysten/sui/faucet";
import { SuiAgentKit } from "@/agent/sui";

export const requestFaucetFunds = async (
  agent: SuiAgentKit,
): Promise<string> => {
  if (agent.config.rpc.network === "mainnet") {
    throw new Error("Cannot request faucet funds on mainnet");
  }

  const response = await requestSuiFromFaucetV0({
    host: getFaucetHost(agent.config.rpc.network),
    recipient: agent.wallet.publicKey.toSuiAddress(),
  });
  return response.transferredGasObjects[0].transferTxDigest;
};
