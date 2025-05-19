import {
  AggregatorQuoter,
  Coin,
  Commission,
  CommissionType,
  TradeBuilder,
} from "@flowx-finance/sdk";
import { SuiAgentKit } from "@/agent/sui";
import { COMMON_TOKEN_TYPES, DEFAULT_OPTIONS } from "@/constants/sui";
import { getCoinDecimals } from "@/tools/sui/native/requestCoinBalance/getCoinDecimals";

export const requestTrade = async (
  agent: SuiAgentKit,
  outputCoinType: string,
  inputAmount: number,
  inputCoinType: string = COMMON_TOKEN_TYPES.USDC,
  slippageBps: number = DEFAULT_OPTIONS.SLIPPAGE_BPS,
) => {
  const quoter = new AggregatorQuoter(agent.config.rpc.network);
  const inputCoinDecimals = await getCoinDecimals(agent, inputCoinType);

  const formattedInputAmount = inputAmount * 10 ** inputCoinDecimals;
  const feeCommission = agent.config.commission?.tradeCommissionFeePercentage
    ? new Commission(
        agent.config.commission.treasury,
        new Coin(inputCoinType),
        CommissionType.PERCENTAGE,
        // Convert percentage to bps for FlowX
        (
          agent.config.commission.tradeCommissionFeePercentage * 10_000
        ).toString(),
      )
    : undefined;
  const { routes, amountIn, amountOut } = await quoter.getRoutes({
    tokenIn: inputCoinType,
    tokenOut: outputCoinType,
    amountIn: formattedInputAmount.toString(),
    ...(feeCommission ? { commission: feeCommission } : {}),
  });

  const tradeBuilder = new TradeBuilder(agent.config.rpc.network, routes);
  const tradeInstructions = tradeBuilder
    .amountIn(amountIn)
    .amountOut(amountOut)
    .slippage(slippageBps)
    .sender(agent.wallet.publicKey.toSuiAddress())
    .deadline(Date.now() + 3600); // 1 hour from now

  const trade = feeCommission
    ? tradeInstructions
        .sender(agent.wallet.publicKey.toSuiAddress())
        .commission(feeCommission)
        .build()
    : tradeInstructions.sender(agent.wallet.publicKey.toSuiAddress()).build();

  const tx = await trade.buildTransaction({ client: agent.client });

  const { digest } = await agent.wallet.signAndSendTransaction(tx);
  return digest;
};
