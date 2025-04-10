import { SuiAgentKit } from "@/agent/sui";
import { returnErrorResponse } from "@/langchain/lib";
import { returnSuccessResponse } from "@/langchain/lib";
import { Tool } from "langchain/tools";

export class SuiGetRewardsSuilend extends Tool {
  name = "sui_get_rewards_suilend";
  description = `Get current eligible rewards of the lended assets in the suilend protocol. 
  `;

  constructor(private suiAgentKit: SuiAgentKit) {
    super();
  }

  protected async _call(): Promise<string> {
    try {
      const rewards = await this.suiAgentKit.requestGetRewardsSuilend();
      return returnSuccessResponse({
        status: "success",
        message: "Rewards fetched successfully",
        rewards,
      });
    } catch (error) {
      return returnErrorResponse(error);
    }
  }
}
