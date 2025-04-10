import { BaseCacheStore } from "./cache/BaseCacheStore";

import { CacheStoreConfig } from "./cache/types";

export abstract class BaseAgentStore extends BaseCacheStore {
  constructor(cacheStoreConfig?: CacheStoreConfig) {
    super(cacheStoreConfig);
  }
}
