import { BaseSuiPlugin } from "@/plugins/base";
import assetDataByTickerAction from "@/actions/sui/goPlusLabs/assetDataByTicker";
import assetDataByAddressAction from "@/actions/sui/goPlusLabs/assetDataByAddress";
import { SuiAgentKit } from "@/agent/sui";

/**
 * GoPlusLabs asset security data plugin
 */
export class GoPlusLabsPlugin extends BaseSuiPlugin<SuiAgentKit> {
  constructor() {
    super("sui-gopluslabs", "GoPlusLabs security data for Sui assets", "1.0.0");

    // Register GoPlusLabs actions
    this.registerAction(assetDataByTickerAction);
    this.registerAction(assetDataByAddressAction);
  }
}
