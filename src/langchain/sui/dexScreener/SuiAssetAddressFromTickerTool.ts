import { SuiAgentKit } from "@/agent/sui";
import { returnErrorResponse, returnSuccessResponse } from "@/langchain/lib";
import { Tool } from "langchain/tools";

export class SuiAssetAddressFromTickerTool extends Tool {
  name = "sui_asset_address_from_ticker";
  description = `Get the token address for a given ticker

  Inputs ( input is a JSON string ) :
  ticker: string, eg "SUI" (required)`;

  constructor(private SuiKit: SuiAgentKit) {
    super();
  }

  protected async _call(input: string): Promise<string> {
    try {
      const ticker = input.trim();
      const assetAddress = await this.SuiKit.getAssetAddressFromTicker(ticker);
      return returnSuccessResponse({
        message: "Asset address fetched successfully",
        assetAddress,
      });
    } catch (error: any) {
      return returnErrorResponse(error);
    }
  }
}
