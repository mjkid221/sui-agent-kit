import { SuiAgentKit } from "@/agent/sui";
import { SuiAction } from "@/types/action";
import { z } from "zod";

const inputSchema = z.object({
  ticker: z.string(),
});

const assetAddressFromTickerAction: SuiAction<typeof inputSchema> = {
  name: "ASSET_ADDRESS_FROM_TICKER_ACTION",
  similes: [
    "get token address",
    "find token address",
    "lookup token address",
    "get coin address",
    "find coin address",
    "get asset contract",
  ],
  description: `Get the token address for a given ticker`,
  examples: [
    [
      {
        input: {
          ticker: "SUI",
        },
        output: {
          status: "success",
          message: "Asset address fetched successfully",
          assetAddress: "0x2::sui::SUI",
        },
        explanation: "Get the token address for the SUI token",
      },
    ],
    [
      {
        input: {
          ticker: "USDC",
        },
        output: {
          status: "success",
          message: "Asset address fetched successfully",
          assetAddress:
            "0xdba34672e30cb065b1f93e3ab55318768fd6fef66c15942c9f7cb846e2f900e7::usdc::USDC",
        },
        explanation: "Get the token address for the USDC token",
      },
    ],
  ],
  schema: inputSchema,
  handler: async (agent: SuiAgentKit, input) => {
    const assetAddress = await agent.getAssetAddressFromTicker(input.ticker);

    return {
      status: "success",
      message: "Asset address fetched successfully",
      assetAddress,
    };
  },
};

export default assetAddressFromTickerAction;
