import { SuiAgentKit } from "@/agent/sui";
import { returnErrorResponse, returnSuccessResponse } from "@/langchain/lib";
import { formatGoPlusLabsSuiTokenData } from "@/tools/sui/goPlusLabs";
import { Tool } from "langchain/tools";

export class SuiAssetDataByTickerTool extends Tool {
  name = "sui_asset_data_by_ticker";
  description = `Get the token data for a given ticker

  Inputs ( input is a JSON string ) :
  ticker: string, eg "SUI" or "USDC" (required)`;

  constructor(private SuiKit: SuiAgentKit) {
    super();
  }

  protected async _call(input: string): Promise<string> {
    try {
      const ticker = input.trim();
      const formattedAssetData = formatGoPlusLabsSuiTokenData(
        await this.SuiKit.requestAssetDataByTicker(ticker),
      );
      return returnSuccessResponse({
        message: "Asset data fetched successfully",
        assetData: formattedAssetData,
      });
    } catch (error: any) {
      return returnErrorResponse(error);
    }
  }
}
