import { CacheStore } from "./cacheStore";

export class BaseCacheStore {
  protected cache: CacheStore;

  constructor() {
    this.cache = new CacheStore();
  }
}
