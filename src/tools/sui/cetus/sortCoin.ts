/**
 * Sort coin types by ascii value. Larger value is considered coinA.
 * @param coinTypeA - Coin type A
 * @param coinTypeB - Coin type B
 * @returns [coinTypeA, coinTypeB]
 */
export const sortCoin = (coinTypeA: string, coinTypeB: string) => {
  const [coinA, coinB] = [coinTypeA, coinTypeB].sort((coinA, coinB) => {
    return coinB.localeCompare(coinA);
  });

  return [coinA, coinB];
};
