import { SuiAgentKit } from "@/agent/sui";
import { z } from "zod";
import { createActionBuilderFor } from "../createAction";
import { requestTransferCoin } from "@/tools/sui/native/requestTransferCoin";

const schema = z.object({
  amount: z.number(),
  to: z.string(),
  coinType: z.string().optional(),
});

const transferAction = createActionBuilderFor(SuiAgentKit)
  .name("TRANSFER_ACTION")
  .similes([
    "transfer tokens",
    "send tokens",
    "transfer coins",
    "send coins",
    "transfer SUI",
    "send SUI",
  ])
  .description(
    `Transfers coins or SUI to another address (a.k.a. wallet). 
    If no coinType is provided, the transfer will be in SUI, otherwise transfer the specified coin.`,
  )
  .examples([
    [
      {
        input: {
          amount: 1,
          to: "0x008e52674f25ba8c2130933524cb88920bdcb46ad2160e886042801029bcd027",
        },
        output: {
          status: "success",
          message: "Transfer successful",
          amount: 1,
          recipient:
            "0x008e52674f25ba8c2130933524cb88920bdcb46ad2160e886042801029bcd027",
          coinType: "SUI",
        },
        explanation: "Transfer 1 SUI to the specified address",
      },
    ],
    [
      {
        input: {
          amount: 100,
          to: "0x008e52674f25ba8c2130933524cb88920bdcb46ad2160e886042801029bcd027",
          coinType:
            "0xdba34672e30cb065b1f93e3ab55318768fd6fef66c15942c9f7cb846e2f900e7::usdc::USDC",
        },
        output: {
          status: "success",
          message: "Transfer successful",
          amount: 100,
          recipient:
            "0x008e52674f25ba8c2130933524cb88920bdcb46ad2160e886042801029bcd027",
          coinType:
            "0xdba34672e30cb065b1f93e3ab55318768fd6fef66c15942c9f7cb846e2f900e7::usdc::USDC",
        },
        explanation: "Transfer 100 USDC to the specified address",
      },
    ],
  ])
  .schema(schema)
  .handler(async (agent, input) => {
    const tx = await requestTransferCoin(
      agent,
      input.to,
      input.amount,
      input.coinType,
    );

    return {
      status: "success",
      message: "Transfer successful",
      amount: input.amount,
      recipient: input.to,
      coinType: input.coinType || "SUI",
      transaction: tx,
    };
  });

export default transferAction;
