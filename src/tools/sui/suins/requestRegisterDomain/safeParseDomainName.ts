/**
 * @description Safe parse domain name to ensure it ends with .sui
 * @param name string - Domain name to parse
 * @returns string - Parsed domain name
 */
export const safeParseDomainName = (name: string) => {
  if (name.includes(".sui")) {
    return name;
  }
  return `${name}.sui`;
};
