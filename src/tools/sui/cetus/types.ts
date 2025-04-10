import { AddLiquidityFixTokenParams } from "@cetusprotocol/cetus-sui-clmm-sdk";
import BN from "bn.js";

export interface LiquidityInputWithExistingPool
  extends AddLiquidityFixTokenParams {
  coinTypeA: string;
  coinTypeB: string;
  curSqrtPrice: BN;
  pool_id: string;
  tick_lower: number;
  tick_upper: number;
  fix_amount_a: boolean;
  amount_a: number;
  amount_b: number;
  slippage: number;
  is_open: boolean;
  rewarder_coin_types: string[];
  collect_fee: boolean;
  tick_spacing: string;
}

export interface LiquidityInputWithNewPool
  extends Omit<
    LiquidityInputWithExistingPool,
    | "curSqrtPrice"
    | "is_open"
    | "rewarder_coin_types"
    | "collect_fee"
    | "pos_id"
    | "pool_id"
    | "tick_spacing"
  > {
  metadata_a: string;
  metadata_b: string;
  initialize_sqrt_price: string;
  uri: string;
  tick_spacing: number;
}
