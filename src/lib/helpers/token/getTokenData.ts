import { ChainIdentifier, ChainIdentifierType } from "@/types/chain";
import { goPlusLabsApiV1 } from "../../api";
import { GoPlusLabsTokenData, GoPlusLabsTokenDataResult } from "./types";
import { getTokenAddressFromTicker } from "./getTokenAddressFromTicker";

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
