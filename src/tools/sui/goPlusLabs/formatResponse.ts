import { GoPlusLabsSuiTokenData } from "@/lib/helpers/token";
import { addOptionalField } from "@/lib/utils/transform/optionalFields";

type ValueContainer = {
  value?: string | number;
  [key: string]: any;
};

const isTrue = (input?: string | number | ValueContainer): boolean => {
  if (typeof input === "object" && input !== null) {
    return Number(input.value) === 0 || !input.value ? false : true;
  }
  return Number(input) === 0 || !input ? false : true;
};

export const formatGoPlusLabsSuiTokenData = (
  data: Partial<GoPlusLabsSuiTokenData>,
) => {
  return {
    name: data.name,
    symbol: data.symbol,
    totalSupply: data.total_supply,
    creator: data.creator,
    decimals: data.decimals,
    ...addOptionalField(data, "isMintable", "mintable", isTrue),
    ...addOptionalField(data, "isBlacklistable", "blacklist", isTrue),
    ...addOptionalField(
      data,
      "isContractUpgradeable",
      "contract_upgradeable",
      isTrue,
    ),
    ...addOptionalField(
      data,
      "isMetadataModifiable",
      "metadata_modifiable",
      isTrue,
    ),
    ...addOptionalField(data, "isTrustedToken", "trusted_token", isTrue),
  };
};
