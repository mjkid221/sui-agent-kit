import { BaseSuiPlugin } from "@/plugins/base";
import assetPriceAction from "@/actions/sui/dexScreener/assetPrice";
import assetAddressFromTickerAction from "@/actions/sui/dexScreener/assetAddressFromTicker";
import { SuiAgentKit } from "@/agent/sui";

/**
 * DexScreener price data plugin
 */
export class DexScreenerPlugin extends BaseSuiPlugin<SuiAgentKit> {
  constructor() {
    super("sui-dexscreener", "DexScreener market data for Sui assets", "1.0.0");

    // Register all DexScreener actions
    this.registerAction(assetPriceAction);
    this.registerAction(assetAddressFromTickerAction);
  }
}
