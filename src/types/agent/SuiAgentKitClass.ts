import { TokenCreationInterface } from "@/tools/sui/native/requestDeployCoin/types";
import { BaseAgentKitClass } from "./BaseAgentKitClass";
import { SuinsClient } from "@/tools/sui";
import { SuiClient } from "@mysten/sui/client";
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";
import { CacheStoreConfig } from "@/lib/classes/cache/types";

export type SuiAgentConfig = {
  /**
   * The fixed fee for deploying a coin. E.g. 0.5 for 0.5 SUI
   */
  coinDeployFixedFee?: number;

  /**
   * The percentage fee for each trade. E.g. 1 for 1%
   */
  tradeCommissionFeePercentage?: number;

  /**
   * Treasury address for commissions/fees
   */
  treasury?: string;

  /**
   * Cache configuration for the agent. Leave empty to use default in-memory caching.
   * @property {CacheStoreType} cacheStoreType - The type of cache store to use:
   *   - "redis": Redis-based caching
   *   - "lru": LRU-based caching
   *   - "memory": Simple in-memory caching
   *
   * For Redis cache (cacheStoreType: "redis"):
   * @property {string} externalDbUrl - Redis connection URL
   * @property {string} [namespace] - Optional namespace for Redis keys
   *
   * For LRU cache (cacheStoreType: "lru"):
   * @property {number} [lruSize] - Maximum number of items to store in the LRU cache
   * @property {number} [ttl] - Time-to-live in seconds for cached items
   *
   * For Memory cache (cacheStoreType: "memory"):
   * No additional configuration needed
   *
   * @example Redis configuration
   * ```typescript
   * {
   *   cacheStoreType: "redis",
   *   externalDbUrl: "redis://localhost:6379",
   *   namespace: "my-cache"
   * }
   * ```
   *
   * @example LRU configuration
   * ```typescript
   * {
   *   cacheStoreType: "lru",
   *   lruSize: 1000,
   *   ttl: 3600
   * }
   * ```
   *
   * @example Memory configuration
   * ```typescript
   * {
   *   cacheStoreType: "memory"
   * }
   * ```
   */
  cache?: CacheStoreConfig;
};

export interface SuiAgentKitClass extends BaseAgentKitClass {
  wallet: Ed25519Keypair;
  client: SuiClient;
  suinsClient: SuinsClient;
  agentNetwork: "testnet" | "mainnet";
  config: SuiAgentConfig;

  /**
   * @param tokenInfo - The information of the token to be deployed
   * @param tokenInfo.name - The name of the token
   * @param tokenInfo.symbol - The symbol of the token
   * @param tokenInfo.decimals - The decimals of the token
   * @param tokenInfo.totalSupply - The total supply of the token. E.g. 1_000_000_000 for 1B
   * @param tokenInfo.fixedSupply - Whether the token is fixed supply
   * @param tokenInfo.description - The description of the token
   * @param feeConfig - Optional configuration for fees
   * @param feeConfig.treasury - The address of the treasury
   * @param feeConfig.fee - The fee of the transaction. E.g. 1_000_000_000 for 1 SUI
   * @returns The module address
   */
  requestDeployCoin(
    tokenInfo: TokenCreationInterface,
    feeConfig?: {
      treasury: string;
      fee: number;
    },
  ): Promise<string>;
}
