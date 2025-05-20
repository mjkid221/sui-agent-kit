import { BaseSuiPlugin } from "@/plugins/base";
import tokenBalanceAction from "@/actions/sui/native/requestBalance";
import transferAction from "@/actions/sui/native/transfer";
import agentWalletAction from "@/actions/sui/native/agentWallet";
import { SuiAgentKit } from "@/agent/sui";

/**
 * Native Sui token operations plugin
 */
export class NativeTokenPlugin extends BaseSuiPlugin<SuiAgentKit> {
  constructor() {
    super(
      "sui-native-tokens",
      "Native Sui token operations like balance checking and transfers",
      "1.0.0",
    );

    // Register all the native token actions
    this.registerAction(tokenBalanceAction);
    this.registerAction(transferAction);
    this.registerAction(agentWalletAction);
  }
}
