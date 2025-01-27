import { ChatOpenAI } from "@langchain/openai";
import { SuiAgentKit } from "../src/agent/sui";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { MemorySaver } from "@langchain/langgraph";
import { createSuiTools } from "../src/langchain/sui";
import * as readline from "readline";
import { HumanMessage } from "@langchain/core/messages";
import dotenv from "dotenv";
import { getEnv } from "./utils/env";
import { PostgresSaver } from "@langchain/langgraph-checkpoint-postgres";

dotenv.config();
const env = getEnv();

async function initializeAgent() {
  try {
    const suiAgent = new SuiAgentKit({
      ed25519PrivateKey: env.SUI_PRIVATE_KEY,
      agentNetwork: env.AGENT_NETWORK,
      config: {
        treasury: env.FEE_TREASURY_ADDRESS,
        coinDeployFixedFee: env.COIN_DEPLOY_FIXED_FEE,
        tradeCommissionFeeBps: env.TRADING_COMMISSION_FEE_BPS,
      },
    });

    // Create Sui-specific tools
    const tools = createSuiTools(suiAgent);

    // Create an LLM Chain
    const llm = new ChatOpenAI({
      modelName: "gpt-4o-mini",
      temperature: 0.7,
      apiKey: env.OPENAI_API_KEY,
    });

    const config = { configurable: { thread_id: "Sui Agent Kit!" } };

    const memorySetter = process.env.POSTGRES_DB_URL
      ? async () => {
          const checkpointer = PostgresSaver.fromConnString(
            process.env.POSTGRES_DB_URL!,
          );
          await checkpointer.setup();
          return checkpointer;
        }
      : async () => new MemorySaver();

    const agent = createReactAgent({
      llm,
      tools,
      checkpointSaver: await memorySetter(),
      messageModifier: `
        You are a helpful agent that can interact onchain using the Sui Agent Kit. You are
        empowered to interact onchain using your tools. If you ever need funds, you can request them from the
        faucet. If not, you can provide your wallet details and request funds from the user. If there is a 5XX
        (internal) HTTP error code, ask the user to try again later. If someone asks you to do something you
        can't do with your currently available tools, you must say so, and encourage them to implement it
        themselves using the Sui Agent Kit, recommend they contribute to "https://github.com/mjkid221/sui-agent-kit" for more information. Be
        concise and helpful with your responses. Refrain from restating your tools' descriptions unless it is explicitly requested.
      `,
    });

    return { agent, config };
  } catch (error) {
    console.error("Failed to initialize agent:", error);
    throw error;
  }
}

async function runAutonomousMode(agent: any, config: any, interval = 10) {
  console.log("Starting autonomous mode...");

  while (true) {
    try {
      const thought =
        "Be creative and do something interesting on the blockchain. " +
        "Choose an action or set of actions and execute it that highlights your abilities.";

      const stream = await agent.stream(
        { messages: [new HumanMessage(thought)] },
        config,
      );

      for await (const chunk of stream) {
        if ("agent" in chunk) {
          console.log(chunk.agent.messages[0].content);
        } else if ("tools" in chunk) {
          console.log(chunk.tools.messages[0].content);
        }
        console.log("-------------------");
      }

      await new Promise((resolve) => setTimeout(resolve, interval * 1000));
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error:", error.message);
      }
      process.exit(1);
    }
  }
}

async function main() {
  try {
    console.log("Starting Agent...");
    const { agent, config } = await initializeAgent();
    const mode = await chooseMode();

    if (mode === "chat") {
      await runChatMode(agent, config);
    } else {
      await runAutonomousMode(agent, config);
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error:", error.message);
    }
    process.exit(1);
  }
}
async function runChatMode(agent: any, config: any) {
  console.log("Starting chat mode... Type 'exit' to end.");

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const question = (prompt: string): Promise<string> =>
    new Promise((resolve) => rl.question(prompt, resolve));

  try {
    while (true) {
      const userInput = await question("\nPrompt: ");

      if (userInput.toLowerCase() === "exit") {
        break;
      }

      const stream = await agent.stream(
        { messages: [new HumanMessage(userInput)] },
        config,
      );

      for await (const chunk of stream) {
        if ("agent" in chunk) {
          console.log(chunk.agent.messages[0].content);
        } else if ("tools" in chunk) {
          console.log(chunk.tools.messages[0].content);
        }
        console.log("-------------------");
      }
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error:", error.message);
    }
    process.exit(1);
  } finally {
    rl.close();
  }
}

async function chooseMode(): Promise<"chat" | "auto"> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const question = (prompt: string): Promise<string> =>
    new Promise((resolve) => rl.question(prompt, resolve));

  while (true) {
    console.log("\nAvailable modes:");
    console.log("1. chat    - Interactive chat mode");
    console.log("2. auto    - Autonomous action mode");

    const choice = (await question("\nChoose a mode (enter number or name): "))
      .toLowerCase()
      .trim();

    rl.close();

    if (choice === "1" || choice === "chat") {
      return "chat";
    } else if (choice === "2" || choice === "auto") {
      return "auto";
    }
    console.log("Invalid choice. Please try again.");
  }
}

// Handle Ctrl+C gracefully
process.on("SIGINT", () => {
  console.log("\nGoodbye Agent!");
  process.exit(0);
});

// Start the agent
main().catch(console.error);
