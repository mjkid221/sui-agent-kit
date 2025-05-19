import { Ed25519PublicKey } from "@mysten/sui/keypairs/ed25519";
import { Transaction } from "@mysten/sui/transactions";

export interface SuiWallet {
  /**
   * The public key of the connected wallet
   * @type {Ed25519PublicKey}
   */
  readonly publicKey: Ed25519PublicKey;

  /**
   * Signs a single transaction
   * @template T - Transaction type
   * @param {T} transaction - The transaction to be signed
   * @returns {Promise<T>} Promise resolving to the signed transaction
   */
  signTransaction?<T extends Transaction>(transaction: T): Promise<T>;

  /**
   * Sends a transaction on chain
   * @template T - Transaction type
   * @param {T} transaction - The transaction to be signed and sent
   */
  sendTransaction?: <T extends Transaction>(transaction: T) => Promise<string>;

  /**
   * Signs and sends a transaction to the network
   * @template T - Transaction type
   * @param {T} transaction - The transaction to be signed and sent
   * @param {SendOptions} [options] - Optional transaction send configuration
   * @returns {Promise<{digest: string}>} Promise resolving to the transaction digest
   */
  signAndSendTransaction: <T extends Transaction>(
    transaction: T,
  ) => Promise<{ digest: string }>;

  /**
   * Signs a message
   * @param message - The message to be signed
   */
  signMessage(message: Uint8Array | string): Promise<string>;
}
