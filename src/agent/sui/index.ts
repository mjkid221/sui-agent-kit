import { getFullnodeUrl, SuiClient } from "@mysten/sui/client";
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";
import {
  SuinsClient,
  requestFaucetFunds,
  requestCoinBalance,
  requestTransferCoin,
  requestRegisterDomain,
  requestResolveDomain,
  requestTrade,
  requestDeployCoin,
  type TokenCreationInterface,
} from "@/tools/sui";
import { SuiAgentConfig, SuiAgentKitClass } from "@/types/agent";
import { FALLBACK_FEE_TREASURY_ADDRESS } from "@/constants/sui";
import { getTokenDataByAddress } from "@/lib/helpers/token/getTokenData";
import { ChainIdentifier } from "@/types/chain";

import { BaseCacheStore } from "@/lib/classes/cache";
import {
  createTokenDataByAddressCacheKey,
  createTokenDataByTickerCacheKey,
  createTokenDecimalsCacheKey,
} from "@/lib/helpers/cache";
import { getCoinDecimals } from "@/tools/sui/native/requestCoinBalance/getCoinDecimals";
import { SUI_TYPE_ARG } from "@mysten/sui/utils";
import { sec } from "ms-extended";

export class SuiAgentKit extends BaseCacheStore implements SuiAgentKitClass {
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
    super();
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

  async requestGetCoinDecimals(coinType?: string) {
    return this.cache.withCache(
      createTokenDecimalsCacheKey(coinType ?? SUI_TYPE_ARG),
      () => getCoinDecimals(this, coinType),
      sec("5m"),
    );
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

  async requestCreateClmmPoolCetus() {
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

  async requestTokenDataByCoinType(coinType: string) {
    return this.cache.withCache(
      createTokenDataByAddressCacheKey(coinType, ChainIdentifier.SUI),
      () => getTokenDataByAddress(coinType, ChainIdentifier.SUI),
      sec("5m"),
    );
  }

  async requestTokenDataByTicker(coinType: string) {
    return this.cache.withCache(
      createTokenDataByTickerCacheKey(coinType, ChainIdentifier.SUI),
      () => getTokenDataByAddress(coinType, ChainIdentifier.SUI),
      sec("5m"),
    );
  }

  async requestGetTokenPrice() {
    // TODO: Implement
  }

  async requestLendAssets() {
    // TODO: Implement
  }
}
