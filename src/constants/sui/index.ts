import {
  SAME_NAME_SYMBOL_COIN_BYTECODE,
  STANDARD_COIN_BYTECODE,
} from "./tokenByteCode";

export const COMMON_TOKEN_TYPES = {
  SUI: "0x2::sui::SUI",
  USDC: "0xdba34672e30cb065b1f93e3ab55318768fd6fef66c15942c9f7cb846e2f900e7::usdc::USDC",
};

/**
 * Default configuration options
 * @property {number} SLIPPAGE_BPS - Default slippage tolerance in basis points (300 = 3%)
 * @property {number} TOKEN_DECIMALS - Default number of decimals for new tokens
 */
export const DEFAULT_OPTIONS = {
  SLIPPAGE_BPS: 10_000, // 1% = 1 / 100 * 1e6
  TOKEN_DECIMALS: 6,
} as const;

/**
 * 1 SUI
 */
export const CREATE_TOKEN_SUI_FEE = 1_000_000_000;

// Barrel
export { SAME_NAME_SYMBOL_COIN_BYTECODE, STANDARD_COIN_BYTECODE };
