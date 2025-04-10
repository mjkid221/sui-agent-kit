import {
  getDepositShare,
  ParsedObligation,
  ParsedPoolReward,
  ParsedReserve,
  RewardMap,
  RewardSummary,
  Side,
  WAD,
} from "@suilend/sdk";

import { CoinMetadata } from "@mysten/sui/client";
import BigNumber from "bignumber.js";
import { ObligationClaim } from "./types";
import { ms } from "ms-extended";

const MS_PER_YEAR = ms("1y");

const getDepositShareUsd = (reserve: ParsedReserve, share: BigNumber) =>
  getDepositShare(reserve, share).times(reserve.price);

export const getBorrowShare = (reserve: ParsedReserve, share: BigNumber) =>
  share.div(10 ** reserve.mintDecimals).times(reserve.cumulativeBorrowRate);
const getBorrowShareUsd = (reserve: ParsedReserve, share: BigNumber) =>
  getBorrowShare(reserve, share).times(reserve.price);

export const formatRewards = (
  parsedReserveMap: Record<string, ParsedReserve>,
  coinMetadataMap: Record<string, CoinMetadata>,
  priceMap: Record<string, BigNumber | undefined>,
  obligations?: ParsedObligation[],
) => {
  const nowMs = Date.now();
  const rewardMap: RewardMap = {};

  const getRewardSummary = (
    reserve: ParsedReserve,
    poolReward: ParsedPoolReward,
    side: Side,
  ) => {
    const rewardCoinMetadata = coinMetadataMap[poolReward.coinType];
    const rewardPrice = priceMap?.[poolReward.coinType];

    const isActive =
      nowMs >= poolReward.startTimeMs && nowMs < poolReward.endTimeMs;

    const aprPercent = rewardPrice
      ? BigNumber(poolReward.totalRewards.toString())
          .times(rewardPrice)
          .times(
            new BigNumber(MS_PER_YEAR).div(
              poolReward.endTimeMs - poolReward.startTimeMs,
            ),
          )
          .div(
            side === Side.DEPOSIT
              ? getDepositShareUsd(
                  reserve,
                  new BigNumber(
                    reserve.depositsPoolRewardManager.totalShares.toString(),
                  ),
                )
              : getBorrowShareUsd(
                  reserve,
                  new BigNumber(
                    reserve.borrowsPoolRewardManager.totalShares.toString(),
                  ),
                ),
          )
          .times(100)
      : undefined;
    const perDay = rewardPrice
      ? undefined
      : BigNumber(poolReward.totalRewards.toString())
          .times(
            new BigNumber(MS_PER_YEAR).div(
              poolReward.endTimeMs - poolReward.startTimeMs,
            ),
          )
          .div(365)
          .div(
            side === Side.DEPOSIT
              ? getDepositShare(
                  reserve,
                  new BigNumber(
                    reserve.depositsPoolRewardManager.totalShares.toString(),
                  ),
                )
              : getBorrowShare(
                  reserve,
                  new BigNumber(
                    reserve.borrowsPoolRewardManager.totalShares.toString(),
                  ),
                ),
          );

    return {
      stats: {
        id: poolReward.id,
        isActive,
        rewardIndex: poolReward.rewardIndex,
        reserve,
        rewardCoinType: poolReward.coinType,
        mintDecimals: poolReward.mintDecimals,
        price: rewardPrice,
        symbol: rewardCoinMetadata.symbol,
        iconUrl: rewardCoinMetadata.iconUrl,
        aprPercent,
        perDay,
        side,
      },
      obligationClaims: Object.fromEntries(
        (obligations ?? [])
          .map((obligation) => {
            const claim = getObligationClaim(
              obligation,
              poolReward,
              side === Side.DEPOSIT
                ? reserve.depositsPoolRewardManager.id
                : reserve.borrowsPoolRewardManager.id,
              reserve.arrayIndex,
            );
            if (!claim) {
              return undefined;
            }

            return [obligation.id, claim];
          })
          .filter(Boolean) as [string, ObligationClaim][],
      ),
    };
  };

  Object.values(parsedReserveMap).forEach((reserve) => {
    const depositRewards = reserve.depositsPoolRewardManager.poolRewards.map(
      (poolReward) => getRewardSummary(reserve, poolReward, Side.DEPOSIT),
    ) as RewardSummary[];

    const borrowRewards = reserve.borrowsPoolRewardManager.poolRewards.map(
      (poolReward) => getRewardSummary(reserve, poolReward, Side.BORROW),
    ) as RewardSummary[];

    rewardMap[reserve.coinType] = {
      [Side.DEPOSIT]: depositRewards,
      [Side.BORROW]: borrowRewards,
    };
  });

  return rewardMap;
};

const getObligationClaim = (
  obligation: ParsedObligation,
  poolReward: ParsedPoolReward,
  reservePoolManagerId: string,
  reserveArrayIndex: bigint,
) => {
  const userRewardManager = obligation.original.userRewardManagers.find(
    (urm) => urm.poolRewardManagerId === reservePoolManagerId,
  );
  if (!userRewardManager) {
    return;
  }

  const userReward = userRewardManager.rewards[poolReward.rewardIndex];
  if (!userReward) {
    return;
  }

  return {
    claimableAmount: userReward?.earnedRewards
      ? new BigNumber(userReward.earnedRewards.value.toString())
          .div(WAD)
          .div(10 ** poolReward.mintDecimals)
      : new BigNumber(0),
    reserveArrayIndex,
  };
};
