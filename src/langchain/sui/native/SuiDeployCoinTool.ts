import { Tool } from "langchain/tools";
import { SuiAgentKit } from "../../../agent/sui";
import { returnErrorResponse, returnSuccessResponse } from "../../lib";

export class SuiDeployCoinTool extends Tool {
  name = "sui_deploy_coin";
  description = `Deploy a new coin on Sui blockchain. 
    fixedSupply determines if the coin is fixed supply or not.
    Decimals are usually 6 for most coins unless otherwise specified.
    If recipient is not provided, the coin will be deployed to your (agent's) wallet.
    If description is not provided by the user, always prompt the user to provide them.

    Inputs ( input is a JSON string ) :
    name: string, eg "My Coin" (required)
    symbol: string, eg "MC" (required)
    totalSupply: number, eg "1000000" (required)
    decimals?: number, eg "6" (optional)
    description: string, eg "My Coin is a new coin on Sui blockchain" (required)
    imageUrl?: string, eg "https://example.com/my-coin.png" (optional)
    fixedSupply?: boolean, eg "true" (optional)
    recipient: string, eg "0x008e52674f25ba8c2130933524cb88920bdcb46ad2160e886042801029bcd027" (optional)
    `;

  constructor(private suiAgentKit: SuiAgentKit) {
    super();
  }

  protected async _call(input: string): Promise<string> {
    try {
      const parsedInput = JSON.parse(input);
      const coinType = await this.suiAgentKit.requestDeployCoin(parsedInput);

      return returnSuccessResponse({
        message: "Coin deployed successfully",
        createdCoinAddress: coinType,
        decimals: parsedInput.decimals || 6,
      });
    } catch (error: any) {
      return returnErrorResponse(error);
    }
  }
}
