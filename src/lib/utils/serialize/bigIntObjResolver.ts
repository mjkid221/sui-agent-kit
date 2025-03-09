export type SerializeBigInt<
  T,
  Serialize extends boolean = true,
> = Serialize extends true
  ? T extends bigint
    ? string
    : T extends Array<infer U>
      ? Array<SerializeBigInt<U, true>>
      : T extends object
        ? { [K in keyof T]: SerializeBigInt<T[K], true> }
        : T
  : T;

/**
 * Deep clone and convert BigInt instances in Objects to strings
 * @param config - The configuration object to serialize
 * @param serialize - Whether to apply type transformation (default: true)
 * @returns The serialized configuration object with BigInt converted to strings
 * @example
 * const config = { a: 1, b: 2n };
 * const serializedConfig = serializeConfiguration(config);
 * // serializedConfig: { a: 1, b: "2" }
 */
export async function serializeConfiguration<T, Serialize extends boolean>(
  config: T,
): Promise<SerializeBigInt<T, Serialize>> {
  return JSON.parse(
    JSON.stringify(config, (_, value) => {
      if (typeof value === "bigint") {
        return value.toString();
      }
      if (typeof value === "object" && value !== null) {
        // Still keep the BigNumber check if needed
        if (typeof value.toString === "function" && value.hex !== undefined) {
          return value.toString();
        }
      }
      return value;
    }),
  ) as SerializeBigInt<T, Serialize>;
}
