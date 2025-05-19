import { SuiAgentKit } from "@/agent/sui";
import { z } from "zod";
import { createActionBuilderFor } from "../createAction";
import { requestCoinBalance } from "@/tools/sui/native/requestCoinBalance";
import { getCoinDecimals } from "@/tools/sui/native/requestCoinBalance/getCoinDecimals";

const schema = z.object({
  coinType: z.string().optional(),
  walletAddress: z.string().optional(),
});

const tokenBalanceAction = createActionBuilderFor(SuiAgentKit)
  .name("TOKEN_BALANCE_ACTION")
  .similes([
    "check token balance",
    "get wallet token balance",
    "view token balance",
    "show token balance",
    "check token balance",
  ])
  .description(
    `Get the balance of a Sui wallet.
    If you want to get the native token balance of your (personal) wallet, you don't need to provide the coinType nor walletAddress.
    If you are prompted to get a coin balance but you do not know the exact coinType address prompt the user for it, do not make assumptions.
    Not specifying a coinType will return the balance of the native token (SUI).
    Providing a walletAddress will return the balance for the specified walletAddress.`,
  )
  .examples([
    [
      {
        input: {},
        output: {
          status: "success",
          balance: 10,
        },
        explanation: "Get native token balance (sui) of the wallet",
      },
    ],
    [
      {
        input: {
          walletAddress:
            "0x008e52674f25ba8c2130933524cb88920bdcb46ad2160e886042801029bcd027",
          coinType:
            "0xdba34672e30cb065b1f93e3ab55318768fd6fef66c15942c9f7cb846e2f900e7::usdc::USDC",
        },
        output: {
          status: "success",
          balance: 100,
        },
        explanation: "Get token balance of the wallet",
      },
    ],
  ])
  .schema(schema)
  .handler(async (agent, input) => {
    const balance = await requestCoinBalance(
      agent,
      input.coinType,
      input.walletAddress,
    );

    return {
      status: "success",
      balance: balance,
    };
  });

export default tokenBalanceAction;
