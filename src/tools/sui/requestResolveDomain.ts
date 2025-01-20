import { SuiAgentKit } from "../../agent/sui";

export const requestResolveDomain = async (
  agent: SuiAgentKit,
  domain: string,
) => {
  try {
    const nameRecord = await agent.suinsClient.getNameRecord(domain);
    return nameRecord?.targetAddress;
  } catch (err: any) {
    throw new Error(`Register domain failed: ${err.message}`);
  }
};
