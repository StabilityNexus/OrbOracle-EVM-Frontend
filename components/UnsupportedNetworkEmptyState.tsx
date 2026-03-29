'use client'

import { useMemo } from 'react'
import { useSwitchChain } from 'wagmi'
import { OracleFactories } from '@/utils/addresses'

const SUPPORTED_CHAIN_IDS = Object.keys(OracleFactories).map(Number)

export function UnsupportedNetworkEmptyState() {
  const { chains, switchChain } = useSwitchChain()

  const supportedChains = useMemo(
    () => chains.filter((c) => SUPPORTED_CHAIN_IDS.includes(c.id)),
    [chains]
  )

  return (
    <div
      role='status'
      aria-live='polite'
      className='mx-auto flex min-h-[32vh] max-w-2xl flex-col items-center justify-center gap-4 rounded-3xl border border-primary/20 bg-card/30 px-6 py-10 text-center shadow-[0_0_0_1px_rgba(99,102,241,0.06)] backdrop-blur-sm'
    >
      <svg
        width='48'
        height='48'
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='1.5'
        aria-hidden='true'
        className='text-primary/80'
      >
        <circle cx='12' cy='12' r='10' />
        <line x1='12' y1='8' x2='12' y2='12' />
        <circle cx='12' cy='16' r='0.5' fill='currentColor' />
      </svg>

      <h2
        className='text-2xl font-medium text-slate-100'
        style={{ fontStyle: 'oblique 12deg' }}
      >
        Oracle Factory not deployed on this network
      </h2>
      <p className='max-w-md text-base text-muted-foreground'>
        Switch to a supported network to view and interact with oracles.
      </p>

      <div className='mt-2 flex flex-wrap justify-center gap-2'>
        {supportedChains.map((chain) => (
          <button
            key={chain.id}
            onClick={() => switchChain({ chainId: chain.id })}
            className='rounded-xl border border-primary/30 bg-background/60 px-5 py-2.5 text-sm font-medium text-slate-100 transition-colors hover:bg-accent hover:text-accent-foreground'
          >
            Switch to {chain.name}
          </button>
        ))}
      </div>
    </div>
  )
}
