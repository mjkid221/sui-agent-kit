import { SuiAgentKit } from "@/agent/sui";
import { SuiAction } from "@/types/action";
import { z } from "zod";

const inputSchema = z.object({});

const getAllPoolPositionsAction: SuiAction<typeof inputSchema> = {
  name: "GET_ALL_POOL_POSITIONS_CETUS_ACTION",
  similes: [
    "list pool positions",
    "view liquidity positions",
    "show pool positions",
    "check LP positions",
    "get all positions",
    "view Cetus positions",
  ],
  description: `Get all open pool positions of the user. Returns an array of Position objects containing the position id.`,
  examples: [
    [
      {
        input: {},
        output: {
          status: "success",
          message: "Pool positions fetched successfully",
          poolData: [
            {
              positionId: "0x1234567890",
              poolId: "0x0987654321",
              coinTypeA: "0x2::sui::SUI",
              coinTypeB:
                "0xdba34672e30cb065b1f93e3ab55318768fd6fef66c15942c9f7cb846e2f900e7::usdc::USDC",
              liquidity: "1000000",
            },
          ],
        },
        explanation: "Get all open liquidity positions on Cetus",
      },
    ],
  ],
  schema: inputSchema,
  handler: async (agent: SuiAgentKit) => {
    const poolData = await agent.requestGetAllPoolPositionsCetus();

    return {
      status: "success",
      message: "Pool positions fetched successfully",
      poolData,
    };
  },
};

export default getAllPoolPositionsAction;
