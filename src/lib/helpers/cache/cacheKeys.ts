export const createTokenDecimalsCacheKey = (address: string) =>
  `decimals:${address}`;

export const createTokenDataByTickerCacheKey = (
  ticker: string,
  chainId: string,
) => `token-data:ticker:${ticker}:${chainId}`;

export const createTokenDataByAddressCacheKey = (
  address: string,
  chainId: string,
) => `token-data:address:${address}:${chainId}`;

export const createTokenPriceCacheKey = (address: string, chainId: string) =>
  `token-price:${address}:${chainId}`;
