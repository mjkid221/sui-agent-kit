import { tool } from "@langchain/core/tools";
import { Action } from "@/types/action";
import { BaseAgentKitClass } from "@/types/agent";

export function createLangchainTools<T extends BaseAgentKitClass>(
  agentKit: T,
  actions: Action<T>[],
) {
  if (actions.length > 128) {
    console.warn(
      `Too many actions provided. Only a maximum of 128 actions allowed. You provided ${actions.length}, the last ${actions.length - 128} will be ignored.`,
    );
  }

  const tools = actions.slice(0, 127).map((action) => {
    const toolInstance = tool(
      async (inputs) => JSON.stringify(await action.handler(agentKit, inputs)),
      {
        name: action.name,
        description: `
      ${action.description}

      Similes: ${action.similes.map(
        (simile) => `
        ${simile}
      `,
      )}

      Examples: ${action.examples.map(
        (example) => `
        Input: ${JSON.stringify(example[0].input)}
        Output: ${JSON.stringify(example[0].output)}
        Explanation: ${example[0].explanation}
      `,
      )}`,
        schema: action.schema,
      },
    );

    return toolInstance;
  });

  return tools;
}
