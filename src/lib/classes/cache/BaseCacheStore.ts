import { CacheStore } from "./CacheStore";

export abstract class BaseCacheStore {
  constructor(protected cache: CacheStore = new CacheStore()) {}
}
