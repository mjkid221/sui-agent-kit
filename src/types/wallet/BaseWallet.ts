/**
 * Generic wallet interface that can be implemented for any blockchain
 * @template PK - Public key type
 * @template TX - Transaction type
 */
export interface BaseWallet<PK = unknown, TX = unknown> {
  /**
   * The public key of the connected wallet
   */
  readonly publicKey: PK;

  /**
   * Signs a single transaction (optional)
   * @param transaction - The transaction to be signed
   */
  signTransaction?(transaction: TX): Promise<TX>;

  /**
   * Sends a transaction on chain (optional)
   * @param transaction - The transaction to be sent
   */
  sendTransaction?(transaction: TX): Promise<string>;

  /**
   * Signs and sends a transaction to the network
   * @param transaction - The transaction to be signed and sent
   */
  signAndSendTransaction(transaction: TX): Promise<{ digest: string }>;

  /**
   * Signs a message
   * @param message - The message to be signed
   */
  signMessage(message: Uint8Array | string): Promise<string>;
}
