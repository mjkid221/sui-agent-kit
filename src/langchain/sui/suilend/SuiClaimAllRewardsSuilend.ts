import { SuiAgentKit } from "@/agent/sui";
import { returnErrorResponse } from "@/langchain/lib";
import { returnSuccessResponse } from "@/langchain/lib";
import { Tool } from "langchain/tools";

export class SuiClaimAllRewardsSuilend extends Tool {
  name = "sui_claim_all_rewards_suilend";
  description = `Claim all rewards of the lended assets in the suilend protocol. 
  `;

  constructor(private suiAgentKit: SuiAgentKit) {
    super();
  }

  protected async _call(): Promise<string> {
    try {
      const tx = await this.suiAgentKit.requestClaimAllRewardsSuilend();
      return returnSuccessResponse({
        status: "success",
        message: "Rewards claimed successfully",
        transaction: tx,
      });
    } catch (error) {
      return returnErrorResponse(error);
    }
  }
}
