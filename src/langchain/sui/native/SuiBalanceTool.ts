import { Tool } from "langchain/tools";
import { SuiAgentKit } from "../../../agent/sui";
import {
  returnErrorResponse,
  returnSuccessResponse,
} from "../../lib/standardizeResponse";

export class SuiBalanceTool extends Tool {
  name = "sui_balance";
  description = `Get the balance of a Sui wallet. 
    If you want to get the native token balance of your wallet, you don't need to provide the coinType nor walletAddress.
    If no coinType is provided, the balance will always be in SUI, otherwise return the balance of the specified coin. 
    Providing a walletAddress will return the balance of the specified walletAddress.

    Inputs ( input is a JSON string ) :
    coinType: string, eg "0xdba34672e30cb065b1f93e3ab55318768fd6fef66c15942c9f7cb846e2f900e7::usdc::USDC" (optional)
    walletAddress: string, eg "0x008e52674f25ba8c2130933524cb88920bdcb46ad2160e886042801029bcd027" (optional)
    `;

  constructor(private suiAgentKit: SuiAgentKit) {
    super();
  }

  protected async _call(input: string): Promise<string> {
    try {
      const { walletAddress: rawWalletAddress, coinType: rawCoinType } =
        JSON.parse(input);
      const walletAddress = rawWalletAddress ?? undefined;
      const coinType = rawCoinType ?? undefined;
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
