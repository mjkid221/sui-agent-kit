import { BaseSuiPlugin } from "@/plugins/base";
import registerDomainAction from "@/actions/sui/suins/registerDomain";
import resolveDomainAction from "@/actions/sui/suins/resolveDomain";
import { SuiAgentKit } from "@/agent/sui";

/**
 * SuiNS domain name service plugin
 */
export class SuiNSPlugin extends BaseSuiPlugin<SuiAgentKit> {
  constructor() {
    super("sui-ns", "SuiNS domain name service operations", "1.0.0");

    // Register SuiNS actions
    this.registerAction(registerDomainAction);
    this.registerAction(resolveDomainAction);
  }
}
