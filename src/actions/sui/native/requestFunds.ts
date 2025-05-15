import { SuiAgentKit } from "@/agent/sui";
import { createActionBuilderFor } from "../createAction";

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
  .handler(async (agent) => {
    await agent.requestFaucetFunds();

    return {
      status: "success",
      message: "Successfully requested faucet funds",
    };
  });

export default requestFundsAction;
