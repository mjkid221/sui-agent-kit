import { SuiAgentKit } from "@/agent/sui";
import { safeParseDomainName } from "@/tools/sui/suins/requestRegisterDomain";

export const requestResolveDomain = async (
  agent: SuiAgentKit,
  domain: string,
) => {
  try {
    const nameRecord = await agent.suinsClient.getNameRecord(
      safeParseDomainName(domain),
    );
    return nameRecord?.targetAddress || null;
  } catch (err: any) {
    throw new Error(`Register domain failed: ${err.message}`);
  }
};
