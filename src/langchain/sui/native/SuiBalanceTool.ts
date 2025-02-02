import { Tool } from "langchain/tools";
import { SuiAgentKit } from "../../../agent/sui";
import {
  returnErrorResponse,
  returnSuccessResponse,
} from "../../lib/standardizeResponse";

export class SuiBalanceTool extends Tool {
  name = "sui_balance";
  description = `Get the balance of a Sui wallet. 
    If you want to get the native token balance of your (personal) wallet, you don't need to provide the coinType nor walletAddress.
    If you are prompted to get a coin balance but you do not know the exact coinType address prompt the user for it, do not make assumptions.
    Not specifying a coinType will return the balance of the native token (SUI).
    Providing a walletAddress will return the balance for the specified walletAddress.

    Inputs ( input is a JSON string ):
    coinType: string, eg "0xdba34672e30cb065b1f93e3ab55318768fd6fef66c15942c9f7cb846e2f900e7::usdc::USDC" (optional)
    walletAddress: string, eg "0x008e52674f25ba8c2130933524cb88920bdcb46ad2160e886042801029bcd027" (optional)`;

  constructor(private suiAgentKit: SuiAgentKit) {
    super();
  }

  protected async _call(input: string): Promise<string> {
    try {
      const { walletAddress, coinType } = input
        ? JSON.parse(input)
        : {
            walletAddress: undefined,
            coinType: undefined,
          };
      const balance = await this.suiAgentKit.requestGetBalance(
        coinType,
        walletAddress,
      );

      return returnSuccessResponse({
        balance,
        wallet: walletAddress,
        coin: coinType || "SUI",
      });
    } catch (error: any) {
      return returnErrorResponse(error);
    }
  }
}
