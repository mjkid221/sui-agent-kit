import { SuiAgentKit } from "../../agent/sui";
import * as NATIVE_TOOLS from "./native";
import * as SUI_NS_TOOLS from "./suins";
import * as FLOW_X_TOOLS from "./flowX";

export const createSuiTools = (suiAgentKit: SuiAgentKit) => {
  return [
    new NATIVE_TOOLS.SuiBalanceTool(suiAgentKit),
    new NATIVE_TOOLS.SuiTransferTool(suiAgentKit),
    new NATIVE_TOOLS.SuiDeployCoinTool(suiAgentKit),
    new SUI_NS_TOOLS.SuiRegisterDomainTool(suiAgentKit),
    new SUI_NS_TOOLS.SuiResolveDomainTool(suiAgentKit),
    new FLOW_X_TOOLS.SuiTradeTool(suiAgentKit),
  ];
};
