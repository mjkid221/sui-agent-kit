import { SuiAgentKit } from "@/agent/sui";
import { returnErrorResponse, returnSuccessResponse } from "@/langchain/lib";
import { Tool } from "langchain/tools";

export class SuiGetReservesSuilend extends Tool {
  name = "sui_get_reserves_suilend";
  description = `Retrieves all currently supported suilend assets (reserves) in an array of coinTypes (address string).
  Only assets listed in the reserves are supported for lending on Suilend.`;

  constructor(private suiAgentKit: SuiAgentKit) {
    super();
  }

  protected async _call(): Promise<string> {
    try {
      const reserves = await this.suiAgentKit.requestSuilendReserves();
      return returnSuccessResponse({
        message: "Reserves fetched successfully",
        reserves,
      });
    } catch (error) {
      return returnErrorResponse(error);
    }
  }
}
