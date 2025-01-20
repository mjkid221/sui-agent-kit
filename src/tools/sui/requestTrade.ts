import {
  AggregatorQuoter,
  Coin,
  Commission,
  CommissionType,
  TradeBuilder,
} from "@flowx-finance/sdk";
import { SuiAgentKit } from "../../agent/sui";
import { getCoinDecimals } from "./requestCoinBalance/getCoinDecimals";
import { COMMON_TOKEN_TYPES, DEFAULT_OPTIONS } from "../../constants/sui";
import { Transaction, TransactionResult } from "@mysten/sui/transactions";

export const requestTrade = async (
  agent: SuiAgentKit,
  outputCoinType: string,
  inputAmount: number,
  inputCoinType: string = COMMON_TOKEN_TYPES.USDC,
  slippageBps: number = DEFAULT_OPTIONS.SLIPPAGE_BPS,
  commission?: {
    feePercentage: number;
    feeRecipient: string;
  },
) => {
  const quoter = new AggregatorQuoter(agent.agentNetwork);
  const formattedInputAmount =
    inputAmount * 10 ** (await getCoinDecimals(agent, inputCoinType));

  const feeCommission = commission
    ? new Commission(
        commission.feeRecipient,
        new Coin(inputCoinType),
        CommissionType.PERCENTAGE,
        commission.feePercentage.toString(),
      )
    : undefined;
  const { routes, amountIn, amountOut } = await quoter.getRoutes({
    tokenIn: inputCoinType,
    tokenOut: outputCoinType,
    amountIn: formattedInputAmount.toString(),
    ...(feeCommission ? { commission: feeCommission } : {}),
  });

  const tradeBuilder = new TradeBuilder(agent.agentNetwork, routes);
  const tradeInstructions = tradeBuilder
    .sender(agent.wallet.toSuiAddress())
    .amountIn(amountIn)
    .amountOut(amountOut)
    .slippage(slippageBps)
    .deadline(Date.now() + 3600); // 1 hour from now

  const trade = feeCommission
    ? tradeInstructions.commission(feeCommission).build()
    : tradeInstructions.build();

  const tx = (await trade.swap({
    client: agent.client,
    tx: new Transaction(),
  })) as TransactionResult;

  return tx;
};
