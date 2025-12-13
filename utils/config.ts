import {
  base,
  bsc,
  mainnet,
  polygon,
  scrollSepolia
} from 'wagmi/chains'
import {
  getDefaultConfig
} from '@rainbow-me/rainbowkit'

// Fallback project ID for development (get your own at https://cloud.walletconnect.com)
const projectId = process.env.NEXT_PUBLIC_PROJECT_ID || 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6'

export const config = getDefaultConfig({
  appName: 'OrbOracle',
  projectId,
  chains: [
    mainnet,
    base,
    scrollSepolia,
    bsc,
  ],
  ssr: true,
})
