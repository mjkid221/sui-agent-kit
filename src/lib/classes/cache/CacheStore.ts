import { Keyv } from "keyv";

export class CacheStore {
  private cache;

  constructor(store: Keyv) {
    this.cache = store;
  }
  async get<T>(key: string): Promise<T | null> {
    const value = await this.cache.get<T>(key);
    return value ?? null;
  }

  /**
   * Set a key in the cache
   * @param key - The key to set
   * @param value - The value to set
   * @param ttl - The time to live for the cache in seconds. If not provided, the cache will be cached indefinitely.
   * @returns The value that was set
   */
  async set<T>(key: string, value: T, ttl?: number): Promise<T> {
    await this.cache.set(key, value, ttl);
    return value;
  }

  /**
   * Delete a key from the cache
   * @param key - The key to delete
   * @returns Whether the key was deleted
   */
  async del(key: string): Promise<boolean> {
    return this.cache.delete(key);
  }

  /**
   * Wraps a function with a cache. If the cache is hit, the cached value is returned.
   * If the cache is not hit, the function is called and the result is cached.
   * @param key - The key to use for the cache
   * @param fn - The function to wrap
   * @param ttl - The time to live for the cache in milliseconds. If not provided, the cache will be cached indefinitely.
   * @returns The result of the function
   */
  async withCache<T>(
    key: string,
    fn: () => Promise<T>,
    ttl?: number,
  ): Promise<T> {
    const cachedValue = await this.get<T>(key);
    if (cachedValue) {
      return cachedValue;
    }

    const result = await fn();
    await this.set(key, result, ttl);
    return result;
  }
}
