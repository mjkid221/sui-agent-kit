import { SuiAgentKit } from "@/agent/sui";
import { coinWithBalance, Transaction } from "@mysten/sui/transactions";

import { TokenCreationInterface } from "./types";
import {
  normalizeSuiAddress,
  SUI_DECIMALS,
  SUI_TYPE_ARG,
} from "@mysten/sui/utils";
import initMoveByteCodeTemplate from "./move-bytecode-template";
import { getBytecode } from "./coin";

/**
 * Deploy a new coin on Sui
 * @param agent SuiAgentKit - Sui agent class
 * @param tokenInfo TokenCreationInterface - Token creation interface
 * @returns string - Coin type of the deployed coin
 */
export const requestDeployCoin = async (
  agent: SuiAgentKit,
  tokenInfo: TokenCreationInterface,
) => {
  try {
    await initMoveByteCodeTemplate();
    const tx = new Transaction();

    if (agent.config.coinDeployFixedFee) {
      const feeAmount = agent.config.coinDeployFixedFee * 10 ** SUI_DECIMALS;

      tx.transferObjects(
        [coinWithBalance({ balance: feeAmount, type: SUI_TYPE_ARG })],
        tx.pure.address(agent.config.treasury),
      );
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

export { TokenCreationInterface };
