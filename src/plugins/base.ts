import { Action } from "@/types/action";
import { SuiAgentKitClass } from "@/types/agent";
import { Plugin } from "@/types/plugin";

/**
 * Base class for Sui plugins
 */
export abstract class BaseSuiPlugin<T extends SuiAgentKitClass>
  implements Plugin<T>
{
  public actions: Action<T, any>[] = [];

  /**
   * @param name Unique name of the plugin
   * @param description Description of what the plugin does
   * @param version Version of the plugin
   */
  constructor(
    public readonly name: string,
    public readonly description: string,
    public readonly version: string,
  ) {}

  /**
   * Register an action with the plugin
   * @param action Action to register
   */
  protected registerAction<Schema>(action: Action<T, Schema>): void {
    this.actions.push(action);
  }

  /**
   * Initialize the plugin with the agent instance
   * Override this method to add custom initialization logic
   * @param agent The agent instance
   */
  public async init(_agent: T): Promise<void> {
    // By default, do nothing
  }
}
