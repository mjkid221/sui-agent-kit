import { z } from "zod";
import { SuiAgentKit } from "@/agent/sui";
import { createActionBuilderFor } from "../createAction";

const schema = z.object({});

const requestFundsAction = createActionBuilderFor(SuiAgentKit)
  .name("REQUEST_FUNDS")
  .similes([
    "request sui",
    "get test sui",
    "use faucet",
    "request test sui",
    "get testnet sui",
  ])
  .description("Request SUI from Sui faucet (testnet only)")
  .examples([
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
  ])
  .schema(schema)
  .handler(async (agent) => {
    await agent.requestFaucetFunds();

    return {
      status: "success",
      message: "Successfully requested faucet funds",
    };
  });

export default requestFundsAction;
