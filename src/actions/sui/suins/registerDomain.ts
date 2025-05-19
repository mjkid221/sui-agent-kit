import { SuiAgentKit } from "@/agent/sui";
import { z } from "zod";
import { createActionBuilderFor } from "../createAction";
import {
  requestRegisterDomain,
  safeParseDomainName,
} from "@/tools/sui/suins/requestRegisterDomain";

const schema = z.object({
  name: z.string(),
  years: z.number(),
});

const registerDomainAction = createActionBuilderFor(SuiAgentKit)
  .name("REGISTER_DOMAIN_ACTION")
  .similes([
    "register domain",
    "buy domain",
    "get domain name",
    "purchase domain",
    "register .sui domain",
    "acquire domain",
  ])
  .description(
    `Register a .sui domain name for your wallet.
    The input name can be suffixed with .sui or not. The function will automatically add .sui if it is not present.`,
  )
  .examples([
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
  ])
  .schema(schema)
  .handler(async (agent, input) => {
    const tx = await requestRegisterDomain(agent, input.name, input.years);

    return {
      status: "success",
      message: "Domain registered successfully",
      transaction: tx,
      domain: safeParseDomainName(input.name),
    };
  });

export default registerDomainAction;
