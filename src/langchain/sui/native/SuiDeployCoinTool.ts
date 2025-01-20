import { Tool } from "langchain/tools";
import { SuiAgentKit } from "../../../agent/sui";
import { returnErrorResponse, returnSuccessResponse } from "../../lib";

export class SuiDeployCoinTool extends Tool {
  name = "sui_deploy_coin";
  description = `Deploy a new coin on Sui blockchain. 
    fixedSupply determines if the coin is fixed supply or not.

    Inputs ( input is a JSON string ) :
    name: string, eg "My Coin" (required)
    symbol: string, eg "MC" (required)
    totalSupply: number, eg "1000000" (required)
    decimals?: number, eg "6" (optional)
    description?: string, eg "My Coin is a new coin on Sui blockchain" (optional)
    imageUrl?: string, eg "https://example.com/my-coin.png" (optional)
    fixedSupply: boolean, eg "true" (optional)
    `;

  constructor(private suiAgentKit: SuiAgentKit) {
    super();
  }

  protected async _call(input: string): Promise<string> {
    try {
      const parsedInput = JSON.parse(input);

      const coinType = await this.suiAgentKit.requestDeployCoin(parsedInput);

      return returnSuccessResponse({
        status: "success",
        message: "Coin deployed successfully",
        createdCoinType: coinType,
        decimals: parsedInput.decimals || 9,
      });
    } catch (error: any) {
      return returnErrorResponse(error);
    }
  }
}
