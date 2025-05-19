import { SuiAgentKit } from "@/agent/sui";
import { z } from "zod";
import { createActionBuilderFor } from "../createAction";

const schema = z.object({
  coinTypeA: z.string(),
  coinTypeB: z.string(),
  feeTierFilter: z
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

const getPoolByCoinsAction = createActionBuilderFor(SuiAgentKit)
  .name("GET_POOL_BY_COINS_CETUS_ACTION")
  .similes([
    "find pool by coins",
    "search pool by tokens",
    "get pool information",
    "lookup pool by coins",
    "get pool details",
    "find liquidity pool",
  ])
  .description(
    `Get pool information on Cetus by coin types. This will return information about the pool with the specified coins.
    coinTypeA and coinTypeB are the coin types of the assets in the pool.
    feeTierFilter is optional and can be used to filter pools by fee tier. Fee tiers are 1 = 2 bps, 5 = 10 bps, 10 = 20 bps, 25 = 60 bps, 100 = 200 bps, 200 = 220 bps.`,
  )
  .examples([
    [
      {
        input: {
          coinTypeA: "0x2::sui::SUI",
          coinTypeB: "0x123::usdc::USDC",
        },
        output: {
          status: "success",
          message: "Pool found successfully",
          poolId: "0x1234567890",
          coinTypeA: "0x2::sui::SUI",
          coinTypeB: "0x123::usdc::USDC",
          feeTier: 10,
          tickSpacing: 100,
          liquidity: "1000000",
        },
        explanation: "Find a SUI/USDC pool on Cetus",
      },
    ],
    [
      {
        input: {
          coinTypeA: "0x2::sui::SUI",
          coinTypeB: "0x123::usdc::USDC",
          feeTierFilter: 10,
        },
        output: {
          status: "success",
          message: "Pool found successfully",
          poolId: "0x1234567890",
          coinTypeA: "0x2::sui::SUI",
          coinTypeB: "0x123::usdc::USDC",
          feeTier: 10,
          tickSpacing: 100,
          liquidity: "1000000",
        },
        explanation: "Find a SUI/USDC pool with a specific fee tier",
      },
    ],
  ])
  .schema(schema)
  .handler(async (agent, input) => {
    const poolData = await agent.requestGetPoolByCoinsCetus(
      input.coinTypeA,
      input.coinTypeB,
      input.feeTierFilter,
    );

    if (!poolData) {
      return {
        status: "error",
        message: "Pool not found",
      };
    }

    return {
      status: "success",
      message: "Pool found successfully",
      ...poolData,
    };
  });

export default getPoolByCoinsAction;
