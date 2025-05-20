import { SuiAgentKit } from "@/agent/sui";
import { Plugin } from "@/types/plugin";
import { SuiAgentKitClass } from "@/types/agent";
import { NativeTokenPlugin } from "./sui/native";
import { CetusPlugin } from "./sui/cetus";
import { DexScreenerPlugin } from "./sui/dexScreener";
import { FlowXPlugin } from "./sui/flowX";
import { GoPlusLabsPlugin } from "./sui/goPlusLabs";
import { SuiLendPlugin } from "./sui/suilend";
import { SuiNSPlugin } from "./sui/suins";

/**
 * Register a collection of plugins with a SuiAgentKit instance
 * @param agent The agent to register plugins with
 * @param plugins Array of plugins to register
 */
export async function registerPlugins(
  agent: SuiAgentKit,
  plugins: Plugin<SuiAgentKitClass>[],
): Promise<void> {
  for (const plugin of plugins) {
    await agent.registerPlugin(plugin);
  }
}

// Export all plugin classes
export * from "./sui/native";
export * from "./sui/cetus";
export * from "./sui/dexScreener";
export * from "./sui/flowX";
export * from "./sui/goPlusLabs";
export * from "./sui/suilend";
export * from "./sui/suins";

// Example of how to create a default bundle of plugins
export function getDefaultPlugins(): Plugin<SuiAgentKitClass>[] {
  return [
    new NativeTokenPlugin(),
    new CetusPlugin(),
    new DexScreenerPlugin(),
    new FlowXPlugin(),
    new GoPlusLabsPlugin(),
    new SuiLendPlugin(),
    new SuiNSPlugin(),
    // Add more default plugins here as they are created
  ];
}
