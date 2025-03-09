import { CoinMetadata } from "@mysten/sui/client";
import {
  ParsedLendingMarket,
  ParsedObligation,
  ParsedReserve,
  RewardMap,
  SuilendClient,
} from "@suilend/sdk";
import { ObligationOwnerCap } from "@suilend/sdk/_generated/suilend/lending-market/structs";
import { Reserve } from "@suilend/sdk/_generated/suilend/reserve/structs";
import BigNumber from "bignumber.js";

export interface AppData {
  suilendClient: SuilendClient;

  lendingMarket: ParsedLendingMarket;
  coinMetadataMap: Record<string, CoinMetadata>;

  refreshedRawReserves: Reserve<string>[];
  reserveMap: Record<string, ParsedReserve>;
  reserveCoinTypes: string[];
  reserveCoinMetadataMap: Record<string, CoinMetadata>;

  rewardPriceMap: Record<string, BigNumber | undefined>;
  rewardCoinTypes: string[];
  activeRewardCoinTypes: string[];
  rewardCoinMetadataMap: Record<string, CoinMetadata>;
}

export interface UserData {
  obligationOwnerCaps: ObligationOwnerCap<string>[];
  obligations: ParsedObligation[];
  rewardMap: RewardMap;
}

export type ObligationClaim = {
  claimableAmount: BigNumber;
  reserveArrayIndex: bigint;
};
