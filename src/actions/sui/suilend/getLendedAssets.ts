import { SuiAgentKit } from "@/agent/sui";
import { SuiAction } from "@/types/action";
import { z } from "zod";

const inputSchema = z.object({});

const getLendedAssetsAction: SuiAction<typeof inputSchema> = {
  name: "GET_LENDED_ASSETS_SUILEND_ACTION",
  similes: [
    "get lended assets",
    "show lended tokens",
    "view supplied assets",
    "check deposited tokens",
    "list lended coins",
    "view lending positions",
  ],
  description: `Get the list of lended assets in the suilend protocol. 
    cTokenAmount is the amount of the interest bearing token of the asset.`,
  examples: [
    [
      {
        input: {},
        output: {
          status: "success",
          message: "Assets fetched successfully",
          assets: [
            {
              coinType: "0x2::sui::SUI",
              cTokenAmount: "1000000",
            },
            {
              coinType:
                "0x76cb819b01abed502bee8a702b4c2d547532c12f25001c9dea795a5e631c26f1::fud::FUD",
              cTokenAmount: "500000",
            },
          ],
        },
        explanation: "Get list of all assets currently lended on SuiLend",
      },
    ],
  ],
  schema: inputSchema,
  handler: async (agent: SuiAgentKit) => {
    const assets = await agent.requestGetCurrentLendedAssetsSuilend();

    return {
      status: "success",
      message: "Assets fetched successfully",
      assets,
    };
  },
};

export default getLendedAssetsAction;
