import { Action } from "./action";
import { BaseAgentKitClass } from "./agent";

/**
 * Interface for a plugin that can be registered with an agent class
 */
export interface Plugin<T extends BaseAgentKitClass> {
  /**
   * Unique name of the plugin
   */
  name: string;

  /**
   * Description of what the plugin does
   */
  description: string;

  /**
   * Version of the plugin
   */
  version: string;

  /**
   * Actions provided by this plugin
   */
  actions: Action<T, any>[];

  /**
   * Initialize the plugin with the agent instance
   * This is called when the plugin is registered with the agent
   * @param agent The agent instance
   */
  init?: (agent: T) => Promise<void>;
}
