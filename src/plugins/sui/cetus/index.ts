import { BaseSuiPlugin } from "@/plugins/base";
import createClmmPoolAction from "@/actions/sui/cetus/createClmmPool";
import openPoolPositionAction from "@/actions/sui/cetus/openPoolPosition";
import closePoolPositionAction from "@/actions/sui/cetus/closePoolPosition";
import getAllPoolPositionsAction from "@/actions/sui/cetus/getAllPoolPositions";
import getPoolByCoinsAction from "@/actions/sui/cetus/getPoolByCoins";
import { SuiAgentKit } from "@/agent/sui";

/**
 * Cetus DEX operations plugin
 */
export class CetusPlugin extends BaseSuiPlugin<SuiAgentKit> {
  constructor() {
    super(
      "sui-cetus-dex",
      "Cetus DEX operations like pool management and positions",
      "1.0.0",
    );

    // Register all Cetus actions
    this.registerAction(createClmmPoolAction);
    this.registerAction(openPoolPositionAction);
    this.registerAction(closePoolPositionAction);
    this.registerAction(getAllPoolPositionsAction);
    this.registerAction(getPoolByCoinsAction);
  }
}
