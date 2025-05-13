import { SuiAgentKit } from "@/agent/sui";
import { SuiAction } from "@/types/action";
import { z } from "zod";

const inputSchema = z.object({
  poolId: z.string(),
  coinTypeA: z.string(),
  amountA: z.number(),
  slippagePercentage: z.number(),
  existingPositionId: z.string().optional(),
});

const openPoolPositionAction: SuiAction<typeof inputSchema> = {
  name: "OPEN_POOL_POSITION_CETUS_ACTION",
  similes: [
    "add liquidity",
    "provide liquidity",
    "open LP position",
    "create pool position",
    "join pool",
    "deposit to pool",
  ],
  description: `Open a pool position on Cetus. If creating a new position, the poolId is required. If adding liquidity to an existing position, the existingPositionId is required.
    poolId and existingPositionId can be found in the pool object returned by the get all pool position action if the user wants to add to existing position. 
    poolId can also be found in the pool object returned by the get pool by coins action.`,
  examples: [
    [
      {
        input: {
          poolId: "0x1234567890",
          coinTypeA: "0x2::sui::SUI",
          amountA: 1,
          slippagePercentage: 5,
        },
        output: {
          status: "success",
          message: "Pool position opened successfully",
          transaction: "transaction_digest_here",
          positionId: "0x0987654321",
        },
        explanation: "Open a new position in a SUI pool",
      },
    ],
    [
      {
        input: {
          poolId: "0x1234567890",
          coinTypeA: "0x2::sui::SUI",
          amountA: 0.5,
          slippagePercentage: 5,
          existingPositionId: "0x0987654321",
        },
        output: {
          status: "success",
          message: "Pool position opened successfully",
          transaction: "transaction_digest_here",
          positionId: "0x0987654321",
        },
        explanation: "Add liquidity to an existing position",
      },
    ],
  ],
  schema: inputSchema,
  handler: async (agent: SuiAgentKit, input) => {
    const result = await agent.requestOpenPoolPositionCetus(
      input.poolId,
      input.coinTypeA,
      input.amountA,
      input.slippagePercentage,
      input.existingPositionId,
    );

    return {
      status: "success",
      message: "Pool position opened successfully",
      // Use the result directly without assuming its structure
      result,
    };
  },
};

export default openPoolPositionAction;
