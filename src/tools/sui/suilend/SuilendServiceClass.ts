import { BaseCacheStore } from "@/lib/classes/cache/BaseCacheStore";
import { SuilendClient } from "@suilend/sdk";

export interface SuilendServiceInterface extends BaseCacheStore {
  suilendClient?: SuilendClient;

  /**
   * Deposit assets into the suilend market
   * @param amount - The amount of assets to deposit
   * @param coinType - The coin type of the assets to deposit excluding decimals
   * @returns The transaction hash of the deposit
   */
  depositAsset(amount: number, coinType: string): Promise<string>;

  /**
   * Initialize the Suilend service
   */
  initialize(): Promise<void>;

  /**
   * Withdraws all deposited asset of coinType from the suilend market
   * @param coinType - The coin type of the assets to withdraw
   * @returns The transaction hash of the withdrawal
   */
  withdrawAsset(coinType: string): Promise<string>;

  /**
   * Get available reserves in the suilend market
   * @returns Array of filtered reserves that are not deprecated and have deposit limit > 0
   */
  getReserves(): Promise<any[]>;

  /**
   * Get user deposits in the suilend market
   * @returns Array of user deposits with amounts and related information
   */
  getDeposits(): Promise<
    Array<{
      coinType: string;
      depositedAmount: string;
      depositedAmountUsd: string;
      cTokenAmount: string;
    }>
  >;
}
