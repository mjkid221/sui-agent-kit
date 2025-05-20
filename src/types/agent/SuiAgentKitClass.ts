import { SuinsClient } from "@/tools/sui";
import { SuiClient } from "@mysten/sui/client";
import { CacheStoreConfig } from "@/lib/classes/cache/types";
import { BaseAgentKitClass } from "./BaseAgentKitClass";
import { SuiWallet } from "../wallet/SuiWallet";
import { CetusPoolManager } from "@/tools/sui/cetus";
import { SuilendService } from "@/tools/sui/suilend";
import { Action } from "../action";
import { Plugin } from "../plugin";

export type SuiAgentConfig = {
  /**
   * Network configuration
   * @property {string} url - The RPC URL to use
   * @property {string} network - The environment to use. E.g. "testnet" or "mainnet"
   */
  rpc: {
    url: string;
    network: "testnet" | "mainnet";
  };

  commission?: {
    /**
     * The percentage fee for each trade. E.g. 1 for 1%
     */
    tradeCommissionFeePercentage: number;
    /**
     * The fixed fee for deploying a coin. E.g. 0.5 for 0.5 SUI
     */
    coinDeployFixedFee: number;
    /**
     * The treasury address for commissions/fees
     */
    treasury: string;
  };

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

/**
 * Sui-specific implementation of the agent kit
 */
export interface SuiAgentKitClass extends BaseAgentKitClass<SuiWallet> {
  client: SuiClient;
  suinsClient: SuinsClient;
  cetusPoolManager: CetusPoolManager;
  suilendService: SuilendService;
  config: SuiAgentConfig;

  /**
   * Registered plugins
   */
  plugins: Map<string, Plugin<SuiAgentKitClass>>;

  /**
   * All actions registered from plugins
   */
  actions: Map<string, Action<SuiAgentKitClass>>;

  /**
   * Register a plugin
   * @param plugin Plugin to register
   */
  registerPlugin(plugin: Plugin<SuiAgentKitClass>): Promise<void>;

  /**
   * Get an action by name
   * @param actionName Name of the action to get
   */
  getAction(actionName: string): Action<SuiAgentKitClass> | undefined;

  /**
   * Get all actions
   */
  getActions(): Action<SuiAgentKitClass>[];

  /**
   * Execute an action by name with the given input
   * @param actionName Name of the action to execute
   * @param input Input for the action
   */
  executeAction(
    actionName: string,
    input?: Record<string, unknown>,
  ): Promise<Record<string, unknown>>;
}
