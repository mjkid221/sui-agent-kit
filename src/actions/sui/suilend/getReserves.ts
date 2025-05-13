import { SuiAgentKit } from "@/agent/sui";
import { SuiAction } from "@/types/action";
import { z } from "zod";

const inputSchema = z.object({});

const getReservesAction: SuiAction<typeof inputSchema> = {
  name: "GET_RESERVES_SUILEND_ACTION",
  similes: [
    "get supported assets",
    "list supported tokens",
    "show available assets",
    "view supported coins",
    "check supported tokens",
    "list lending assets",
  ],
  description: `Retrieves all currently supported suilend assets (reserves) in an array of coinTypes (address string).
    Only assets listed in the reserves are supported for lending on Suilend.`,
  examples: [
    [
      {
        input: {},
        output: {
          status: "success",
          message: "Reserves fetched successfully",
          reserves: [
            "0x2::sui::SUI",
            "0x76cb819b01abed502bee8a702b4c2d547532c12f25001c9dea795a5e631c26f1::fud::FUD",
          ],
        },
        explanation: "Get list of all supported assets on SuiLend",
      },
    ],
  ],
  schema: inputSchema,
  handler: async (agent: SuiAgentKit) => {
    const reserves = await agent.requestSuilendReserves();

    return {
      status: "success",
      message: "Reserves fetched successfully",
      reserves,
    };
  },
};

export default getReservesAction;
