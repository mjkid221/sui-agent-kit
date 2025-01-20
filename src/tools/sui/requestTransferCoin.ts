import { SuiAgentKit } from "../../agent/sui";
import { Transaction } from "@mysten/sui/transactions";
import { getCoinDecimals } from "./requestCoinBalance/getCoinDecimals";

export const requestTransferCoin = async (
  agent: SuiAgentKit,
  to: string,
  amount: number,
  coinType?: string,
): Promise<string> => {
  try {
    const tx = new Transaction();

    const coins = await agent.client.getCoins({
      owner: agent.wallet.getPublicKey().toSuiAddress(),
      coinType,
    });

    const decimals = await getCoinDecimals(agent, coinType);
    const [coin] = tx.splitCoins(coins.data[0].coinObjectId, [
      String(amount * 10 ** decimals),
    ]);
    tx.transferObjects([coin], tx.pure.address(to));

    const result = await agent.client.signAndExecuteTransaction({
      signer: agent.wallet,
      transaction: tx,
    });
    await agent.client.waitForTransaction({ digest: result.digest });
    return result.digest;
  } catch (error: any) {
    throw new Error(`Transfer failed: ${error.message}`);
  }
};
