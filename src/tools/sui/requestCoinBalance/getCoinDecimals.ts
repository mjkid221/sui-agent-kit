import { SUI_DECIMALS } from "@mysten/sui/utils";
import { SuiAgentKit } from "../../../agent/sui";

const cache = new Map<string, number>();

export const getCoinDecimals = async (
  agent: SuiAgentKit,
  coinType?: string,
): Promise<number> => {
  if (coinType && cache.has(coinType)) {
    return cache.get(coinType) ?? SUI_DECIMALS;
  }

  const decimals =
    (coinType
      ? (
          await agent.client.getCoinMetadata({
            coinType,
          })
        )?.decimals
      : SUI_DECIMALS) ?? SUI_DECIMALS;

  if (coinType) {
    cache.set(coinType, decimals);
  }

  return Number(decimals);
};
