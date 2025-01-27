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
  const quoter = new AggregatorQuoter(agent.agentNetwork);
  const inputCoinDecimals = await getCoinDecimals(agent, inputCoinType);

  const formattedInputAmount = inputAmount * 10 ** inputCoinDecimals;

  const feeCommission = agent.config.tradeCommissionFeeBps
    ? new Commission(
        agent.config.treasury,
        new Coin(inputCoinType),
        CommissionType.PERCENTAGE,
        agent.config.tradeCommissionFeeBps.toString(),
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
    .amountIn(amountIn)
    .amountOut(amountOut)
    .slippage(slippageBps)
    .sender(agent.wallet.toSuiAddress())
    .deadline(Date.now() + 3600); // 1 hour from now

  const trade = feeCommission
    ? tradeInstructions
        .sender(agent.wallet.toSuiAddress())
        .commission(feeCommission)
        .build()
    : tradeInstructions.sender(agent.wallet.toSuiAddress()).build();

  const tx = await trade.buildTransaction({ client: agent.client });

  const { digest } = await agent.client.signAndExecuteTransaction({
    signer: agent.wallet,
    transaction: tx,
  });

  const response = await agent.client.waitForTransaction({
    digest,
  });

  return response.digest;
};
