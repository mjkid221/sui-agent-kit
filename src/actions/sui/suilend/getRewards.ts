import { SuiAgentKit } from "@/agent/sui";
import { z } from "zod";
import { createActionBuilderFor } from "../createAction";

const schema = z.object({});

const getRewardsAction = createActionBuilderFor(SuiAgentKit)
  .name("GET_REWARDS_SUILEND_ACTION")
  .similes([
    "get lending rewards",
    "show rewards",
    "view earned rewards",
    "check rewards balance",
    "display rewards",
    "view lending earnings",
  ])
  .description(
    `Get current eligible rewards of the lended assets in the suilend protocol.`,
  )
  .examples([
    [
      {
        input: {},
        output: {
          status: "success",
          message: "Rewards fetched successfully",
          rewards: {
            amount: "1000000",
            coinType:
              "0x76cb819b01abed502bee8a702b4c2d547532c12f25001c9dea795a5e631c26f1::reward::REWARD",
          },
        },
        explanation: "Get current rewards earned from lending on SuiLend",
      },
    ],
  ])
  .schema(schema)
  .handler(async (agent) => {
    const rewards = await agent.requestGetRewardsSuilend();

    return {
      status: "success",
      message: "Rewards fetched successfully",
      rewards,
    };
  });

export default getRewardsAction;
