import { SuiAgentKit } from "@/agent/sui";
import { z } from "zod";
import { createActionBuilderFor } from "../createAction";

const schema = z.object({});

const claimAllRewardsAction = createActionBuilderFor(SuiAgentKit)
  .name("CLAIM_ALL_REWARDS_SUILEND_ACTION")
  .similes([
    "claim rewards",
    "collect rewards",
    "harvest rewards",
    "claim lending rewards",
    "get earned rewards",
    "withdraw rewards",
  ])
  .description(
    `Claim all rewards of the lended assets in the suilend protocol.`,
  )
  .examples([
    [
      {
        input: {},
        output: {
          status: "success",
          message: "Rewards claimed successfully",
          transaction: "transaction_digest_here",
        },
        explanation: "Claim all available rewards from lending on SuiLend",
      },
    ],
  ])
  .schema(schema)
  .handler(async (agent) => {
    const tx = await agent.suilendService.claimAllRewards();

    return {
      status: "success",
      message: "Rewards claimed successfully",
      transaction: tx,
    };
  });

export default claimAllRewardsAction;
