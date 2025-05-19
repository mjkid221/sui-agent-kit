import { SuiAgentKit } from "@/agent/sui";
import { z } from "zod";
import { createActionBuilderFor } from "../createAction";
import { getTokenPriceByAddress } from "@/lib/helpers/token";
import { ChainIdentifier } from "@/types/chain";

const schema = z.object({
  coinType: z.string(),
});

const assetPriceAction = createActionBuilderFor(SuiAgentKit)
  .name("ASSET_PRICE_ACTION")
  .similes([
    "get token price",
    "check token price",
    "view token price",
    "get coin price",
    "check coin price",
    "get asset value",
  ])
  .description(
    `Get the token price for a given coin type address.
    The response price is in USDC value.`,
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
          message: "Asset price fetched successfully",
          assetPrice: "1.00",
        },
        explanation: "Get the price of FUD token in USDC",
      },
    ],
    [
      {
        input: {
          coinType: "0x2::sui::SUI",
        },
        output: {
          status: "success",
          message: "Asset price fetched successfully",
          assetPrice: "1.50",
        },
        explanation: "Get the price of SUI token in USDC",
      },
    ],
  ])
  .schema(schema)
  .handler(async (agent, input) => {
    const assetPrice = await getTokenPriceByAddress(
      input.coinType,
      ChainIdentifier.SUI,
    );

    return {
      status: "success",
      message: "Asset price fetched successfully",
      assetPrice,
    };
  });

export default assetPriceAction;
