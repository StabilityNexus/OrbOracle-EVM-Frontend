import { http, createConfig, createStorage } from 'wagmi'
import {
  base,
  bsc,
  mainnet,
  polygon,
  scrollSepolia
} from 'wagmi/chains'
import { injected, safe } from 'wagmi/connectors'

export const config = createConfig({
  chains: [
    mainnet,
    base,
    scrollSepolia,
    bsc,
  ],
  connectors: [injected(), safe()],
  storage: createStorage({
    storage: typeof window !== 'undefined' ? window.sessionStorage : undefined,
  }),
  multiInjectedProviderDiscovery: true,
  transports: {
    [mainnet.id]: http(),
    [base.id]: http(),
    [scrollSepolia.id]: http(),
    [bsc.id]: http(),
  },
  ssr: true,
})
