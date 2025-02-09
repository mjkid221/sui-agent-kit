/**
 * Sort addresses by ascii value. Larger value is considered addressA.
 * @param addressA - Address A
 * @param addressB - Address B
 * @param inverse - If true, the order will be reversed
 * @returns [sortedA, sortedB]
 */
export const sortAddresses = (
  addressA: string,
  addressB: string,
  inverse: boolean = false,
) => {
  const [sortedA, sortedB] = [addressA, addressB].sort((a, b) => {
    return b.localeCompare(a);
  });

  return inverse ? [sortedB, sortedA] : [sortedA, sortedB];
};
