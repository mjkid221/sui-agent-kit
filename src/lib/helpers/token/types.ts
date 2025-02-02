import { ChainIdentifier, ChainIdentifierType } from "@/types/chain";

// Auto-generated from response of dexscreener API
export interface DexScreenerTokenType {
  schemaVersion: string;
  pairs: DexScreenerTokenPair[];
}

export interface DexScreenerTokenPair {
  chainId: string;
  dexId: string;
  url: string;
  pairAddress: string;
  labels: string[];
  baseToken: EToken;
  quoteToken: EToken;
  priceNative: string;
  priceUsd: string;
  liquidity: Liquidity;
  fdv: number;
  marketCap: number;
  pairCreatedAt: number;
  info: Info;
  boosts: Boosts;
}

interface EToken {
  address: string;
  name: string;
  symbol: string;
}

interface Boosts {
  active: number;
}

interface Info {
  imageUrl: string;
  websites: Website[];
  socials: Social[];
}

interface Social {
  platform: string;
  handle: string;
}

interface Website {
  url: string;
}

interface Liquidity {
  usd: number;
  base: number;
  quote: number;
}

/**
 * Chain identifiers used by DexScreener API.
 * The keys of this enum are used to validate the ChainIdentifier type in @/types/chain/id.ts.
 * Any changes to the keys here must be reflected in ChainIdentifier.
 */
export enum DexScreenerChainId {
  SUI = "sui",
  SOLANA = "solana",
  ETHEREUM = "ethereum",
  BSC = "bsc",
  POLYGON = "polygon",
  ARBITRUM = "arbitrum",
  AVALANCHE = "avalanche",
  FANTOM = "fantom",
  OPTIMISM = "optimism",
}

interface GoPlusLabsEvmTokenData {
  anti_whale_modifiable: string;
  buy_tax: string;
  can_take_back_ownership: string;
  cannot_buy: string;
  cannot_sell_all: string;
  creator_address: string;
  creator_balance: string;
  creator_percent: string;
  dex: Array<{
    liquidity_type: string;
    name: string;
    liquidity: string;
    pair: string;
  }>;
  holders: Array<{
    address: string;
    tag: string;
    is_contract: number;
    balance: string;
    percent: string;
    is_locked: number;
  }>;
  is_in_cex: {
    listed: string;
    cex_list: string[];
  };
  is_mintable: string;
  token_name: string;
  token_symbol: string;
  total_supply: string;
}

interface GoPlusLabsSuiTokenData {
  name: string;
  symbol: string;
  total_supply: string;
  creator: string;
  decimals: number;
  mintable: {
    cap_owner: string;
    value: string;
  };
  blacklist: {
    cap_owner: string;
    value: string;
  };
  contract_upgradeable: {
    cap_owner: string;
    value: string;
  };
  metadata_modifiable: {
    cap_owner: string;
    value: string;
  };
  trusted_token: string;
}

export interface GoPlusLabsTokenData<T = ChainIdentifierType> {
  code: number;
  message: string;
  result: {
    [key: string]: T extends typeof ChainIdentifier.ETHEREUM
      ? Partial<GoPlusLabsEvmTokenData>
      : T extends typeof ChainIdentifier.SUI
        ? Partial<GoPlusLabsSuiTokenData>
        : never;
  };
}

export type GoPlusLabsTokenDataResult<T = ChainIdentifierType> =
  GoPlusLabsTokenData<T>["result"];
