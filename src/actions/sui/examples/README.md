# Sui Action Builder Examples

This directory contains examples demonstrating how to use the unified action builder pattern for creating Sui actions with and without schemas.

## Overview

Actions are core components that define interactions between agents and the blockchain. The action builder pattern provides a fluent API for creating actions, improving type safety and developer experience.

## Creating Actions Without Schema

Use this pattern when your action doesn't require any input parameters. The handler function will only receive the agent instance.

```typescript
import { SuiAgentKit } from "@/agent/sui";
import { createActionBuilderFor } from "../createAction";

const noSchemaAction = createActionBuilderFor(SuiAgentKit)
  .name("actionName")
  .similes(["alternative name", "another name"])
  .description("Description of what the action does")
  .examples([
    [
      {
        input: {},
        output: { result: "example output" },
        explanation: "Explanation of this example",
      },
    ],
  ])
  .handler(async (agent) => {
    // Implement action logic here
    return {
      status: "success",
      // Additional return values
    };
  });

export default noSchemaAction;
```

## Creating Actions With Schema

Use this pattern when your action requires input parameters. The schema will provide type safety and validation for the input.

```typescript
import { SuiAgentKit } from "@/agent/sui";
import { z } from "zod";
import { createActionBuilderFor } from "../createAction";

const withSchemaAction = createActionBuilderFor(SuiAgentKit)
  .name("actionName")
  .similes(["alternative name", "another name"])
  .description("Description of what the action does")
  .examples([
    [
      {
        input: { param1: "value1" },
        output: { result: "example output" },
        explanation: "Explanation of this example",
      },
    ],
  ])
  .schema(
    z.object({
      param1: z.string(),
      param2: z.number().optional(),
    })
  )
  .handler(async (agent, input) => {
    // Input is typed based on the schema
    const { param1, param2 } = input;
    
    // Implement action logic here
    return {
      status: "success",
      // Additional return values
    };
  });

export default withSchemaAction;
```

## Type Safety

The action builder provides full type safety via conditional types:

1. For actions without a schema, the handler receives only the agent parameter
2. For actions with a schema, the handler receives both the agent and a typed input parameter
3. The schema is defined using Zod, providing runtime validation and TypeScript types

## Implementation Details

The action builder implementation uses:

1. A unified `ActionBase<Schema>` interface with an optional schema property
2. A single `Handler<T, Schema>` type that conditionally includes input based on schema presence
3. A simplified `Action<T, Schema>` type that combines base properties with handler
4. A single builder class that handles both with-schema and without-schema cases
5. A fluid API with method chaining for convenient action definition

## Best Practices

1. Always provide meaningful examples to help users understand how to use the action
2. Use similes to improve natural language recognition of the action
3. Return a consistent response format, typically including a `status` field
4. Use descriptive names for your actions that clearly indicate their purpose 