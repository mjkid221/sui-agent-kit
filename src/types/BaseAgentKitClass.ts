export interface BaseAgentKitClass {
  requestFaucetFunds(): Promise<string>;
  requestGetBalance(
    coinOrTokenAddress?: string,
    walletAddress?: string,
  ): Promise<number>;
  requestTransferCoinOrToken(
    amount: number,
    to: string,
    coinOrTokenAddress?: string,
  ): Promise<string>;

  requestRegisterDomain(name: string, years: number): Promise<string>;

  requestResolveDomain(domain: string): Promise<string | null>;

  requestTrade(
    outputCoinOrTokenAddress: string,
    inputAmount: number,
    inputCoinOrTokenAddress?: string,
    slippageBps?: number,
  ): Promise<string>;
}
