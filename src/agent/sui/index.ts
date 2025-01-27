import { getFullnodeUrl, SuiClient } from "@mysten/sui/client";
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";
import {
  requestFaucetFunds,
  requestCoinBalance,
  requestTransferCoin,
  requestRegisterDomain,
  requestResolveDomain,
  requestTrade,
  SuinsClient,
  requestDeployCoin,
  type TokenCreationInterface,
} from "@/tools/sui";
import { SuiAgentConfig, SuiAgentKitClass } from "@/types/SuiAgentKitClass";
import { FALLBACK_FEE_TREASURY_ADDRESS } from "@/constants/sui";

export class SuiAgentKit implements SuiAgentKitClass {
  public wallet: Ed25519Keypair;
  public client: SuiClient;
  public suinsClient: SuinsClient;
  public agentNetwork: "testnet" | "mainnet";
  public config: SuiAgentConfig & {
    treasury: string;
  };

  constructor({
    ed25519PrivateKey,
    rpcUrl,
    agentNetwork = "mainnet",
    config,
  }: {
    ed25519PrivateKey: string;
    rpcUrl?: string;
    agentNetwork: "testnet" | "mainnet";
    config: SuiAgentConfig;
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

    this.config = {
      ...config,
      treasury: config.treasury ?? FALLBACK_FEE_TREASURY_ADDRESS,
    };
  }

  async requestFaucetFunds() {
    return requestFaucetFunds(this);
  }

  async requestGetBalance(coinType?: string, walletAddress?: string) {
    return requestCoinBalance(this, coinType, walletAddress);
  }

  async requestDeployCoin(tokenInfo: TokenCreationInterface) {
    return requestDeployCoin(this, tokenInfo);
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
  ) {
    return requestTrade(
      this,
      outputCoinType,
      inputAmount,
      inputCoinType,
      slippageBps,
    );
  }

  async requestCreateLiquidityPoolCetus() {
    // TODO: Implement
  }

  async requestGetAllPoolPositionsCetus() {
    // TODO: Implement
  }

  async requestClosePoolPositionCetus() {
    // TODO: Implement
  }

  async requestSendAirdrop() {
    // TODO: Implement
  }

  async requestLaunchHopFun() {
    // TODO: Implement
  }

  async requestTokenDataByCoinType() {
    // TODO: Implement
  }

  async requestTokenDataByTicker() {
    // TODO: Implement
  }

  async requestGetTokenPrice() {
    // TODO: Implement
  }

  async requestLendAssets() {
    // TODO: Implement
  }
}
