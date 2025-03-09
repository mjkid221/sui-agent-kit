import { CacheStore } from "./CacheStore";
import { Keyv } from "keyv";
import { CacheStoreConfig, CacheStoreType } from "./types";
import KeyvRedis from "@keyv/redis";
import { KeyvCacheableMemory } from "cacheable";

export abstract class BaseCacheStore {
  protected cache: CacheStore;
  constructor(cacheStoreConfig?: CacheStoreConfig) {
    if (!cacheStoreConfig) {
      this.cache = new CacheStore(new Keyv());
      return;
    }
    const { cacheStoreType } = cacheStoreConfig;
    let store;
    switch (cacheStoreType) {
      case CacheStoreType.REDIS:
        if (!cacheStoreConfig.externalDbUrl) {
          throw new Error("External DB URL is required for Redis cache store");
        }
        store = new Keyv({
          store: new KeyvRedis(cacheStoreConfig.externalDbUrl),
          namespace: cacheStoreConfig.namespace,
        });
        break;
      case CacheStoreType.LRU:
        store = new Keyv({
          store: new KeyvCacheableMemory({
            ...cacheStoreConfig,
          }),
        });
        break;
      default:
        store = new Keyv();
        break;
    }
    this.cache = new CacheStore(store);
  }
}
