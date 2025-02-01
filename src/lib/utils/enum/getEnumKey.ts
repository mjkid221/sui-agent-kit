/**
 * Get the key name from an enum by its value
 * @param enumObj - The enum object
 * @param enumValue - The value of the enum
 * @returns The key name from the enum
 */
export function getEnumKey<T extends { [key: string]: string | number }>(
  enumObj: T,
  enumValue: T[keyof T],
): keyof T | undefined {
  const keys = Object.keys(enumObj) as Array<keyof T>;
  return keys.find((key) => enumObj[key] === enumValue);
}
