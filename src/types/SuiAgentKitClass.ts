import { TokenCreationInterface } from "@/tools/sui/native/requestDeployCoin/types";
import { BaseAgentKitClass } from "./BaseAgentKitClass";

export type SuiAgentConfig = {
  /**
   * The fixed fee for deploying a coin. E.g. 0.5 for 0.5 SUI
   */
  coinDeployFixedFee?: number;

  /**
   * The percentage fee for each trade. E.g. 1 for 1%
   */
  tradeCommissionFeePercentage?: number;

  /**
   * Treasury address for commissions/fees
   */
  treasury?: string;
};

export interface SuiAgentKitClass extends BaseAgentKitClass {
  config: SuiAgentConfig;
  /**
   * @param tokenInfo - The information of the token to be deployed
   * @param tokenInfo.name - The name of the token
   * @param tokenInfo.symbol - The symbol of the token
   * @param tokenInfo.decimals - The decimals of the token
   * @param tokenInfo.totalSupply - The total supply of the token. E.g. 1_000_000_000 for 1B
   * @param tokenInfo.fixedSupply - Whether the token is fixed supply
   * @param tokenInfo.description - The description of the token
   * @param feeConfig - Optional configuration for fees
   * @param feeConfig.treasury - The address of the treasury
   * @param feeConfig.fee - The fee of the transaction. E.g. 1_000_000_000 for 1 SUI
   * @returns The module address
   */
  requestDeployCoin(
    tokenInfo: TokenCreationInterface,
    feeConfig?: {
      treasury: string;
      fee: number;
    },
  ): Promise<string>;
}
