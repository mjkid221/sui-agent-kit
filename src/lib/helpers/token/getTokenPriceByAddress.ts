import { dexScreenerApi } from "@/lib/api";
import { ChainIdentifierType } from "@/types/chain";
import { DexScreenerTokenPair } from "./types";
import { convertChainIdToDexScreenerIdFormat } from "./converChainIdToDexScreenerId";

export const getTokenPriceByAddress = async (
  address: string,
  chainIdentifier: ChainIdentifierType,
) => {
  try {
    const { data } = await dexScreenerApi.get<DexScreenerTokenPair[]>(
      `/tokens/v1/${convertChainIdToDexScreenerIdFormat(chainIdentifier)}/${address}`,
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
