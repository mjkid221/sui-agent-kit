import { SuinsTransaction } from "@mysten/suins";
import { SuiAgentKit } from "../../agent/sui";
import { Transaction } from "@mysten/sui/transactions";

export const requestRegisterDomain = async (
  agent: SuiAgentKit,
  name: string,
  years: number,
) => {
  try {
    const priceList = await agent.suinsClient.getPriceList();
    const transaction = new Transaction();
    const suinsTransaction = new SuinsTransaction(
      agent.suinsClient,
      transaction,
    );

    const nft = suinsTransaction.register({
      name,
      years,
      price: agent.suinsClient.calculatePrice({ name, years, priceList }),
    });

    transaction.transferObjects(
      [nft],
      transaction.pure.address(agent.wallet.toSuiAddress()),
    );

    const result = await agent.client.signAndExecuteTransaction({
      signer: agent.wallet,
      transaction,
    });

    await agent.client.waitForTransaction({ digest: result.digest });

    return result.digest;
  } catch (err: any) {
    throw new Error(`Domain registration failed: ${err.message}`);
  }
};
