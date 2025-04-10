export enum CacheStoreType {
  REDIS = "redis",
  LRU = "lru",
  MEMORY = "memory",
}

export type RedisCacheOptions = {
  externalDbUrl: string;
  namespace?: string;
};

export type LRUCacheOptions = {
  lruSize?: number;
  ttl?: number;
};

export type CacheStoreConfig =
  | ({
      cacheStoreType: CacheStoreType.REDIS;
    } & RedisCacheOptions)
  | ({
      cacheStoreType: CacheStoreType.LRU;
    } & LRUCacheOptions)
  | {
      cacheStoreType: CacheStoreType.MEMORY;
    };
