export default function sanitizeAddress(address: string) {
  // Add 0x if prefix is missing
  if (!address.startsWith("0x")) {
    return `0x${address}`;
  }

  return address;
}
