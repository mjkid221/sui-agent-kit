import { SuiAgentKit } from "@/agent/sui";
import { z } from "zod";
import { createActionBuilderFor } from "../createAction";

const schema = z.object({});

const getAllPoolPositionsAction = createActionBuilderFor(SuiAgentKit)
  .name("GET_ALL_POOL_POSITIONS_CETUS_ACTION")
  .similes([
    "get all LP positions",
    "list all liquidity positions",
    "view all pool positions",
    "show cetus positions",
    "list pool positions",
    "view liquidity positions",
  ])
  .description(
    `Get all pool positions on Cetus for the current wallet. This will return all the positions you have in any Cetus pool.`,
  )
  .examples([
    [
      {
        input: {},
        output: {
          status: "success",
          message: "Pool positions fetched successfully",
          positions: [
            {
              positionId: "0x1234567890",
              poolId: "0x0987654321",
              tickLower: -100,
              tickUpper: 100,
              liquidity: "1000000",
              coinTypeA: "0x2::sui::SUI",
              coinTypeB: "0x123::usdc::USDC",
            },
          ],
        },
        explanation: "Get all Cetus pool positions for the current wallet",
      },
    ],
  ])
  .schema(schema)
  .handler(async (agent) => {
    const positions = await agent.cetusPoolManager.getPoolPositions();

    return {
      status: "success",
      message: "Pool positions fetched successfully",
      positions,
    };
  });

export default getAllPoolPositionsAction;
