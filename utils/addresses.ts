export const OracleFactoryMetadata = {
  534351: {
    address: '0xF72f1B809C734b1C47930D01636936EA28d7484B',
    label: 'Scroll Sepolia',
  },
} as const

export const OracleFactories = Object.fromEntries(
  Object.entries(OracleFactoryMetadata).map(([chainId, config]) => [Number(chainId), config.address])
) as {
  [key: number]: `0x${string}`
}

export const supportedOracleChainIds = Object.keys(OracleFactoryMetadata).map((chainId) => Number(chainId))

export function getOracleChainLabel(chainId?: number | null) {
  if (!chainId) {
    return undefined
  }

  return OracleFactoryMetadata[chainId as keyof typeof OracleFactoryMetadata]?.label
}
