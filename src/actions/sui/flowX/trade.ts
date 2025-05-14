import { SuiAgentKit } from "@/agent/sui";
import { z } from "zod";
import { createActionBuilderFor } from "../createAction";

const schema = z.object({
  outputCoinType: z.string(),
  inputAmount: z.number(),
  inputCoinType: z.string(),
  slippageBps: z.number().optional(),
});

const tradeAction = createActionBuilderFor(SuiAgentKit)
  .name("TRADE_COIN_ACTION")
  .similes([
    "swap tokens",
    "exchange coins",
    "convert tokens",
    "trade assets",
    "swap coins",
    "exchange tokens",
  ])
  .description(
    `Trade (swap) coins from one coin to another. 
    Make sure inputCoinType and outputCoinType are not the same.
    Slippage is the percentage of the input amount that is allowed to be lost in the trade.
    Slippage is in basis points (10000 = 1%). Use 10000 as default unless the user specifies a different value.
    Input amount is the amount of the input coin to be swapped without decimals.`,
  )
  .examples([
    [
      {
        input: {
          outputCoinType:
            "0xdba34672e30cb065b1f93e3ab55318768fd6fef66c15942c9f7cb846e2f900e7::usdc::USDC",
          inputAmount: 1,
          inputCoinType: "0x2::sui::SUI",
        },
        output: {
          status: "success",
          message: "Trade executed successfully",
          transaction: "transaction_digest_here",
          inputAmount: 1,
          inputCoinType: "0x2::sui::SUI",
          outputCoinType:
            "0xdba34672e30cb065b1f93e3ab55318768fd6fef66c15942c9f7cb846e2f900e7::usdc::USDC",
        },
        explanation: "Swap 1 SUI for USDC with default slippage",
      },
    ],
    [
      {
        input: {
          outputCoinType: "0x2::sui::SUI",
          inputAmount: 100,
          inputCoinType:
            "0xdba34672e30cb065b1f93e3ab55318768fd6fef66c15942c9f7cb846e2f900e7::usdc::USDC",
          slippageBps: 5000,
        },
        output: {
          status: "success",
          message: "Trade executed successfully",
          transaction: "transaction_digest_here",
          inputAmount: 100,
          inputCoinType:
            "0xdba34672e30cb065b1f93e3ab55318768fd6fef66c15942c9f7cb846e2f900e7::usdc::USDC",
          outputCoinType: "0x2::sui::SUI",
        },
        explanation: "Swap 100 USDC for SUI with 0.5% slippage",
      },
    ],
  ])
  .schema(schema)
  .handler(async (agent, input) => {
    const tx = await agent.requestTrade(
      input.outputCoinType,
      input.inputAmount,
      input.inputCoinType,
      input.slippageBps,
    );

    return {
      status: "success",
      message: "Trade executed successfully",
      transaction: tx,
      inputAmount: input.inputAmount,
      inputCoinType: input.inputCoinType,
      outputCoinType: input.outputCoinType,
    };
  });

export default tradeAction;
