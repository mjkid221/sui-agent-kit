import { Tool } from "langchain/tools";
import { SuiAgentKit } from "../../../agent/sui";
import { returnErrorResponse, returnSuccessResponse } from "../../lib";

export class SuiGetAllPoolPositionCetus extends Tool {
  name = "sui_get_all_pool_position_cetus";
  description = `Get all open pool positions of the user. Returns an array of Position objects containing the position id.
    `;

  constructor(private suiAgentKit: SuiAgentKit) {
    super();
  }

  protected async _call(): Promise<string> {
    try {
      const poolData = await this.suiAgentKit.requestGetAllPoolPositionsCetus();
      return returnSuccessResponse({
        message: "Pool positions fetched successfully",
        poolData,
      });
    } catch (error: any) {
      return returnErrorResponse(error);
    }
  }
}
