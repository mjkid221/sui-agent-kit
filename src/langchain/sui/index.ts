import { SuiAgentKit } from "../../agent/sui";
import * as NATIVE_TOOLS from "./native";
import * as SUI_NS_TOOLS from "./suins";

export const createSuiTools = (suiAgentKit: SuiAgentKit) => {
  return [
    new NATIVE_TOOLS.SuiBalanceTool(suiAgentKit),
    new NATIVE_TOOLS.SuiTransferTool(suiAgentKit),
    new NATIVE_TOOLS.SuiDeployCoinTool(suiAgentKit),
    new SUI_NS_TOOLS.SuiRegisterDomainTool(suiAgentKit),
    new SUI_NS_TOOLS.SuiResolveDomainTool(suiAgentKit),
  ];
};
