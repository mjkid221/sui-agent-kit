import { SuiAgentKit } from "../../agent/sui";
import { SuiBalanceTool, SuiTransferTool } from "./native";

export const createSuiTools = (suiAgentKit: SuiAgentKit) => {
  return [new SuiBalanceTool(suiAgentKit), new SuiTransferTool(suiAgentKit)];
};
