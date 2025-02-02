import { CacheStore } from "./CacheStore";

export abstract class BaseCacheStore {
  protected cache: CacheStore;

  constructor() {
    this.cache = new CacheStore();
  }
}
