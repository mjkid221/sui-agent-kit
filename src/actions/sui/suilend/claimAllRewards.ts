import { SuiAgentKit } from "@/agent/sui";
import { SuiAction } from "@/types/action";
import { z } from "zod";

const inputSchema = z.object({});

const claimAllRewardsAction: SuiAction<typeof inputSchema> = {
  name: "CLAIM_ALL_REWARDS_SUILEND_ACTION",
  similes: [
    "claim rewards",
    "collect rewards",
    "harvest rewards",
    "claim lending rewards",
    "get earned rewards",
    "withdraw rewards",
  ],
  description: `Claim all rewards of the lended assets in the suilend protocol.`,
  examples: [
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
  ],
  schema: inputSchema,
  handler: async (agent: SuiAgentKit) => {
    const tx = await agent.requestClaimAllRewardsSuilend();

    return {
      status: "success",
      message: "Rewards claimed successfully",
      transaction: tx,
    };
  },
};

export default claimAllRewardsAction;
