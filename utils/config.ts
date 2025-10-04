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

export const config = getDefaultConfig({
  appName: 'OrbOracle',
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID ?? '',
  chains: [
    mainnet,
    base,
    scrollSepolia,
    bsc,
  ],
  ssr: true,
})
