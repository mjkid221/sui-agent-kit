import { Tool } from "langchain/tools";
import { SuiAgentKit } from "../../../agent/sui";
import { returnErrorResponse, returnSuccessResponse } from "../../lib";

export class SuiOpenPoolPositionCetus extends Tool {
  name = "sui_open_pool_position_cetus";
  description = `Open a pool position on Cetus. If creating a new position, the poolId is required. If adding liquidity to an existing position, the existingPositionId is required.
    poolId and existingPositionId can be found in the pool object returned by the sui_get_all_pool_position_cetus tool if the user wants to add to existing position. 
    poolId can also be found in the pool object returned by the sui_get_pool_by_coins_cetus tool.

    Inputs ( input is a JSON string ) :
    poolId: string, eg "0x1234567890" (required)
    coinTypeA: string, eg "0x2::sui::SUI" or "0xdba34672e30cb065b1f93e3ab55318768fd6fef66c15942c9f7cb846e2f900e7::usdc::USDC" (required)
    amountA: number, eg 1 or 0.1 (required)
    slippagePercentage: number, eg 5 (required)
    existingPositionId: string, eg "0x1234567890" (optional)
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
