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
import { BaseAgentStore } from "@/lib/classes";
import {
  createTokenAddressFromTickerCacheKey,
  createTokenDataByAddressCacheKey,
  createTokenDataByTickerCacheKey,
  createTokenDecimalsCacheKey,
  createTokenPriceCacheKey,
} from "@/lib/helpers/cache";
import { getCoinDecimals } from "@/tools/sui/native/requestCoinBalance/getCoinDecimals";
import { SUI_TYPE_ARG } from "@mysten/sui/utils";
import { ms } from "ms-extended";
import { CetusPoolManager } from "@/tools/sui/cetus";
import { CETUS_FEE_TIERS } from "@/tools/sui/cetus/fees";
import { SuilendService } from "@/tools/sui/suilend";

export class SuiAgentKit extends BaseAgentStore implements SuiAgentKitClass {
  public wallet: Ed25519Keypair;
  public client: SuiClient;
  public suinsClient: SuinsClient;
  public agentNetwork: "testnet" | "mainnet";
  public config: SuiAgentConfig & {
    treasury: string;
  };
  public cetusPoolManager: CetusPoolManager;
  public suilendService: SuilendService;

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
    super(config.cache);
    const rpc = rpcUrl ?? getFullnodeUrl(agentNetwork);
    this.client = new SuiClient({
      url: rpc,
    });
    this.wallet = Ed25519Keypair.fromSecretKey(ed25519PrivateKey);
    this.agentNetwork = agentNetwork;
    this.config = {
      ...config,
      treasury: config.treasury ?? FALLBACK_FEE_TREASURY_ADDRESS,
    };
    // Cetus SDK setup
    this.cetusPoolManager = new CetusPoolManager(this, agentNetwork, rpc);
    // Sui NS setup
    this.suinsClient = new SuinsClient({
      client: this.client,
      network: agentNetwork,
    });
    // Suilend Service setup
    this.suilendService = new SuilendService(this);
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
    return this.cetusPoolManager.createClmmPool(
      coinTypeA,
      coinTypeADepositAmount,
      coinTypeB,
      initialPrice,
      feeTier,
      slippage,
    );
  }

  async requestGetAllPoolPositionsCetus() {
    return this.cetusPoolManager.getPoolPositions();
  }

  async requestOpenPoolPositionCetus(
    poolId: string,
    coinTypeA: string,
    amountA: number,
    slippagePercentage: number,
    existingPositionId?: string,
  ) {
    return this.cetusPoolManager.openPositionAndAddLiquidity(
      poolId,
      coinTypeA,
      amountA,
      slippagePercentage,
      existingPositionId,
    );
  }

  async requestClosePoolPositionCetus() {
    // TODO: implement
    return this.cetusPoolManager.closePoolPosition();
  }

  async requestSendAirdrop() {
    // TODO: Implement
    throw new Error("Not implemented");
  }

  async requestLaunchHopFun() {
    // TODO: Implement
    throw new Error("Not implemented");
  }

  async requestAssetDataByCoinType(coinType: string) {
    return this.cache.withCache(
      createTokenDataByAddressCacheKey(coinType, ChainIdentifier.SUI),
      () => getTokenDataByAddress(coinType, ChainIdentifier.SUI),
      ms("5m"),
    );
  }

  async getAssetAddressFromTicker(ticker: string) {
    return this.cache.withCache(
      createTokenAddressFromTickerCacheKey(ticker, ChainIdentifier.SUI),
      () => getTokenAddressFromTicker(ticker, ChainIdentifier.SUI),
      ms("5m"),
    );
  }

  async requestAssetDataByTicker(ticker: string) {
    return this.cache.withCache(
      createTokenDataByTickerCacheKey(ticker, ChainIdentifier.SUI),
      () => getTokenDataByTicker(ticker, ChainIdentifier.SUI),
      ms("5m"),
    );
  }

  async requestGetAssetPrice(coinType: string) {
    return this.cache.withCache(
      createTokenPriceCacheKey(coinType, ChainIdentifier.SUI),
      () => getTokenPriceByAddress(coinType, ChainIdentifier.SUI),
      ms("5m"),
    );
  }

  async requestLendAssets() {
    throw new Error("Not implemented");
  }
}
