import { Tool } from "langchain/tools";
import { SuiAgentKit } from "../../../agent/sui";
import { returnErrorResponse, returnSuccessResponse } from "../../lib";

export class SuiTransferTool extends Tool {
  name = "sui_transfer";
  description = `Transfers coins or SUI to another address (a.k.a. wallet). 
    If no coinType is provided, the transfer will be in SUI, otherwise transfer the specified coin.

    Inputs ( input is a JSON string ) :
    amount: number, eg 1 (required)
    to: string, eg "0x008e52674f25ba8c2130933524cb88920bdcb46ad2160e886042801029bcd027" (required)
    coinType?: string, eg "0xdba34672e30cb065b1f93e3ab55318768fd6fef66c15942c9f7cb846e2f900e7::usdc::USDC" (optional)
    `;

  constructor(private suiAgentKit: SuiAgentKit) {
    super();
  }

  protected async _call(input: string): Promise<string> {
    try {
      const { amount, to, coinType } = JSON.parse(input);

      const tx = await this.suiAgentKit.requestTransferCoinOrToken(
        amount,
        to,
        coinType,
      );

      return returnSuccessResponse({
        message: "Transfer successful",
        amount,
        recipient: to,
        coinType: coinType || "SUI",
        transaction: tx,
      });
    } catch (error: any) {
      return returnErrorResponse(error);
    }
  }
}
