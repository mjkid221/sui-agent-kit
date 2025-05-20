import { BaseSuiPlugin } from "@/plugins/base";
import tradeAction from "@/actions/sui/flowX/trade";
import { SuiAgentKit } from "@/agent/sui";

/**
 * FlowX DEX trading plugin
 */
export class FlowXPlugin extends BaseSuiPlugin<SuiAgentKit> {
  constructor() {
    super("sui-flowx-dex", "FlowX DEX trading operations", "1.0.0");

    // Register FlowX actions
    this.registerAction(tradeAction);
  }
}
