import { SuiAgentKit } from "@/agent/sui";
import { returnErrorResponse } from "@/langchain/lib";
import { returnSuccessResponse } from "@/langchain/lib";
import { Tool } from "langchain/tools";

export class SuiWithdrawLendedAssetSuilend extends Tool {
  name = "sui_withdraw_lended_asset_suilend";
  description = `Withdraw a lended asset from the suilend protocol completely. 
  CoinType input is the coin type (address) of the asset to withdraw.
  
  Inputs ( input is a string ) :
  coinType: string, eg "0x76cb819b01abed502bee8a702b4c2d547532c12f25001c9dea795a5e631c26f1::fud::FUD" (required)
  `;

  constructor(private suiAgentKit: SuiAgentKit) {
    super();
  }

  protected async _call(input: string): Promise<string> {
    try {
      const coinType = input.trim();
      const tx =
        await this.suiAgentKit.requestWithdrawLendedAssetSuilend(coinType);
      return returnSuccessResponse({
        status: "success",
        message: "Asset withdrawn successfully",
        transaction: tx,
      });
    } catch (error) {
      return returnErrorResponse(error);
    }
  }
}
