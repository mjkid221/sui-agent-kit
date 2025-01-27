import { Tool } from "langchain/tools";
import { SuiAgentKit } from "../../../agent/sui";
import { returnErrorResponse, returnSuccessResponse } from "../../lib";

export class SuiTradeTool extends Tool {
  name = "sui_trade_coin";
  description = `Trade (swap) coins from one coin to another. 
    Make sure inputCoinType and outputCoinType are not the same.
    Slippage is the percentage of the input amount that is allowed to be lost in the trade.
    Slippage is in basis points (10000 = 1%). Use 10000 as default unless the user specifies a different value.
    Input amount is the amount of the input coin to be swapped without decimals.

    Inputs ( input is a JSON string ) :
    outputCoinType: string, eg "0x2::sui::SUI" or "0xdba34672e30cb065b1f93e3ab55318768fd6fef66c15942c9f7cb846e2f900e7::usdc::USDC" (required)
    inputAmount: number, eg 1 or 0.1 (required)
    inputCoinType: string, eg "0x2::sui::SUI" or "0xdba34672e30cb065b1f93e3ab55318768fd6fef66c15942c9f7cb846e2f900e7::usdc::USDC" (required)
    slippageBps: number, eg 10000 (optional)
    `;

  constructor(private suiAgentKit: SuiAgentKit) {
    super();
  }

  protected async _call(input: string): Promise<string> {
    try {
      const { outputCoinType, inputAmount, inputCoinType, slippageBps } =
        JSON.parse(input);
      const tx = await this.suiAgentKit.requestTrade(
        outputCoinType,
        inputAmount,
        inputCoinType,
        slippageBps,
      );

      return returnSuccessResponse({
        message: "Trade executed successfully",
        transaction: tx,
        inputAmount,
        inputCoinType,
        outputCoinType,
      });
    } catch (error: any) {
      return returnErrorResponse(error);
    }
  }
}
