import { SuiAgentKit } from "@/agent/sui";
import { z } from "zod";
import { createActionBuilderFor } from "../createAction";
import { requestDeployCoin } from "@/tools/sui/native/requestDeployCoin";

const schema = z.object({
  name: z.string(),
  symbol: z.string(),
  totalSupply: z.number(),
  decimals: z.number().optional(),
  description: z.string(),
  imageUrl: z.string().optional(),
  fixedSupply: z.boolean().optional(),
  recipient: z.string().optional(),
});

const deployCoinAction = createActionBuilderFor(SuiAgentKit)
  .name("DEPLOY_COIN_ACTION")
  .similes([
    "create new coin",
    "deploy token",
    "create token",
    "mint new coin",
    "deploy new coin",
    "create cryptocurrency",
  ])
  .description(
    `Deploy a new coin on Sui blockchain. 
    fixedSupply determines if the coin is fixed supply or not.
    Decimals are usually 6 for most coins unless otherwise specified.
    If recipient is not provided, the coin will be deployed to your (agent's) wallet.
    If description is not provided by the user, always prompt the user to provide them.`,
  )
  .examples([
    [
      {
        input: {
          name: "My Coin",
          symbol: "MC",
          totalSupply: 1000000,
          description: "My Coin is a new coin on Sui blockchain",
        },
        output: {
          status: "success",
          message: "Coin deployed successfully",
          createdCoinAddress:
            "0xdba34672e30cb065b1f93e3ab55318768fd6fef66c15942c9f7cb846e2f900e7::mycoin::MYCOIN",
          decimals: 6,
        },
        explanation: "Deploy a new coin with default settings",
      },
    ],
    [
      {
        input: {
          name: "Advanced Coin",
          symbol: "AC",
          totalSupply: 1000000,
          decimals: 9,
          description: "Advanced coin with custom settings",
          imageUrl: "https://example.com/coin.png",
          fixedSupply: true,
          recipient:
            "0x008e52674f25ba8c2130933524cb88920bdcb46ad2160e886042801029bcd027",
        },
        output: {
          status: "success",
          message: "Coin deployed successfully",
          createdCoinAddress:
            "0xdba34672e30cb065b1f93e3ab55318768fd6fef66c15942c9f7cb846e2f900e7::advancedcoin::AC",
          decimals: 9,
        },
        explanation: "Deploy a new coin with custom settings",
      },
    ],
  ])
  .schema(schema)
  .handler(async (agent, input) => {
    const coinType = await requestDeployCoin(agent, input);

    return {
      status: "success",
      message: "Coin deployed successfully",
      createdCoinAddress: coinType,
      decimals: input.decimals || 6,
    };
  });

export default deployCoinAction;
