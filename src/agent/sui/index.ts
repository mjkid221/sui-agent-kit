import { getFullnodeUrl, SuiClient } from "@mysten/sui/client";
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";
import {
  requestFaucetFunds,
  requestCoinBalance,
  requestTransferCoin,
  requestRegisterDomain,
  requestResolveDomain,
  requestTrade,
} from "../../tools/sui";
import { SuiAgentKitClass } from "../../types/SuiAgentKitClass";
import { requestDeployCoin } from "../../tools/sui/requestDeployCoin";
import { TokenCreationInterface } from "../../tools/sui/requestDeployCoin/types";
import { SuinsClient } from "@mysten/suins";

export class SuiAgentKit implements SuiAgentKitClass {
  public wallet: Ed25519Keypair;
  public client: SuiClient;
  public suinsClient: SuinsClient;
  public agentNetwork: "testnet" | "mainnet";

  constructor({
    ed25519PrivateKey,
    rpcUrl,
    agentNetwork = "mainnet",
  }: {
    ed25519PrivateKey: string;
    rpcUrl?: string;
    agentNetwork: "testnet" | "mainnet";
  }) {
    this.client = new SuiClient({
      url: rpcUrl ?? getFullnodeUrl(agentNetwork),
    });
    this.suinsClient = new SuinsClient({
      client: this.client,
      network: agentNetwork,
    });
    this.wallet = Ed25519Keypair.fromSecretKey(ed25519PrivateKey);
    this.agentNetwork = agentNetwork;
  }

  async requestFaucetFunds() {
    return requestFaucetFunds(this);
  }

  async requestGetBalance(coinType?: string, walletAddress?: string) {
    return requestCoinBalance(this, coinType, walletAddress);
  }

  async requestDeployCoin(
    tokenInfo: TokenCreationInterface,
    feeConfig?: {
      treasury: string;
      fee: number;
    },
  ) {
    return requestDeployCoin(this, tokenInfo, feeConfig);
  }

  async requestTransferCoinOrToken(
    amount: number,
    to: string,
    coinType?: string,
  ) {
    return requestTransferCoin(this, to, amount, coinType);
  }

  async requestRegisterDomain(name: string, years: number) {
    return requestRegisterDomain(this, name, years);
  }

  async requestResolveDomain(domain: string) {
    return requestResolveDomain(this, domain);
  }

  async requestTrade(
    outputCoinType: string,
    inputAmount: number,
    inputCoinType?: string,
    slippageBps?: number,
    commission?: {
      feePercentage: number;
      feeRecipient: string;
    },
  ) {
    return requestTrade(
      this,
      outputCoinType,
      inputAmount,
      inputCoinType,
      slippageBps,
      commission,
    );
  }
}
