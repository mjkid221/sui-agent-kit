import { SuiAgentKit } from "@/agent/sui";
import { Transaction } from "@mysten/sui/transactions";
import { SUI_TYPE_ARG } from "@mysten/sui/utils";

/**
 * Merge coins of the same type. Note this won't work if exceeding 256 limit.
 * Additionally, this function will only merge coins if there are enough coins to merge.
 * @param agent SuiAgentKit - Sui agent class
 * @param transaction Transaction - Transaction object
 * @param requestAmount number - Minimum amount requesting to merge into one. Does not account decimals
 * @param coinType string - Coin type to merge
 */
export const requestMergeCoins = async (
  agent: SuiAgentKit,
  transaction: Transaction,
  requestAmount: number,
  coinType: string = SUI_TYPE_ARG,
) => {
  const coins = await agent.client.getCoins({
    owner: agent.wallet.publicKey.toSuiAddress(),
    coinType,
  });

  // Sort coins by balance in descending order, to prioritize merging larger coins
  const coinData = coins.data.sort(
    (a, b) => Number(b.balance) - Number(a.balance),
  );

  const coinsToMerge = [];
  let totalValueToMerge = 0;

  for (const coin of coinData) {
    if (totalValueToMerge >= requestAmount) {
      break;
    }
    if (Number(coin.balance) >= requestAmount) {
      coinsToMerge.push(coin.coinObjectId);
      break;
    }
    totalValueToMerge += Number(coin.balance);
    coinsToMerge.push(coin.coinObjectId);
  }

  const [destination, ...source] = coinsToMerge;
  if (coinsToMerge.length >= 2) {
    transaction.mergeCoins(destination, source);
  }

  return {
    destinationCoinObjectId: destination,
  };
};
