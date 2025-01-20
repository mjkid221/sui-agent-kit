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
}
