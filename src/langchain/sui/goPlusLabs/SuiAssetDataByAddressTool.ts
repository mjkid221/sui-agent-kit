import { SuiAgentKit } from "@/agent/sui";
import { returnErrorResponse, returnSuccessResponse } from "@/langchain/lib";
import { formatGoPlusLabsSuiTokenData } from "@/tools/sui/goPlusLabs";
import { Tool } from "langchain/tools";

export class SuiAssetDataByAddressTool extends Tool {
  name = "sui_asset_data_by_address";
  description = `Get the token data for a given coin type address

  Inputs ( input is a JSON string ) :
  coinType: string, eg "0x76cb819b01abed502bee8a702b4c2d547532c12f25001c9dea795a5e631c26f1::fud::FUD" (required)`;

  constructor(private SuiKit: SuiAgentKit) {
    super();
  }

  protected async _call(input: string): Promise<string> {
    try {
      const coinType = input.trim();
      const formattedAssetData = formatGoPlusLabsSuiTokenData(
        await this.SuiKit.requestAssetDataByCoinType(coinType),
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
