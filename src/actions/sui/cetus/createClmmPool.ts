import { SuiAgentKit } from "@/agent/sui";
import { z } from "zod";
import { createActionBuilderFor } from "../createAction";

const schema = z.object({
  coinTypeA: z.string(),
  coinTypeADepositAmount: z.number(),
  coinTypeB: z.string(),
  initialPrice: z.number(),
  feeTier: z.union([
    z.literal(1),
    z.literal(5),
    z.literal(10),
    z.literal(25),
    z.literal(100),
    z.literal(200),
  ]),
  slippagePercentage: z.number(),
});

const createClmmPoolAction = createActionBuilderFor(SuiAgentKit)
  .name("CREATE_CLMM_POOL_CETUS_ACTION")
  .similes([
    "create new pool",
    "create liquidity pool",
    "initialize pool",
    "set up new pool",
    "start new pool",
    "create cetus pool",
  ])
  .description(
    `Create a new CLMM pool on Cetus. This will create a new pool with the specified coins and parameters.
    CoinTypeA is the coin type of the first asset to be deposited into the pool.
    CoinTypeB is the coin type of the second asset to be deposited into the pool.
    InitialPrice is the initial price of the pool in relative to CoinTypeB.
    FeeTier is the fee tier of the pool. 1 = 2 bps, 5 = 10 bps, 10 = 20 bps, 25 = 60 bps, 100 = 200 bps, 200 = 220 bps.
    SlippagePercentage is the slippage percentage of the pool.`,
  )
  .examples([
    [
      {
        input: {
          coinTypeA: "0x2::sui::SUI",
          coinTypeADepositAmount: 1,
          coinTypeB: "0x123::usdc::USDC",
          initialPrice: 0.00000004,
          feeTier: 10,
          slippagePercentage: 5,
        },
        output: {
          status: "success",
          message: "Pool created successfully",
          transaction: "transaction_digest_here",
          poolId: "0x1234567890",
        },
        explanation: "Create a new SUI/USDC pool with initial liquidity",
      },
    ],
  ])
  .schema(schema)
  .handler(async (agent, input) => {
    const poolData = await agent.requestCreateClmmPoolCetus(
      input.coinTypeA,
      input.coinTypeADepositAmount,
      input.coinTypeB,
      input.initialPrice,
      input.feeTier,
      input.slippagePercentage,
    );

    return {
      status: "success",
      message: "Pool created successfully",
      transaction: poolData.txDigest,
      ...poolData,
    };
  });

export default createClmmPoolAction;
