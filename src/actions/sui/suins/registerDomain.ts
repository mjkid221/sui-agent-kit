import { SuiAgentKit } from "@/agent/sui";
import { SuiAction } from "@/types/action";
import { z } from "zod";
import { safeParseDomainName } from "@/tools/sui";

const inputSchema = z.object({
  name: z.string(),
  years: z.number(),
});

const registerDomainAction: SuiAction<typeof inputSchema> = {
  name: "REGISTER_DOMAIN_ACTION",
  similes: [
    "register domain",
    "buy domain",
    "get domain name",
    "purchase domain",
    "register .sui domain",
    "acquire domain",
  ],
  description: `Register a .sui domain name for your wallet.
    The input name can be suffixed with .sui or not. The function will automatically add .sui if it is not present.`,
  examples: [
    [
      {
        input: {
          name: "myname",
          years: 1,
        },
        output: {
          status: "success",
          message: "Domain registered successfully",
          transaction: "transaction_digest_here",
          domain: "myname.sui",
        },
        explanation: "Register a new .sui domain name for 1 year",
      },
    ],
    [
      {
        input: {
          name: "myname.sui",
          years: 2,
        },
        output: {
          status: "success",
          message: "Domain registered successfully",
          transaction: "transaction_digest_here",
          domain: "myname.sui",
        },
        explanation: "Register a new .sui domain name for 2 years",
      },
    ],
  ],
  schema: inputSchema,
  handler: async (agent: SuiAgentKit, input) => {
    const tx = await agent.requestRegisterDomain(input.name, input.years);

    return {
      status: "success",
      message: "Domain registered successfully",
      transaction: tx,
      domain: safeParseDomainName(input.name),
    };
  },
};

export default registerDomainAction;
