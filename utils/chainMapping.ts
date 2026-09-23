export interface TokenListInfo {
  chainLabel: string;
  tokenListName: string;
}

// Only expose token lists that match the active chain exactly.
const TOKEN_LISTS_BY_CHAIN: Record<number, TokenListInfo> = {
  1: {
    chainLabel: "Ethereum",
    tokenListName: "ethereum",
  },
  61: {
    chainLabel: "Ethereum Classic",
    tokenListName: "ethereum-classic",
  },
  137: {
    chainLabel: "Polygon",
    tokenListName: "polygon-pos",
  },
  56: {
    chainLabel: "BNB Smart Chain",
    tokenListName: "binance-smart-chain",
  },
  8453: {
    chainLabel: "Base",
    tokenListName: "base",
  },
};

export const getTokenListInfo = (chainId: number): TokenListInfo | null => {
  return TOKEN_LISTS_BY_CHAIN[chainId] ?? null;
};
