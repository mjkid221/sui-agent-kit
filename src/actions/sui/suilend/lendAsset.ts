import { SuiAgentKit } from "@/agent/sui";
import { SuiAction } from "@/types/action";
import { z } from "zod";

const lendAssetAction: SuiAction = {
  name: "LEND_ASSET_SUILEND_ACTION",
  similes: [
    "lend asset",
    "deposit asset",
    "supply asset",
    "provide liquidity",
    "deposit tokens",
    "lend tokens",
  ],
  description: `Lend an asset to the suilend protocol. Amount input is amount of asset to lend/deposit without decimals.
    CoinType input is the coin type (address) of the asset to lend/deposit. An array of supported coin types can be retrieved by using the get reserves action.`,
  examples: [
    [
      {
        input: {
          amount: 10,
          coinType:
            "0x76cb819b01abed502bee8a702b4c2d547532c12f25001c9dea795a5e631c26f1::fud::FUD",
        },
        output: {
          status: "success",
          message: "Asset lent successfully",
          transaction: "transaction_digest_here",
        },
        explanation: "Lend 10 FUD tokens to the SuiLend protocol",
      },
    ],
    [
      {
        input: {
          amount: 0.1,
          coinType: "0x2::sui::SUI",
        },
        output: {
          status: "success",
          message: "Asset lent successfully",
          transaction: "transaction_digest_here",
        },
        explanation: "Lend 0.1 SUI to the SuiLend protocol",
      },
    ],
  ],
  schema: z.object({
    amount: z.number(),
    coinType: z.string(),
  }),
  handler: async (
    agent: SuiAgentKit,
    input: { amount: number; coinType: string },
  ) => {
    const tx = await agent.requestLendAssetSuilend(
      input.amount,
      input.coinType,
    );

    return {
      status: "success",
      message: "Asset lent successfully",
      transaction: tx,
    };
  },
};

export default lendAssetAction;
