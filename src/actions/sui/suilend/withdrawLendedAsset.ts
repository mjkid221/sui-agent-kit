import { SuiAgentKit } from "@/agent/sui";
import { z } from "zod";
import { createActionBuilderFor } from "../createAction";

const schema = z.object({
  coinType: z.string(),
});

const withdrawLendedAssetAction = createActionBuilderFor(SuiAgentKit)
  .name("WITHDRAW_LENDED_ASSET_SUILEND_ACTION")
  .similes([
    "withdraw lended asset",
    "withdraw supplied asset",
    "remove liquidity",
    "withdraw tokens",
    "withdraw deposited asset",
    "withdraw from lending",
  ])
  .description(
    `Withdraw a lended asset from the suilend protocol completely. 
    CoinType input is the coin type (address) of the asset to withdraw.`,
  )
  .examples([
    [
      {
        input: {
          coinType:
            "0x76cb819b01abed502bee8a702b4c2d547532c12f25001c9dea795a5e631c26f1::fud::FUD",
        },
        output: {
          status: "success",
          message: "Asset withdrawn successfully",
          transaction: "transaction_digest_here",
        },
        explanation: "Withdraw all lended FUD tokens from the SuiLend protocol",
      },
    ],
    [
      {
        input: {
          coinType: "0x2::sui::SUI",
        },
        output: {
          status: "success",
          message: "Asset withdrawn successfully",
          transaction: "transaction_digest_here",
        },
        explanation: "Withdraw all lended SUI from the SuiLend protocol",
      },
    ],
  ])
  .schema(schema)
  .handler(async (agent, input) => {
    const tx = await agent.requestWithdrawLendedAssetSuilend(input.coinType);

    return {
      status: "success",
      message: "Asset withdrawn successfully",
      transaction: tx,
    };
  });

export default withdrawLendedAssetAction;
