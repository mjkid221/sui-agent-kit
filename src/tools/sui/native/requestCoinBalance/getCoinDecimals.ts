import { SUI_DECIMALS, SUI_TYPE_ARG } from "@mysten/sui/utils";
import { SuiAgentKit } from "@/agent/sui";

/**
 * Get the decimals of a coin. Unspecified coin type will return the default SUI decimals.
 * @param agent - SuiAgentKit instance
 * @param coinType - The coin type
 * @returns The decimals of the coin
 */
export const getCoinDecimals = async (
  agent: SuiAgentKit,
  coinType: string = SUI_TYPE_ARG,
): Promise<number> => {
  if (coinType === SUI_TYPE_ARG) {
    return SUI_DECIMALS;
  }

  const decimals =
    (
      await agent.client.getCoinMetadata({
        coinType,
      })
    )?.decimals ?? SUI_DECIMALS;

  return Number(decimals);
};
