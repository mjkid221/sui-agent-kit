/**
 * @description Safe parse domain name to ensure it ends with .sui
 * @param name string - Domain name to parse
 * @returns string - Parsed domain name
 */
export const safeParseDomainName = (name: string) => {
  const trimmedName = name.trim();
  if (trimmedName.includes(".sui")) {
    return trimmedName;
  }
  return `${trimmedName}.sui`;
};
