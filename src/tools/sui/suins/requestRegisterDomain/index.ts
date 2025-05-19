import { SuiAgentKit } from "../../../../agent/sui";
import { Transaction, TransactionResult } from "@mysten/sui/transactions";
import { SuinsClient } from "./SuinsClient";
import { SuinsTransaction } from "./SuinsTransaction";
import { CoinConfigType } from "./types";
import { getCoinDecimals } from "@/tools/sui/native/requestCoinBalance/getCoinDecimals";
import { requestMergeCoins } from "@/tools/sui/native/requestMergeCoins";
import { safeParseDomainName } from "./safeParseDomainName";

// TODO: Update logic when new SUINS SDK is released. This implementation is tested with SUI as payment method.
export const requestRegisterDomain = async (
  agent: SuiAgentKit,
  name: string,
  years: number,
  coinConfig: CoinConfigType = agent.suinsClient.config.coins.SUI,
) => {
  try {
    const domainName = safeParseDomainName(name);
    const suinsTransaction = new SuinsTransaction(
      agent.suinsClient,
      new Transaction(),
    );

    let priceInfoObjectId: string | null = null;
    // Only required for SUI/NS
    if (coinConfig !== agent.suinsClient.config.coins.USDC) {
      priceInfoObjectId = (
        await agent.suinsClient.getPriceInfoObject(
          suinsTransaction.transaction,
          coinConfig.feed,
        )
      )[0];
    }
    const priceInUSD = await agent.suinsClient.calculatePrice({
      name: domainName,
      years,
      isRegistration: true,
    });
    let price: number | bigint | TransactionResult;
    const decimals = await getCoinDecimals(agent, coinConfig.type);

    if (priceInfoObjectId) {
      const priceFeed = await agent.suinsClient.getLatestPrice(coinConfig.feed);
      price = Math.ceil(
        (priceInUSD / priceFeed) * (10 ** decimals / 10 ** 6) * 1.2,
      );
    } else {
      price = priceInUSD;
    }

    const { destinationCoinObjectId } = await requestMergeCoins(
      agent,
      suinsTransaction.transaction,
      price,
      coinConfig.type,
    );

    const [coin] = suinsTransaction.transaction.splitCoins(
      destinationCoinObjectId,
      [price],
    );
    const nft = suinsTransaction.register({
      domain: domainName,
      years,
      coinConfig,
      coin,
      priceInfoObjectId,
    });

    suinsTransaction.setTargetAddress({
      nft,
      address: agent.wallet.publicKey.toSuiAddress(),
      isSubname: false,
    });

    // Transfer the name's NFT
    suinsTransaction.transaction.transferObjects(
      [nft],
      suinsTransaction.transaction.pure.address(
        agent.wallet.publicKey.toSuiAddress(),
      ),
    );

    // Transfer back the coin object
    suinsTransaction.transaction.transferObjects(
      [coin],
      suinsTransaction.transaction.pure.address(
        agent.wallet.publicKey.toSuiAddress(),
      ),
    );

    const { digest } = await agent.wallet.signAndSendTransaction(
      suinsTransaction.transaction,
    );
    return digest;
  } catch (err: any) {
    throw new Error(`Domain registration failed: ${err.message}`);
  }
};

export { SuinsClient, safeParseDomainName };
