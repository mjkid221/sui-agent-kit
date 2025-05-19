import { SuiClient } from "@mysten/sui/client";
import { SuinsClient } from "@/tools/sui";
import { SuiAgentConfig, SuiAgentKitClass } from "@/types/agent";
import { BaseAgentStore } from "@/lib/classes";
import { CetusPoolManager } from "@/tools/sui/cetus";
import { SuilendService } from "@/tools/sui/suilend";
import { SuiWallet } from "@/types/wallet/SuiWallet";

export class SuiAgentKit extends BaseAgentStore implements SuiAgentKitClass {
  public client: SuiClient;
  public suinsClient: SuinsClient;
  public cetusPoolManager: CetusPoolManager;
  public suilendService: SuilendService;

  constructor(
    readonly wallet: SuiWallet,
    readonly config: SuiAgentConfig,
  ) {
    super(config.cache);
    const { url, network } = config.rpc;
    this.client = new SuiClient({
      url,
    });
    // Cetus SDK setup
    this.cetusPoolManager = new CetusPoolManager(this, network, url);
    // Sui NS setup
    this.suinsClient = new SuinsClient({
      client: this.client,
      network,
    });
    // Suilend Service setup
    this.suilendService = new SuilendService(this);
  }
}
