import { TickMath } from "@cetusprotocol/cetus-sui-clmm-sdk";
import BN from "bn.js";

export const getTickValues = (
  currentTickIndex: number,
  tickSpacing: number,
) => {
  const lowerTick = TickMath.getPrevInitializableTickIndex(
    new BN(currentTickIndex).toNumber(),
    new BN(tickSpacing).toNumber(),
  );
  const upperTick = TickMath.getNextInitializableTickIndex(
    new BN(currentTickIndex).toNumber(),
    new BN(tickSpacing).toNumber(),
  );

  return { lowerTick, upperTick, tickSpacing };
};
