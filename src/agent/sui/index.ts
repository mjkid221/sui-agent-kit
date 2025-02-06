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
import {
  getTokenAddressFromTicker,
  getTokenDataByAddress,
  getTokenDataByTicker,
  getTokenPriceByAddress,
} from "@/lib/helpers/token";
import { ChainIdentifier } from "@/types/chain";
import { BaseCacheStore } from "@/lib/classes/cache";
import {
  createTokenAddressFromTickerCacheKey,
  createTokenDataByAddressCacheKey,
  createTokenDataByTickerCacheKey,
  createTokenDecimalsCacheKey,
  createTokenPriceCacheKey,
} from "@/lib/helpers/cache";
import { getCoinDecimals } from "@/tools/sui/native/requestCoinBalance/getCoinDecimals";
import { SUI_TYPE_ARG } from "@mysten/sui/utils";
import { sec } from "ms-extended";
import CetusClmmSDK, { initCetusSDK } from "@cetusprotocol/cetus-sui-clmm-sdk";
import {
  requestCreateClmmPool,
  requestGetPoolPositions,
} from "@/tools/sui/cetus";
import { CETUS_FEE_TIERS } from "@/tools/sui/cetus/fees";

export class SuiAgentKit extends BaseCacheStore implements SuiAgentKitClass {
  public wallet: Ed25519Keypair;
  public client: SuiClient;
  public suinsClient: SuinsClient;
  public agentNetwork: "testnet" | "mainnet";
  public config: SuiAgentConfig & {
    treasury: string;
  };
  public cetusSDK: CetusClmmSDK;

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
    const rpc = rpcUrl ?? getFullnodeUrl(agentNetwork);
    this.client = new SuiClient({
      url: rpc,
    });
    this.suinsClient = new SuinsClient({
      client: this.client,
      network: agentNetwork,
    });
    this.cetusSDK = initCetusSDK({
      network: agentNetwork,
      fullNodeUrl: rpc,
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

  async requestAgentWalletAddress() {
    return this.wallet.toSuiAddress();
  }

  async requestGetBalance(coinType?: string, walletAddress?: string) {
    return requestCoinBalance(this, coinType, walletAddress);
  }

  async requestGetCoinDecimals(coinType?: string) {
    return this.cache.withCache(
      createTokenDecimalsCacheKey(coinType ?? SUI_TYPE_ARG),
      () => getCoinDecimals(this, coinType),
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

  async requestCreateClmmPoolCetus(
    coinTypeA: string,
    coinTypeADepositAmount: number,
    coinTypeB: string,
    initialPrice: number,
    feeTier: keyof typeof CETUS_FEE_TIERS,
    slippage: number = 5, // 5%
  ) {
    return requestCreateClmmPool(
      this,
      coinTypeA,
      coinTypeADepositAmount,
      coinTypeB,
      initialPrice,
      feeTier,
      slippage,
    );
  }

  async requestGetAllPoolPositionsCetus() {
    return requestGetPoolPositions(this);
  }

  async requestClosePoolPositionCetus() {
    throw new Error("Not implemented");
  }

  async requestSendAirdrop() {
    throw new Error("Not implemented");
  }

  async requestLaunchHopFun() {
    throw new Error("Not implemented");
  }

  async requestAssetDataByCoinType(coinType: string) {
    return this.cache.withCache(
      createTokenDataByAddressCacheKey(coinType, ChainIdentifier.SUI),
      () => getTokenDataByAddress(coinType, ChainIdentifier.SUI),
      sec("5m"),
    );
  }

  async getAssetAddressFromTicker(ticker: string) {
    return this.cache.withCache(
      createTokenAddressFromTickerCacheKey(ticker, ChainIdentifier.SUI),
      () => getTokenAddressFromTicker(ticker, ChainIdentifier.SUI),
      sec("5m"),
    );
  }

  async requestAssetDataByTicker(ticker: string) {
    return this.cache.withCache(
      createTokenDataByTickerCacheKey(ticker, ChainIdentifier.SUI),
      () => getTokenDataByTicker(ticker, ChainIdentifier.SUI),
      sec("5m"),
    );
  }

  async requestGetAssetPrice(coinType: string) {
    return this.cache.withCache(
      createTokenPriceCacheKey(coinType, ChainIdentifier.SUI),
      () => getTokenPriceByAddress(coinType, ChainIdentifier.SUI),
      sec("5m"),
    );
  }

  async requestLendAssets() {
    throw new Error("Not implemented");
  }
}
