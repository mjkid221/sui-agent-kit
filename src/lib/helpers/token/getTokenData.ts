import { ChainIdentifier, ChainIdentifierType } from "@/types/chain";
import { dexScreenerApi, goPlusLabsApiV1 } from "../../api";
import {
  DexScreenerChainId,
  DexScreenerTokenPair,
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
  } catch (err: any) {
    throw new Error(`Error fetching token data: ${err.message}`);
  }
};

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
      convertChainIdToDexScreenerFormat(chainIdentifier);

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

export const getTokenDataByTicker = async (
  ticker: string,
  chainIdentifier: ChainIdentifierType,
): Promise<GoPlusLabsTokenDataResult<ChainIdentifierType>> => {
  const address = await getTokenAddressFromTicker(ticker, chainIdentifier);
  if (!address) {
    throw new Error(
      `No token address found for ${ticker} on ${chainIdentifier}`,
    );
  }

  return getTokenDataByAddress(address, chainIdentifier);
};

export const getTokenPriceByAddress = async (
  address: string,
  chainIdentifier: ChainIdentifierType,
) => {
  try {
    const { data } = await dexScreenerApi.get<DexScreenerTokenPair[]>(
      `/tokens/v1/${convertChainIdToDexScreenerFormat(chainIdentifier)}/${address}`,
    );

    if (data.length === 0) {
      throw new Error(
        `No token data found for ${address} on ${chainIdentifier}`,
      );
    }

    return data[0].priceUsd;
  } catch (err: any) {
    throw new Error(`Error fetching token price: ${err.message}`);
  }
};

/**
 * Convert a chain identifier used by the Kit to the format used by DexScreener
 * @param chain - The chain identifier
 * @returns The chain identifier in DexScreener format
 */
const convertChainIdToDexScreenerFormat = (chain: ChainIdentifierType) => {
  const chainKey = getEnumKey(ChainIdentifier, chain);
  if (!chainKey) {
    throw new Error(`Unsupported chain: ${chain}`);
  }

  return DexScreenerChainId[chainKey];
};
