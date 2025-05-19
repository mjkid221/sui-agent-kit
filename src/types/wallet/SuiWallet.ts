import { Ed25519PublicKey } from "@mysten/sui/keypairs/ed25519";
import { Transaction as SuiTransaction } from "@mysten/sui/transactions";
import { BaseWallet } from "./BaseWallet";

/**
 * Sui-specific wallet implementation
 */
export type SuiWallet = BaseWallet<Ed25519PublicKey, SuiTransaction>;
