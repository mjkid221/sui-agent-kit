import { GoPlusLabsTokenDataResult } from "@/lib/helpers/token/types";
import { ChainIdentifierType } from "../chain/id";

export interface BaseAgentKitClass {
  /**
   * Request funds from the faucet. Testnet only.
   * @returns The transaction hash
   */
  requestFaucetFunds(): Promise<string>;

  /**
   * Get the balance of a coin or token
   * @param coinOrTokenAddress - The address of the coin or token
   * @param walletAddress - The address of the wallet
   * @returns The balance of the coin or token
   */
  requestGetBalance(
    coinOrTokenAddress?: string,
    walletAddress?: string,
  ): Promise<number>;

  /**
   * Transfer a coin or token to another address
   * @param amount - The amount of the coin or token to transfer
   * @param to - The address to transfer the coin or token to
   * @param coinOrTokenAddress - The address of the coin or token to transfer
   * @returns The transaction hash
   */
  requestTransferCoinOrToken(
    amount: number,
    to: string,
    coinOrTokenAddress?: string,
  ): Promise<string>;

  /**
   * Register a domain on the blockchain
   * @param name - The name of the domain
   * @param years - The number of years to register the domain for
   * @returns The transaction hash
   */
  requestRegisterDomain(name: string, years: number): Promise<string>;

  /**
   * Resolve a domain to its owner
   * @param domain - The domain to resolve
   * @returns The resolved address (owner) of the domain
   */
  requestResolveDomain(domain: string): Promise<string | null>;

  /**
   * Trade a coin or token for another coin or token
   * @param outputCoinOrTokenAddress - The address of the coin or token to trade
   * @param inputAmount - The amount of the input coin or token (without decimals)
   * @param inputCoinOrTokenAddress - The address of the input coin or token
   * @param slippageBps - The slippage in bps
   * @returns The transaction hash
   */
  requestTrade(
    outputCoinOrTokenAddress: string,
    inputAmount: number,
    inputCoinOrTokenAddress?: string,
    slippageBps?: number,
  ): Promise<string>;

  /**
   * Get the data of an asset
   * @param coinType - The address of the asset
   * @returns The data of the asset
   */
  requestAssetDataByCoinType(
    coinType: string,
  ): Promise<GoPlusLabsTokenDataResult<ChainIdentifierType>>;

  /**
   * Get the data of an asset by its ticker
   * @param ticker - The ticker of the asset
   * @returns The data of the asset
   */
  requestAssetDataByTicker(
    ticker: string,
  ): Promise<GoPlusLabsTokenDataResult<ChainIdentifierType>>;

  /**
   * Get the price of an asset
   * @param coinType - The address of the asset
   * @returns The price of the asset
   */
  requestGetAssetPrice(coinType: string): Promise<string>;
}
