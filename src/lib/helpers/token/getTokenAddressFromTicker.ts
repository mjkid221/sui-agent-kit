import { dexScreenerApi } from "@/lib/api";
import { ChainIdentifierType } from "@/types/chain";
import { DexScreenerTokenType } from "./types";
import { convertChainIdToDexScreenerIdFormat } from "./converChainIdToDexScreenerId";

export const getTokenAddressFromTicker = async (
  ticker: string,
  chainIdentifier: ChainIdentifierType,
) => {
  try {
    const { data } = await dexScreenerApi.get<DexScreenerTokenType>(
      `/latest/dex/search`,
      {
        params: {
          q: ticker,
        },
      },
    );

    if (!data.pairs || data.pairs.length === 0) {
      return null;
    }

    // Get the key name from ChainIdentifier enum
    const dexScreenerChainId =
      convertChainIdToDexScreenerIdFormat(chainIdentifier);

    // Filter pairs by fdv and ticker and return highest fdv
    const topPairs = data.pairs
      .filter(
        (pair) =>
          pair.chainId === dexScreenerChainId &&
          pair.baseToken.symbol.toLowerCase() === ticker.toLowerCase(),
      )
      .sort((a, b) => (b.fdv || 0) - (a.fdv || 0));

    return topPairs[0]?.baseToken.address ?? null;
  } catch (err: any) {
    throw new Error(`Error fetching token address: ${err.message}`);
  }
};
