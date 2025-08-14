export const truncateOrEns = (
  address: string,
  ensMap: Record<string, string>,
) =>
  ensMap[address]
    ? ensMap[address]
    : `${address.slice(0, 4)} ... ${address.slice(-4)}`
