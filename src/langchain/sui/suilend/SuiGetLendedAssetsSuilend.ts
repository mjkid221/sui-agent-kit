import { SuiAgentKit } from "@/agent/sui";
import { returnErrorResponse } from "@/langchain/lib";
import { returnSuccessResponse } from "@/langchain/lib";
import { Tool } from "langchain/tools";

export class SuiGetLendedAssetsSuilend extends Tool {
  name = "sui_get_lended_assets_suilend";
  description = `Get the list of lended assets in the suilend protocol. 
  cTokenAmount is the amount of the interest bearing token of the asset.
  `;

  constructor(private suiAgentKit: SuiAgentKit) {
    super();
  }

  protected async _call(): Promise<string> {
    try {
      const assets =
        await this.suiAgentKit.requestGetCurrentLendedAssetsSuilend();
      return returnSuccessResponse({
        status: "success",
        message: "Assets fetched successfully",
        assets,
      });
    } catch (error) {
      return returnErrorResponse(error);
    }
  }
}
