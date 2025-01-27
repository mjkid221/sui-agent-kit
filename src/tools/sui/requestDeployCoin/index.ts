import { SuiAgentKit } from "../../../agent/sui";
import { Transaction } from "@mysten/sui/transactions";

import { TokenCreationInterface } from "./types";
import { normalizeSuiAddress } from "@mysten/sui/utils";
import initMoveByteCodeTemplate from "./move-bytecode-template";
import { getBytecode } from "./coin";

export const requestDeployCoin = async (
  agent: SuiAgentKit,
  tokenInfo: TokenCreationInterface,
) => {
  try {
    await initMoveByteCodeTemplate();
    const tx = new Transaction();

    if (agent.config.coinDeployFixedFee) {
      const [fee] = tx.splitCoins(tx.gas, [
        String(agent.config.coinDeployFixedFee),
      ]);
      tx.transferObjects([fee], tx.pure.address(agent.config.treasury));
    }

    const bytecode = await getBytecode({
      ...tokenInfo,
      decimals: tokenInfo.decimals ?? 6,
      recipient: tokenInfo.recipient ?? agent.wallet.toSuiAddress(),
    });

    const [upgradeCap] = tx.publish({
      modules: [[...bytecode]],
      dependencies: [normalizeSuiAddress("0x1"), normalizeSuiAddress("0x2")],
    });

    tx.transferObjects(
      [upgradeCap],
      tx.pure.address(agent.wallet.toSuiAddress()),
    );

    const { digest, balanceChanges } =
      await agent.client.signAndExecuteTransaction({
        signer: agent.wallet,
        transaction: tx,
        options: {
          showBalanceChanges: true,
          showEffects: true,
          showEvents: true,
          showInput: true,
          showObjectChanges: true,
          showRawInput: false,
        },
      });

    let coinType = "";
    if (balanceChanges instanceof Array) {
      const [, coinBalanceChange] = balanceChanges;
      coinType = coinBalanceChange.coinType;
    }

    await agent.client.waitForTransaction({ digest });

    return coinType;
  } catch (error: any) {
    throw new Error(`Token deployment failed: ${error.message}`);
  }
};
