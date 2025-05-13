import { SuiAgentKit } from "@/agent/sui";
import { SuiAction } from "@/types/action";
import { z } from "zod";

const inputSchema = z.object({
  name: z.string(),
});

const resolveDomainAction: SuiAction<typeof inputSchema> = {
  name: "RESOLVE_DOMAIN_ACTION",
  similes: [
    "resolve domain",
    "lookup domain",
    "get domain owner",
    "find domain address",
    "check domain owner",
    "resolve .sui domain",
  ],
  description: `Resolve a .sui domain name to an address.
    Use this tool to get the wallet address of a .sui domain when you are given a .sui domain name.
    If the domain does not exist or is not owned by an address, the function will return null.
    Otherwise, it will return the walletAddress of the domain owner.`,
  examples: [
    [
      {
        input: {
          name: "myname.sui",
        },
        output: {
          status: "success",
          message: "Domain resolved successfully",
          walletAddress:
            "0x008e52674f25ba8c2130933524cb88920bdcb46ad2160e886042801029bcd027",
        },
        explanation: "Resolve a .sui domain name to its owner's wallet address",
      },
    ],
    [
      {
        input: {
          name: "nonexistent.sui",
        },
        output: {
          status: "success",
          message: "Domain resolved successfully",
          walletAddress: null,
        },
        explanation: "Try to resolve a non-existent domain name",
      },
    ],
  ],
  schema: inputSchema,
  handler: async (agent: SuiAgentKit, input) => {
    const walletAddress = await agent.requestResolveDomain(input.name);

    return {
      status: "success",
      message: "Domain resolved successfully",
      walletAddress,
    };
  },
};

export default resolveDomainAction;
