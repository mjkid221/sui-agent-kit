import { Tool } from "langchain/tools";
import { SuiAgentKit } from "../../../agent/sui";
import {
  returnErrorResponse,
  returnSuccessResponse,
} from "../../lib/standardizeResponse";

export class SuiAgentWalletTool extends Tool {
  name = "sui_agent_wallet";
  description = `Get the address of the agent's wallet. 
    This is the address that we primarily use to interact with the blockchain. 
    You and the user own this wallet, and the users can take actions on the blockchain through this address.`;

  constructor(private suiAgentKit: SuiAgentKit) {
    super();
  }

  protected async _call(): Promise<string> {
    try {
      const walletAddress = await this.suiAgentKit.requestAgentWalletAddress();
      return returnSuccessResponse({
        message: "Agent wallet address fetched successfully",
        walletAddress,
      });
    } catch (error: any) {
      return returnErrorResponse(error);
    }
  }
}
