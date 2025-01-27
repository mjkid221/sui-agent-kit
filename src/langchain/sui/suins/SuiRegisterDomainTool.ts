import { Tool } from "langchain/tools";
import { SuiAgentKit } from "../../../agent/sui";
import { returnErrorResponse, returnSuccessResponse } from "../../lib";
import { safeParseDomainName } from "../../../tools/sui";

export class SuiRegisterDomainTool extends Tool {
  name = "sui_register_domain";
  description = `Register a .sui domain name for your wallet.
    The input name can be suffixed with .sui or not. The function will automatically add .sui if it is not present.

    Inputs ( input is a JSON string ) :
    name: string, eg "myname.sui" (required)
    years: number, eg "1" (required)
    `;

  constructor(private suiAgentKit: SuiAgentKit) {
    super();
  }

  protected async _call(input: string): Promise<string> {
    try {
      const { name, years } = JSON.parse(input);

      const tx = await this.suiAgentKit.requestRegisterDomain(name, years);

      return returnSuccessResponse({
        status: "success",
        message: "Domain registered successfully",
        transaction: tx,
        domain: safeParseDomainName(name),
      });
    } catch (error: any) {
      return returnErrorResponse(error);
    }
  }
}
