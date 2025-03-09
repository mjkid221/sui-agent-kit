import { SuiAgentKit } from "@/agent/sui";
import {
  createObligationIfNoneExists,
  initializeObligations,
  initializeSuilend,
  initializeSuilendRewards,
  LENDING_MARKET_ID,
  LENDING_MARKET_TYPE,
  sendObligationToUser,
  SuilendClient,
} from "@suilend/sdk";
import { SUI_TYPE_ARG } from "@mysten/sui/utils";
import { BaseCacheStore } from "@/lib/classes/cache/BaseCacheStore";
import { ms } from "ms-extended";
import { Transaction } from "@mysten/sui/transactions";
import { serializeConfiguration } from "@/lib/utils/serialize";
import { formatRewards } from "./liquidityMining";
import { SuilendServiceInterface } from "./SuilendServiceClass";
import { isDeprecated } from "@suilend/frontend-sui";

export class SuilendService
  extends BaseCacheStore
  implements SuilendServiceInterface
{
  public suilendClient?: SuilendClient;
  private _configuration?: Awaited<ReturnType<typeof initializeSuilend>> &
    Awaited<ReturnType<typeof initializeSuilendRewards>>;

  // Getter for configuration to prevent direct modification
  public get configuration() {
    return this._configuration;
  }

  constructor(private readonly agent: SuiAgentKit) {
    super();
  }

  async initialize() {
    this.suilendClient = await SuilendClient.initialize(
      LENDING_MARKET_ID,
      LENDING_MARKET_TYPE,
      this.agent.client,
    );
    const configuration = await initializeSuilend(
      this.agent.client,
      this.suilendClient,
    );
    const rewardConfiguration = await initializeSuilendRewards(
      configuration.reserveMap,
      configuration.activeRewardCoinTypes,
    );
    this._configuration = {
      ...configuration,
      ...rewardConfiguration,
    };
  }

  async depositAssets(amount: number, coinType: string = SUI_TYPE_ARG) {
    this.isClientInitialized();
    const transaction = new Transaction();
    const decimals = await this.agent.requestGetCoinDecimals(coinType);
    const { obligationOwnerCaps } = await this.initializeObligation();

    const obligationOwnerCap = obligationOwnerCaps[0];
    const { obligationOwnerCapId, didCreate } = createObligationIfNoneExists(
      this.suilendClient,
      transaction,
      obligationOwnerCap,
    );

    const value = amount * 10 ** decimals;
    await this.suilendClient.depositIntoObligation(
      this.agent.wallet.toSuiAddress(),
      coinType,
      value.toFixed(0),
      transaction,
      obligationOwnerCapId,
    );
    if (didCreate) {
      sendObligationToUser(
        obligationOwnerCapId,
        this.agent.wallet.toSuiAddress(),
        transaction,
      );
    }

    const { digest } = await this.agent.client.signAndExecuteTransaction({
      transaction,
      signer: this.agent.wallet,
    });

    const response = await this.agent.client.waitForTransaction({ digest });
    return response.digest;
  }

  public async withdrawAsset(coinType: string = SUI_TYPE_ARG) {
    this.isClientInitialized();
    const transaction = new Transaction();
    const { obligationOwnerCaps, obligations } =
      await this.initializeObligation();

    const obligationOwnerCapId = obligationOwnerCaps[0].id;
    const obligationId = obligations[0].id;

    const deposits = await this.getDeposits();
    const depositAmount = deposits.find(
      (deposit) => deposit.coinType === coinType,
    );

    if (!depositAmount) {
      throw new Error("There is no deposit for the specified coin type");
    }

    await this.suilendClient.withdrawAndSendToUser(
      this.agent.wallet.toSuiAddress(),
      obligationOwnerCapId,
      obligationId,
      coinType,
      depositAmount?.cTokenAmount,
      transaction,
    );

    const { digest } = await this.agent.client.signAndExecuteTransaction({
      transaction,
      signer: this.agent.wallet,
    });
    const response = await this.agent.client.waitForTransaction({ digest });
    return response.digest;
  }

  private isClientInitialized(): asserts this is {
    suilendClient: SuilendClient;
  } {
    if (!this.suilendClient) {
      throw new Error("Suilend client not initialized");
    }
  }

  private async ensureInitializedWithFreshConfig() {
    this.isClientInitialized();
    const freshConfig = await this.fetchConfiguration();
    this._configuration = freshConfig;
    return freshConfig;
  }

  public async getReserves() {
    this.isClientInitialized();
    const config = await this.ensureInitializedWithFreshConfig();
    return config.refreshedRawReserves.filter(
      (reserve) =>
        !isDeprecated(reserve.coinType.name.toString()) &&
        BigInt(reserve.config.element?.depositLimit ?? 0) > BigInt(0),
    );
  }

  public async getDeposits() {
    this.isClientInitialized();
    const config = await this.ensureInitializedWithFreshConfig();
    const { obligations } = await initializeObligations(
      this.agent.client,
      this.suilendClient,
      config.refreshedRawReserves,
      config.reserveMap,
      this.agent.wallet.getPublicKey().toSuiAddress(),
    );
    return obligations[0].deposits.map((deposit) => {
      return {
        coinType: deposit.coinType,
        depositedAmount: deposit.depositedAmount.toString(),
        depositedAmountUsd: deposit.depositedAmountUsd.toString(),
        cTokenAmount: deposit.depositedCtokenAmount.toString(),
      };
    });
  }

  private async fetchConfiguration() {
    return this.cache.withCache(
      "suilend-configuration",
      async () => {
        this.isClientInitialized();
        const configuration = await initializeSuilend(
          this.agent.client,
          this.suilendClient,
        );
        const rewardConfiguration = await initializeSuilendRewards(
          configuration.reserveMap,
          configuration.activeRewardCoinTypes,
        );

        // Serialize configuration before caching
        const serializableConfig = serializeConfiguration<
          Awaited<ReturnType<typeof initializeSuilend>> &
            Awaited<ReturnType<typeof initializeSuilendRewards>>,
          false
        >({
          ...configuration,
          ...rewardConfiguration,
        });

        return serializableConfig;
      },
      ms("30s"),
    );
  }

  public async initializeObligation() {
    return this.cache.withCache(
      "suilend-obligation",
      async () => {
        this.isClientInitialized();
        const config = await this.ensureInitializedWithFreshConfig();
        const { obligationOwnerCaps, obligations } =
          await initializeObligations(
            this.agent.client,
            this.suilendClient,
            config.refreshedRawReserves,
            config.reserveMap,
            this.agent.wallet.getPublicKey().toSuiAddress(),
          );
        const rewardMap = formatRewards(
          config.reserveMap,
          config.rewardCoinMetadataMap,
          config.rewardPriceMap,
          obligations,
        );
        return {
          obligationOwnerCaps,
          rewardMap,
          obligations: await serializeConfiguration(obligations),
        };
      },
      ms("30s"),
    );
  }
}
