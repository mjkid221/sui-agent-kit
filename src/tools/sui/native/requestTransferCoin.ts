import { SuiAgentKit } from "@/agent/sui";
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
      owner: agent.wallet.publicKey.toSuiAddress(),
      coinType,
    });

    const decimals = await getCoinDecimals(agent, coinType);
    const [coin] = tx.splitCoins(
      coinType ? coins.data[0].coinObjectId : tx.gas,
      [String(amount * 10 ** decimals)],
    );
    tx.transferObjects([coin], tx.pure.address(to));

    const { digest } = await agent.wallet.signAndSendTransaction(tx);
    return digest;
  } catch (error: any) {
    throw new Error(`Transfer failed: ${error.message}`);
  }
};
