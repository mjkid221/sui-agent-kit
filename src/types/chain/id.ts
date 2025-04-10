import { DexScreenerChainId } from "@/lib/helpers/token/types";

/**
 * Type representing valid blockchain network keys supported by DexScreener.
 * This ensures type safety by only allowing keys that exist in DexScreenerChainId.
 */
type ValidChainKeys = keyof typeof DexScreenerChainId;

/**
 * Mapping of supported blockchain networks to their respective chain identifiers.
 * - SUI: Native Sui network identifier
 * - SOLANA: Native Solana network identifier
 * - ETHEREUM: EVM chain ID for Ethereum mainnet
 *
 * This object serves as the source of truth for chain identifiers across the application.
 */
export const ChainIdentifier = {
  SUI: "sui",
  SOLANA: "solana",
  ETHEREUM: "1",
} as const satisfies Partial<Record<ValidChainKeys, string>>;

/**
 * Type representing valid chain identifier values.
 * This type can be used to enforce type safety when working with chain IDs throughout the application.
 */
export type ChainIdentifierType =
  (typeof ChainIdentifier)[keyof typeof ChainIdentifier];
