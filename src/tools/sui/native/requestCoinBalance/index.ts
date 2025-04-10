import { SuiAgentKit } from "@/agent/sui";

export const requestCoinBalance = async (
  agent: SuiAgentKit,
  coinType?: string,
  walletAddress?: string,
): Promise<number> => {
  const balance = await agent.client.getBalance({
    owner: walletAddress ?? agent.wallet.toSuiAddress(),
    coinType,
  });

  const decimals = await agent.requestGetCoinDecimals(coinType);
  return Number.parseInt(balance.totalBalance) / 10 ** decimals;
};
