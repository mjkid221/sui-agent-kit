import { Tool } from "langchain/tools";
import { SuiAgentKit } from "../../../agent/sui";
import { returnErrorResponse, returnSuccessResponse } from "../../lib";

export class SuiGetPoolByCoinsCetus extends Tool {
  name = "sui_get_pool_by_coins_cetus";
  description = `Get a pool by coins on Cetus. Returns null if no pool is found. Otherwise, returns the pool object containing poolId.
    FeeTier is the fee tier of the pool. 1 = 2 bps, 5 = 10 bps, 10 = 20 bps, 25 = 60 bps, 100 = 200 bps, 200 = 220 bps.

    Inputs ( input is JSON string ) :
    coinTypeA: string, eg "0x2::sui::SUI" or "0xdba34672e30cb065b1f93e3ab55318768fd6fef66c15942c9f7cb846e2f900e7::usdc::USDC" (required)
    coinTypeB: string, eg "0x2::sui::SUI" or "0xdba34672e30cb065b1f93e3ab55318768fd6fef66c15942c9f7cb846e2f900e7::usdc::USDC" (required)
    feeTier: number, eg 1 or 5 or 10 or 25 or 100 or 200 (optional)
    `;

  constructor(private suiAgentKit: SuiAgentKit) {
    super();
  }

  protected async _call(input: string): Promise<string> {
    try {
      const { coinTypeA, coinTypeB, feeTier } = JSON.parse(input);
      const pool = await this.suiAgentKit.requestGetPoolByCoinsCetus(
        coinTypeA,
        coinTypeB,
        feeTier,
      );
      return returnSuccessResponse({
        message: "Pool found successfully",
        pool,
      });
    } catch (error: any) {
      return returnErrorResponse(error);
    }
  }
}
