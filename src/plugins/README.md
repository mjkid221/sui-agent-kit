# SuiAgentKit Plugin System

The SuiAgentKit now supports a plugin-based architecture, allowing you to modularize and extend functionality through plugins.

## Overview

Plugins are self-contained modules that provide specific functionality to the SuiAgentKit. Each plugin can:

- Register one or more actions that users can execute
- Initialize itself with custom logic
- Access the agent instance to perform operations

## Creating a Plugin

To create a new plugin, extend the `BaseSuiPlugin` class:

```typescript
import { BaseSuiPlugin } from "@/plugins/base";
import { Action } from "@/types/action";
import { SuiAgentKitClass } from "@/types/agent";

export class MyPlugin extends BaseSuiPlugin {
  constructor() {
    super(
      "my-plugin-name",
      "Description of what my plugin does",
      "1.0.0"
    );

    // Register actions with this plugin
    this.registerAction(myAction);
    this.registerAction(anotherAction);
  }

  // Optional: Override init to add custom initialization logic
  public async init(agent: SuiAgentKitClass): Promise<void> {
    // Initialize your plugin with the agent instance
    console.log("Initializing my plugin...");
    
    // You can use the agent here to set up your plugin
    // For example, you could prefetch some data or initialize a service
  }
}
```

## Creating Actions

Actions are the core functional units of plugins. Create actions using the `createActionBuilderFor` function:

```typescript
import { SuiAgentKit } from "@/agent/sui";
import { z } from "zod";
import { createActionBuilderFor } from "@/actions/sui/createAction";

const schema = z.object({
  // Define your input schema here
  param1: z.string(),
  param2: z.number().optional(),
});

const myAction = createActionBuilderFor(SuiAgentKit)
  .name("MY_CUSTOM_ACTION")
  .similes([
    "do something custom",
    "custom operation",
  ])
  .description("Description of what this action does")
  .examples([
    [
      {
        input: { param1: "example", param2: 123 },
        output: { status: "success", result: "done" },
        explanation: "Example of using this action",
      },
    ],
  ])
  .schema(schema)
  .handler(async (agent, input) => {
    // Implement your action logic here
    console.log(`Processing with params: ${input.param1}, ${input.param2}`);
    
    // Use the agent to interact with the blockchain
    // For example:
    // const balance = await agent.client.getBalance(input.param1);
    
    return {
      status: "success",
      result: "Your custom result",
    };
  });

export default myAction;
```

## Using Plugins

To use plugins with SuiAgentKit:

```typescript
import { SuiAgentKit } from "@/agent/sui";
import { MyPlugin } from "./plugins/my-plugin";
import { AnotherPlugin } from "./plugins/another-plugin";
import { registerPlugins } from "@/plugins";

// Initialize your SuiAgentKit instance
const agent = new SuiAgentKit(wallet, config);

// Create instances of your plugins
const myPlugin = new MyPlugin();
const anotherPlugin = new AnotherPlugin();

// Register plugins with the agent
await registerPlugins(agent, [myPlugin, anotherPlugin]);

// Now you can use actions from the plugins
const result = await agent.executeAction("MY_CUSTOM_ACTION", {
  param1: "value",
  param2: 42,
});

console.log(result); // { status: "success", result: "Your custom result" }
```

## Plugin Organization

Plugins should be organized in the `src/plugins` directory:

- `src/plugins/base.ts` - Base plugin class
- `src/plugins/index.ts` - Plugin registry and helper functions
- `src/plugins/[category]/[plugin-name]/index.ts` - Specific plugin implementations

## Default Plugins

The SuiAgentKit comes with several default plugins:

- `NativeTokenPlugin` - Core Sui token operations like balance checking and transfers

You can get all default plugins using the `getDefaultPlugins()` function:

```typescript
import { getDefaultPlugins, registerPlugins } from "@/plugins";

// Register all default plugins
await registerPlugins(agent, getDefaultPlugins());
``` 