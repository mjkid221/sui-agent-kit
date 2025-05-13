import { SuiAgentKit } from "@/agent/sui";
import { SuiAction } from "@/types/action";
import { z } from "zod";

const inputSchema = z.object({
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

const createClmmPoolAction: SuiAction<typeof inputSchema> = {
  name: "CREATE_CLMM_POOL_CETUS_ACTION",
  similes: [
    "create liquidity pool",
    "create new pool",
    "setup trading pool",
    "initialize pool",
    "create Cetus pool",
    "start new pool",
  ],
  description: `Create a new liquidity pool on Cetus with initial liquidity. 
    CoinTypeA is the coin type of the first asset to be deposited into the pool.
    CoinTypeB is the coin type of the second asset to be deposited into the pool.
    InitialPrice is the initial price of the pool in relative to CoinTypeB.
    FeeTier is the fee tier of the pool. 1 = 2 bps, 5 = 10 bps, 10 = 20 bps, 25 = 60 bps, 100 = 200 bps, 200 = 220 bps.
    SlippagePercentage is the slippage percentage of the pool.`,
  examples: [
    [
      {
        input: {
          coinTypeA: "0x2::sui::SUI",
          coinTypeADepositAmount: 1,
          coinTypeB:
            "0xdba34672e30cb065b1f93e3ab55318768fd6fef66c15942c9f7cb846e2f900e7::usdc::USDC",
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
  ],
  schema: inputSchema,
  handler: async (agent: SuiAgentKit, input) => {
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
  },
};

export default createClmmPoolAction;
