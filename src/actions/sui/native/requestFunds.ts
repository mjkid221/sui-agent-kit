import { z } from "zod";
import { SuiAction } from "@/types/action";
import { SuiAgentKit } from "@/agent/sui";

const inputSchema = z.object({});

const requestFundsAction: SuiAction<typeof inputSchema> = {
  name: "REQUEST_FUNDS",
  similes: [
    "request sui",
    "get test sui",
    "use faucet",
    "request test sui",
    "get testnet sui",
  ],
  description: "Request SUI from Sui faucet (testnet only)",
  examples: [
    [
      {
        input: {},
        output: {
          status: "success",
          message: "Successfully requested faucet funds",
        },
        explanation: "Request SUI from the testnet faucet",
      },
    ],
  ],
  schema: inputSchema,
  handler: async (agent: SuiAgentKit) => {
    await agent.requestFaucetFunds();

    return {
      status: "success",
      message: "Successfully requested faucet funds",
    };
  },
};

export default requestFundsAction;
