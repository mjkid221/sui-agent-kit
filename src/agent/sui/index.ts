import { SuiClient } from "@mysten/sui/client";
import { SuinsClient } from "@/tools/sui";
import { SuiAgentConfig, SuiAgentKitClass } from "@/types/agent";
import { CetusPoolManager } from "@/tools/sui/cetus";
import { SuilendService } from "@/tools/sui/suilend";
import { SuiWallet } from "@/types/wallet/SuiWallet";
import { Action } from "@/types/action";
import { Plugin } from "@/types/plugin";

export class SuiAgentKit implements SuiAgentKitClass {
  public client: SuiClient;
  public suinsClient: SuinsClient;
  public cetusPoolManager: CetusPoolManager;
  public suilendService: SuilendService;
  public plugins: Map<string, Plugin<SuiAgentKitClass>> = new Map();
  public actions: Map<string, Action<SuiAgentKitClass>> = new Map();

  constructor(
    readonly wallet: SuiWallet,
    readonly config: SuiAgentConfig,
  ) {
    // super(config.cache);
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

  /**
   * Register a plugin with the agent
   * @param plugin Plugin to register
   */
  public async registerPlugin(plugin: Plugin<SuiAgentKitClass>): Promise<void> {
    // Check if the plugin is already registered
    if (this.plugins.has(plugin.name)) {
      throw new Error(`Plugin '${plugin.name}' is already registered`);
    }

    // Register the plugin
    this.plugins.set(plugin.name, plugin);

    // Register the plugin's actions
    for (const action of plugin.actions) {
      if (this.actions.has(action.name)) {
        console.warn(
          `Action '${action.name}' is already registered. Overwriting...`,
        );
      }
      this.actions.set(action.name, action);
    }

    // Initialize the plugin if it has an init method
    if (plugin.init) {
      await plugin.init(this);
    }
  }

  /**
   * Get an action by name
   * @param actionName Name of the action to get
   */
  public getAction(actionName: string): Action<SuiAgentKitClass> | undefined {
    return this.actions.get(actionName);
  }

  /**
   * Execute an action by name with the given input
   * @param actionName Name of the action to execute
   * @param input Input for the action
   */
  public async executeAction(
    actionName: string,
    input?: Record<string, unknown>,
  ): Promise<Record<string, unknown>> {
    const action = this.getAction(actionName);

    if (!action) {
      throw new Error(`Action '${actionName}' not found`);
    }

    // Validate input against schema if provided
    if (action.schema && input) {
      const result = action.schema.safeParse(input);
      if (!result.success) {
        throw new Error(
          `Invalid input for action '${actionName}': ${result.error.message}`,
        );
      }
    }

    // Execute the action
    // @ts-ignore - The handler type is complex due to conditional typing, but this is safe
    return action.handler(this, input);
  }

  /**
   * Get all registered actions as an array
   * @returns Array of all actions registered with the agent
   */
  public getActions(): Action<SuiAgentKitClass>[] {
    return Array.from(this.actions.values());
  }
}
