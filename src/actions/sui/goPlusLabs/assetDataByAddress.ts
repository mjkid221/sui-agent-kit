import { SuiAgentKit } from "@/agent/sui";
import { SuiAction } from "@/types/action";
import { z } from "zod";
import { formatGoPlusLabsSuiTokenData } from "@/tools/sui/goPlusLabs";

const inputSchema = z.object({
  coinType: z.string(),
});

const assetDataByAddressAction: SuiAction<typeof inputSchema> = {
  name: "ASSET_DATA_BY_ADDRESS_ACTION",
  similes: [
    "get token data",
    "check token info",
    "view token details",
    "get coin data",
    "check coin info",
    "get asset details",
  ],
  description: `Get the token data for a given coin type address`,
  examples: [
    [
      {
        input: {
          coinType:
            "0x76cb819b01abed502bee8a702b4c2d547532c12f25001c9dea795a5e631c26f1::fud::FUD",
        },
        output: {
          status: "success",
          message: "Asset data fetched successfully",
          assetData: {
            name: "FUD Token",
            symbol: "FUD",
            decimals: 6,
            totalSupply: "1000000000000",
            owner:
              "0x76cb819b01abed502bee8a702b4c2d547532c12f25001c9dea795a5e631c26f1",
            isVerified: true,
          },
        },
        explanation: "Get detailed information about the FUD token",
      },
    ],
    [
      {
        input: {
          coinType: "0x2::sui::SUI",
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
        explanation: "Get detailed information about the SUI token",
      },
    ],
  ],
  schema: inputSchema,
  handler: async (agent: SuiAgentKit, input) => {
    const formattedAssetData = formatGoPlusLabsSuiTokenData(
      await agent.requestAssetDataByCoinType(input.coinType),
    );

    return {
      status: "success",
      message: "Asset data fetched successfully",
      assetData: formattedAssetData,
    };
  },
};

export default assetDataByAddressAction;
