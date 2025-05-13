import { SuiAgentKit } from "@/agent/sui";
import { SuiAction } from "@/types/action";
import { z } from "zod";
import { formatGoPlusLabsSuiTokenData } from "@/tools/sui/goPlusLabs";

const inputSchema = z.object({
  ticker: z.string(),
});

const assetDataByTickerAction: SuiAction<typeof inputSchema> = {
  name: "ASSET_DATA_BY_TICKER_ACTION",
  similes: [
    "get token data by symbol",
    "check token info by ticker",
    "view token details by symbol",
    "get coin data by ticker",
    "check coin info by symbol",
    "get asset details by ticker",
  ],
  description: `Get the token data for a given ticker`,
  examples: [
    [
      {
        input: {
          ticker: "SUI",
        },
        output: {
          status: "success",
          message: "Asset data fetched successfully",
          assetData: {
            name: "Sui",
            symbol: "SUI",
            decimals: 9,
            totalSupply: null,
            owner: null,
            isVerified: true,
          },
        },
        explanation:
          "Get detailed information about the SUI token using its ticker",
      },
    ],
    [
      {
        input: {
          ticker: "USDC",
        },
        output: {
          status: "success",
          message: "Asset data fetched successfully",
          assetData: {
            name: "USD Coin",
            symbol: "USDC",
            decimals: 6,
            totalSupply: "1000000000000",
            owner:
              "0xdba34672e30cb065b1f93e3ab55318768fd6fef66c15942c9f7cb846e2f900e7",
            isVerified: true,
          },
        },
        explanation:
          "Get detailed information about the USDC token using its ticker",
      },
    ],
  ],
  schema: inputSchema,
  handler: async (agent: SuiAgentKit, input) => {
    const formattedAssetData = formatGoPlusLabsSuiTokenData(
      await agent.requestAssetDataByTicker(input.ticker),
    );

    return {
      status: "success",
      message: "Asset data fetched successfully",
      assetData: formattedAssetData,
    };
  },
};

export default assetDataByTickerAction;
