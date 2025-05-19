import { SuiAgentKit } from "@/agent/sui";
import { z } from "zod";
import { createActionBuilderFor } from "../createAction";

const schema = z.object({
  positionId: z.string(),
});

const closePoolPositionAction = createActionBuilderFor(SuiAgentKit)
  .name("CLOSE_POOL_POSITION_CETUS_ACTION")
  .similes([
    "remove liquidity",
    "withdraw liquidity",
    "close LP position",
    "exit pool",
    "withdraw from pool",
    "exit liquidity position",
  ])
  .description(
    `Close a pool position on Cetus. This will remove all liquidity and return the tokens to your wallet.
    positionId can be found in the pool object returned by the get all pool position action.`,
  )
  .examples([
    [
      {
        input: {
          positionId: "0x0987654321",
        },
        output: {
          status: "success",
          message: "Pool position closed successfully",
          transaction: "transaction_digest_here",
        },
        explanation: "Close an existing liquidity position",
      },
    ],
  ])
  .schema(schema)
  .handler(async (agent, input) => {
    await agent.cetusPoolManager.closePoolPosition(input.positionId);

    return {
      status: "success",
      message: "Pool position closed successfully",
    };
  });

export default closePoolPositionAction;
