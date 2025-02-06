import { SuiAgentKit } from "@/agent/sui";
import { returnErrorResponse, returnSuccessResponse } from "@/langchain/lib";
import { Tool } from "langchain/tools";

export class SuiAssetPriceTool extends Tool {
  name = "sui_asset_price";
  description = `Get the token price for a given coin type address
  The response price is in USDC value.

  Inputs ( input is a JSON string ) :
  coinType: string, eg "0x76cb819b01abed502bee8a702b4c2d547532c12f25001c9dea795a5e631c26f1::fud::FUD" (required)`;

  constructor(private SuiKit: SuiAgentKit) {
    super();
  }

  protected async _call(input: string): Promise<string> {
    try {
      const assetPrice = await this.SuiKit.requestGetAssetPrice(input);
      return returnSuccessResponse({
        message: "Asset price fetched successfully",
        assetPrice,
      });
    } catch (error: any) {
      return returnErrorResponse(error);
    }
  }
}
