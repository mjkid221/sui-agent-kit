/**
 * Adds an optional field to an object if the source value exists
 *
 * @template T - Type of the input object
 * @template R - Type of the return value after transformation
 * @param {T} result - Source object containing the data
 * @param {string} fieldName - Name of the field to add to the output
 * @param {keyof T} responseKey - Key to look up in the source object
 * @param {(value: T[keyof T]) => R} getValue - Function to transform the value
 * @returns {Record<string, R>} Object containing the new field if source value exists, empty object otherwise
 *
 * @example
 * // Basic usage with boolean transformation
 * const data = { is_active: "1" };
 * const result = addOptionalField(
 *   data,
 *   "isActive",
 *   "is_active",
 *   (val) => val === "1"
 * );
 * // Result: { isActive: true }
 *
 * @example
 * // When source value doesn't exist
 * const data = { other_field: "value" };
 * const result = addOptionalField(
 *   data,
 *   "isActive",
 *   "is_active",
 *   (val) => val === "1"
 * );
 * // Result: {}
 *
 * @example
 * // With number transformation
 * const data = { count: "42" };
 * const result = addOptionalField(
 *   data,
 *   "totalCount",
 *   "count",
 *   (val) => Number(val)
 * );
 * // Result: { totalCount: 42 }
 */
export const addOptionalField = <T extends Record<string, any>, R>(
  result: T,
  fieldName: string,
  responseKey: keyof T,
  getValue: (value: T[keyof T]) => R,
): Record<string, R> => {
  if (result[responseKey]) {
    return { [fieldName]: getValue(result[responseKey]) };
  }
  return {};
};
