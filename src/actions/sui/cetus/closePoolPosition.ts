import { SuiAgentKit } from "@/agent/sui";
import { SuiAction } from "@/types/action";
import { z } from "zod";

const inputSchema = z.object({
  positionId: z.string(),
});

const closePoolPositionAction: SuiAction<typeof inputSchema> = {
  name: "CLOSE_POOL_POSITION_CETUS_ACTION",
  similes: [
    "close liquidity position",
    "remove pool position",
    "exit pool position",
    "close LP position",
    "withdraw from pool",
    "close Cetus position",
  ],
  description: `Close a pool position on Cetus by positionId. Ideally use the positionId returned from the get all pool position action.`,
  examples: [
    [
      {
        input: {
          positionId: "0x1234567890",
        },
        output: {
          status: "success",
          message: "Pool position closed successfully",
          transaction: "transaction_digest_here",
        },
        explanation: "Close a specific pool position on Cetus",
      },
    ],
  ],
  schema: inputSchema,
  handler: async (agent: SuiAgentKit, input) => {
    const txDigest = await agent.requestClosePoolPositionCetus(
      input.positionId,
    );

    return {
      status: "success",
      message: "Pool position closed successfully",
      transaction: txDigest,
    };
  },
};

export default closePoolPositionAction;
