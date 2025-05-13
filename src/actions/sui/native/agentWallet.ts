import { SuiAgentKit } from "@/agent/sui";
import { SuiAction } from "@/types/action";
import { z } from "zod";

const inputSchema = z.object({});

const agentWalletAction: SuiAction<typeof inputSchema> = {
  name: "AGENT_WALLET_ACTION",
  similes: [
    "get wallet address",
    "show wallet address",
    "view wallet address",
    "check wallet address",
    "display wallet address",
  ],
  description: `Get the address of the agent's wallet. 
    This is the address that we primarily use to interact with the blockchain. 
    You and the user own this wallet, and the users can take actions on the blockchain through this address.`,
  examples: [
    [
      {
        input: {},
        output: {
          status: "success",
          message: "Agent wallet address fetched successfully",
          walletAddress:
            "0x008e52674f25ba8c2130933524cb88920bdcb46ad2160e886042801029bcd027",
        },
        explanation: "Get the agent's wallet address",
      },
    ],
  ],
  schema: inputSchema,
  handler: async (agent: SuiAgentKit) => {
    const walletAddress = await agent.requestAgentWalletAddress();

    return {
      status: "success",
      message: "Agent wallet address fetched successfully",
      walletAddress,
    };
  },
};

export default agentWalletAction;
