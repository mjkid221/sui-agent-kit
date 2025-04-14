import { SuiAgentKit } from "@/agent/sui";
import * as NATIVE_TOOLS from "./native";
import * as SUI_NS_TOOLS from "./suins";
import * as FLOW_X_TOOLS from "./flowX";
import * as DEX_SCREENER_TOOLS from "./dexScreener";
import * as GO_PLUS_LABS_TOOLS from "./goPlusLabs";
import * as SUILEND_TOOLS from "./suilend";
import * as CETUS_TOOLS from "./cetus";

export const createSuiTools = (suiAgentKit: SuiAgentKit) => {
  return [
    new NATIVE_TOOLS.SuiBalanceTool(suiAgentKit),
    new NATIVE_TOOLS.SuiTransferTool(suiAgentKit),
    new NATIVE_TOOLS.SuiDeployCoinTool(suiAgentKit),
    new NATIVE_TOOLS.SuiAgentWalletTool(suiAgentKit),
    new SUI_NS_TOOLS.SuiRegisterDomainTool(suiAgentKit),
    new SUI_NS_TOOLS.SuiResolveDomainTool(suiAgentKit),
    new FLOW_X_TOOLS.SuiTradeTool(suiAgentKit),
    new DEX_SCREENER_TOOLS.SuiAssetPriceTool(suiAgentKit),
    new DEX_SCREENER_TOOLS.SuiAssetAddressFromTickerTool(suiAgentKit),
    new GO_PLUS_LABS_TOOLS.SuiAssetDataByTickerTool(suiAgentKit),
    new GO_PLUS_LABS_TOOLS.SuiAssetDataByAddressTool(suiAgentKit),
    new SUILEND_TOOLS.SuiGetReservesSuilend(suiAgentKit),
    new SUILEND_TOOLS.SuiLendAssetSuilend(suiAgentKit),
    new SUILEND_TOOLS.SuiWithdrawLendedAssetSuilend(suiAgentKit),
    new SUILEND_TOOLS.SuiGetRewardsSuilend(suiAgentKit),
    new SUILEND_TOOLS.SuiGetLendedAssetsSuilend(suiAgentKit),
    new SUILEND_TOOLS.SuiClaimAllRewardsSuilend(suiAgentKit),
    new CETUS_TOOLS.SuiGetAllPoolPositionCetus(suiAgentKit),
    new CETUS_TOOLS.SuiGetPoolByCoinsCetus(suiAgentKit),
    new CETUS_TOOLS.SuiOpenPoolPositionCetus(suiAgentKit),
    new CETUS_TOOLS.SuiClosePoolPositionCetus(suiAgentKit),
    new CETUS_TOOLS.SuiCreateClmmPoolCetus(suiAgentKit),
  ];
};
