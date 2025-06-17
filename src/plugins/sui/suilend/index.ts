import { BaseSuiPlugin } from "@/plugins/base";
import lendAssetAction from "@/actions/sui/suilend/lendAsset";
import withdrawLendedAssetAction from "@/actions/sui/suilend/withdrawLendedAsset";
import getReservesAction from "@/actions/sui/suilend/getReserves";
import claimAllRewardsAction from "@/actions/sui/suilend/claimAllRewards";
import getRewardsAction from "@/actions/sui/suilend/getRewards";
import getLendedAssetsAction from "@/actions/sui/suilend/getLendedAssets";
import { SuiAgentKit } from "@/agent/sui";

/**
 * SuiLend lending protocol plugin
 */
export class SuiLendPlugin extends BaseSuiPlugin<SuiAgentKit> {
  constructor() {
    super("sui-lend", "SuiLend lending protocol operations", "1.0.0");

    // Register SuiLend actions
    this.registerAction(lendAssetAction);
    this.registerAction(withdrawLendedAssetAction);
    this.registerAction(getReservesAction);
    this.registerAction(claimAllRewardsAction);
    this.registerAction(getRewardsAction);
    this.registerAction(getLendedAssetsAction);
  }
}
