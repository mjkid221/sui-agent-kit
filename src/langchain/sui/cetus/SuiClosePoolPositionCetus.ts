import { Tool } from "langchain/tools";
import { SuiAgentKit } from "../../../agent/sui";
import { returnErrorResponse, returnSuccessResponse } from "../../lib";

export class SuiClosePoolPositionCetus extends Tool {
  name = "sui_close_pool_position_cetus";
  description = `Close a pool position on Cetus by positionId. Ideally use the positionId returned from the sui_get_all_pool_position_cetus tool.

    Inputs ( input is a string ) :
    positionId: string, eg "0x1234567890" (required)
    `;

  constructor(private suiAgentKit: SuiAgentKit) {
    super();
  }

  protected async _call(input: string): Promise<string> {
    try {
      const positionId = input.trim();
      const txDigest =
        await this.suiAgentKit.requestClosePoolPositionCetus(positionId);
      return returnSuccessResponse({
        message: "Pool position closed successfully",
        transaction: txDigest,
      });
    } catch (error: any) {
      return returnErrorResponse(error);
    }
  }
}
