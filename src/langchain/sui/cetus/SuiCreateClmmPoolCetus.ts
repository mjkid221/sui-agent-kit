import { Tool } from "langchain/tools";
import { SuiAgentKit } from "../../../agent/sui";
import { returnErrorResponse, returnSuccessResponse } from "../../lib";

export class SuiCreateClmmPoolCetus extends Tool {
  name = "sui_create_clmm_pool_cetus";
  description = `Create a new liquidity pool on Cetus with initial liquidity. 
    CoinTypeA is the coin type of the first asset to be deposited into the pool.
    CoinTypeB is the coin type of the second asset to be deposited into the pool.
    InitialPrice is the initial price of the pool in relative to CoinTypeB.
    FeeTier is the fee tier of the pool. 1 = 2 bps, 5 = 10 bps, 10 = 20 bps, 25 = 60 bps, 100 = 200 bps, 200 = 220 bps.
    SlippagePercentage is the slippage percentage of the pool.

    Inputs ( input is a JSON string ) :
    coinTypeA: string, eg "0x2::sui::SUI" or "0xdba34672e30cb065b1f93e3ab55318768fd6fef66c15942c9f7cb846e2f900e7::usdc::USDC" (required)
    coinTypeADepositAmount: number, eg 1 or 0.1 (required)
    coinTypeB: string, eg "0x2::sui::SUI" or "0xdba34672e30cb065b1f93e3ab55318768fd6fef66c15942c9f7cb846e2f900e7::usdc::USDC" (required)
    initialPrice: number, eg 0.00000004 (required)
    feeTier: number, eg 1 or 5 or 10 or 25 or 100 or 200 (required)
    slippagePercentage: number, eg 5 (required)
    `;

  constructor(private suiAgentKit: SuiAgentKit) {
    super();
  }

  protected async _call(input: string): Promise<string> {
    try {
      const {
        coinTypeA,
        coinTypeADepositAmount,
        coinTypeB,
        initialPrice,
        feeTier,
        slippagePercentage,
      } = JSON.parse(input);
      const poolData = await this.suiAgentKit.requestCreateClmmPoolCetus(
        coinTypeA,
        coinTypeADepositAmount,
        coinTypeB,
        initialPrice,
        feeTier,
        slippagePercentage,
      );

      return returnSuccessResponse({
        message: "Pool created successfully",
        transaction: poolData.txDigest,
        ...poolData,
      });
    } catch (error: any) {
      return returnErrorResponse(error);
    }
  }
}
