import { SuiAgentKit } from "@/agent/sui";
import { SuiAction } from "@/types/action";
import { z } from "zod";

const inputSchema = z.object({
  coinTypeA: z.string(),
  coinTypeB: z.string(),
  feeTier: z
    .union([
      z.literal(1),
      z.literal(5),
      z.literal(10),
      z.literal(25),
      z.literal(100),
      z.literal(200),
    ])
    .optional(),
});

const getPoolByCoinsAction: SuiAction<typeof inputSchema> = {
  name: "GET_POOL_BY_COINS_CETUS_ACTION",
  similes: [
    "find pool by tokens",
    "search pool by coins",
    "lookup pool by assets",
    "get pool info",
    "find trading pair",
    "check pool existence",
  ],
  description: `Get a pool by coins on Cetus. Returns null if no pool is found. Otherwise, returns the pool object containing poolId.
    FeeTier is the fee tier of the pool. 1 = 2 bps, 5 = 10 bps, 10 = 20 bps, 25 = 60 bps, 100 = 200 bps, 200 = 220 bps.`,
  examples: [
    [
      {
        input: {
          coinTypeA: "0x2::sui::SUI",
          coinTypeB:
            "0xdba34672e30cb065b1f93e3ab55318768fd6fef66c15942c9f7cb846e2f900e7::usdc::USDC",
          feeTier: 10,
        },
        output: {
          status: "success",
          message: "Pool found successfully",
          pool: {
            poolId: "0x1234567890",
            coinTypeA: "0x2::sui::SUI",
            coinTypeB:
              "0xdba34672e30cb065b1f93e3ab55318768fd6fef66c15942c9f7cb846e2f900e7::usdc::USDC",
            feeTier: 10,
          },
        },
        explanation: "Find a SUI/USDC pool with 20 bps fee tier",
      },
    ],
    [
      {
        input: {
          coinTypeA: "0x2::sui::SUI",
          coinTypeB:
            "0xdba34672e30cb065b1f93e3ab55318768fd6fef66c15942c9f7cb846e2f900e7::usdc::USDC",
        },
        output: {
          status: "success",
          message: "Pool found successfully",
          pool: null,
        },
        explanation: "Try to find a pool that doesn't exist",
      },
    ],
  ],
  schema: inputSchema,
  handler: async (agent: SuiAgentKit, input) => {
    const pool = await agent.requestGetPoolByCoinsCetus(
      input.coinTypeA,
      input.coinTypeB,
      input.feeTier,
    );

    return {
      status: "success",
      message: "Pool found successfully",
      pool,
    };
  },
};

export default getPoolByCoinsAction;
