import {
  base,
  bsc,
  classic,
  mainnet,
  polygon,
  scrollSepolia,
  sepolia
} from 'wagmi/chains'
import {
  getDefaultConfig
} from '@rainbow-me/rainbowkit'
import { http } from 'wagmi'

export const config = getDefaultConfig({
  appName: 'OrbOracle',
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID ?? '8dd54aacfe3cf3db6f8040d9e9a901e4',
  chains: [
    mainnet,
    classic,
    base,
    scrollSepolia,
    bsc,
    sepolia,
  ],
  transports: {
    [sepolia.id]: http('https://ethereum-sepolia-rpc.publicnode.com'),
    [classic.id]: http('https://etc.etcdesktop.com'),
    [scrollSepolia.id]: http('https://scroll-public.scroll-testnet.quiknode.pro'),
    [mainnet.id]: http('https://cloudflare-eth.com'),
    [base.id]: http('https://mainnet.base.org'),
    [bsc.id]: http('https://bsc-dataseed.binance.org'),
  },
  ssr: true,
})
