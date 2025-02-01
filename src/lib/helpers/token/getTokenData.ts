import { ChainIdentifier, ChainIdentifierType } from "@/types/chain";
import { dexScreenerApi, goPlusLabsApiV1 } from "../../api";
import {
  DexScreenerChainId,
  DexScreenerTokenType,
  GoPlusLabsTokenData,
  GoPlusLabsTokenDataResult,
} from "./types";
import { getEnumKey } from "@/lib/utils/enum";

const getGoPlusLabsChainUrlPath = (chain: ChainIdentifierType) => {
  switch (chain) {
    case ChainIdentifier.SUI:
      return "/sui/token_security";
    case ChainIdentifier.SOLANA:
      return "/solana/token_security";
    default:
      return `/token_security/${chain}`;
  }
};

export const getTokenDataByAddress = async (
  address: string,
  chain: ChainIdentifierType,
) => {
  try {
    const { data } = await goPlusLabsApiV1.get<
      GoPlusLabsTokenData<ChainIdentifierType>
    >(getGoPlusLabsChainUrlPath(chain), {
      params: {
        contract_addresses: address,
      },
    });

    // return first object in result
    return data.result[
      Object.keys(data.result)[0]
    ] as GoPlusLabsTokenDataResult<ChainIdentifierType>;
  } catch {
    return null;
  }
};

export const getTokenAddressFromTicker = async (
  ticker: string,
  chainIdentifier: ChainIdentifierType,
) => {
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
  const chainKey = getEnumKey(ChainIdentifier, chainIdentifier);
  if (!chainKey) {
    return null;
  }

  const dexScreenerChainId = DexScreenerChainId[chainKey];

  // Filter pairs by fdv and ticker and return highest fdv
  const topPairs = data.pairs
    .filter(
      (pair) =>
        pair.chainId === dexScreenerChainId &&
        pair.baseToken.symbol.toLowerCase() === ticker.toLowerCase(),
    )
    .sort((a, b) => (b.fdv || 0) - (a.fdv || 0));

  return topPairs[0]?.baseToken.address ?? null;
};

export const getTokenDataByTicker = async (
  ticker: string,
  chainIdentifier: ChainIdentifierType,
) => {
  const address = await getTokenAddressFromTicker(ticker, chainIdentifier);
  if (!address) {
    return null;
  }

  return getTokenDataByAddress(address, chainIdentifier);
};
