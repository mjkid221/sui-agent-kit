import { ChainIdentifierType } from "@/types/chain";

import { getEnumKey } from "@/lib/utils/enum";
import { ChainIdentifier } from "@/types/chain";
import { DexScreenerChainId } from "./types";

/**
 * Convert a chain identifier used by the Kit to the format used by DexScreener
 * @param chain - The chain identifier
 * @returns The chain identifier in DexScreener format
 */
export const convertChainIdToDexScreenerIdFormat = (
  chain: ChainIdentifierType,
) => {
  const chainKey = getEnumKey(ChainIdentifier, chain);
  if (!chainKey) {
    throw new Error(`Unsupported chain: ${chain}`);
  }

  return DexScreenerChainId[chainKey];
};
