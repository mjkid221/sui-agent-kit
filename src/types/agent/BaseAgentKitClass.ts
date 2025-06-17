import { BaseWallet } from "../wallet/BaseWallet";

/**
 * Base agent kit interface that can be implemented for any blockchain
 * @template W - Wallet type
 */
export interface BaseAgentKitClass<W extends BaseWallet = BaseWallet> {
  wallet: W;
}
