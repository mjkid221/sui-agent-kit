import { SuiAgentKit } from "@/agent/sui";
import { returnErrorResponse, returnSuccessResponse } from "@/langchain/lib";
import { Tool } from "langchain/tools";

export class SuiLendAssetSuilend extends Tool {
  name = "sui_lend_asset_suilend";
  description = `Lend an asset to the suilend protocol. Amount input is amount of asset to lend/deposit without decimals.
    CoinType input is the coin type (address) of the asset to lend/deposit. An array of supported coin types can be retrieved by using the sui_get_reserves_suilend tool.
    
    Inputs ( input is a JSON string ) :
    amount: number, eg 10 or 0.1 (required)
    coinType: string, eg "0x76cb819b01abed502bee8a702b4c2d547532c12f25001c9dea795a5e631c26f1::fud::FUD" (required)
  `;

  constructor(private suiAgentKit: SuiAgentKit) {
    super();
  }

  protected async _call(input: string): Promise<string> {
    try {
      const { amount, coinType } = JSON.parse(input);
      const tx = await this.suiAgentKit.requestLendAssetSuilend(
        amount,
        coinType,
      );
      return returnSuccessResponse({
        status: "success",
        message: "Asset lent successfully",
        transaction: tx,
      });
    } catch (error) {
      return returnErrorResponse(error);
    }
  }
}
