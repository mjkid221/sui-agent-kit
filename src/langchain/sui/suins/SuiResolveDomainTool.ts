import { Tool } from "langchain/tools";
import { SuiAgentKit } from "../../../agent/sui";
import { returnErrorResponse, returnSuccessResponse } from "../../lib";

export class SuiResolveDomainTool extends Tool {
  name = "sui_resolve_domain";
  description = `Resolve a .sui domain name to an address.
    Use this tool to get the wallet address of a .sui domain when you are given a .sui domain name.
    If the domain does not exist or is not owned by an address, the function will return null.
    Otherwise, it will return the walletAddress of the domain owner.

    Inputs ( input is a JSON string ) :
    name: string, eg "myname.sui" (required)
    `;

  constructor(private suiAgentKit: SuiAgentKit) {
    super();
  }

  protected async _call(input: string): Promise<string> {
    try {
      const walletAddress = await this.suiAgentKit.requestResolveDomain(input);

      return returnSuccessResponse({
        status: "success",
        message: "Domain resolved successfully",
        walletAddress,
      });
    } catch (error: any) {
      return returnErrorResponse(error);
    }
  }
}
