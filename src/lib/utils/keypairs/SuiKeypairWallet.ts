import { SuiWallet } from "@/types/wallet/SuiWallet";
import { Ed25519Keypair, Ed25519PublicKey } from "@mysten/sui/keypairs/ed25519";
import { SuiClient } from "@mysten/sui/client";
import { Transaction } from "@mysten/sui/transactions";

type BaseConfig = {
  rpcUrl: string;
};

type SponsoredConfig = BaseConfig & {
  isSponsored: true;
  payer: Ed25519Keypair;
};

type UnsponsoredConfig = BaseConfig & {
  isSponsored: false;
};

type SuiWalletConfig = SponsoredConfig | UnsponsoredConfig;

export class SuiKeypairWallet implements SuiWallet {
  public client: SuiClient;
  public readonly publicKey: Ed25519PublicKey;
  constructor(
    private readonly keypair: Ed25519Keypair,
    public readonly config: SuiWalletConfig,
  ) {
    this.client = new SuiClient({ url: config.rpcUrl });
    this.publicKey = this.keypair.getPublicKey();
  }

  async signMessage(message: Uint8Array | string) {
    if (typeof message === "string") {
      message = new TextEncoder().encode(message);
    }
    const { signature } = await this.keypair.signPersonalMessage(message);
    return signature;
  }

  async signAndSendTransaction(transaction: Transaction) {
    if (!this.config.isSponsored) {
      return this.signAndExecuteTransaction(transaction, this.keypair);
    } else {
      const kindBytes = await transaction.build({
        client: this.client,
        onlyTransactionKind: true,
      });
      const sponsoredTx = Transaction.fromKind(kindBytes);
      sponsoredTx.setSender(this.publicKey.toSuiAddress());
      sponsoredTx.setGasOwner(this.config.payer.toSuiAddress());
      sponsoredTx.sign({
        signer: this.keypair,
      });
      return this.signAndExecuteTransaction(sponsoredTx, this.config.payer);
    }
  }

  private async signAndExecuteTransaction(
    transaction: Transaction,
    signer: Ed25519Keypair,
  ) {
    const response = await this.client.signAndExecuteTransaction({
      transaction,
      signer,
    });
    await this.client.waitForTransaction({ digest: response.digest });
    return response;
  }
}
