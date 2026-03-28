"use client"

import type { Chain } from "viem"
import { useCallback } from "react"
import { useAccount, useChainId, useChains, useSwitchChain } from "wagmi"

interface UseNetworkGuardResult {
  isWrongNetwork: boolean
  isSwitchPending: boolean
  targetChains: readonly Chain[]
  switchNetwork: (chainId: number) => Promise<void>
  chainId: number | undefined
}

export default function useNetworkGuard(): UseNetworkGuardResult {
  // Use Wagmi's built-in state which is perfectly synced with the wallet
  const { status, chainId: accountChainId, connector } = useAccount()
  const storeChainId = useChainId()
  const targetChains = useChains()
  const { switchChainAsync, isPending: isSwitchPending } = useSwitchChain()

  const chainId = status === "connected" ? accountChainId : storeChainId

  const isWrongNetwork =
    status === "connected" &&
    typeof chainId === "number" &&
    targetChains.length > 0 &&
    !targetChains.some((c) => c.id === chainId)

  const switchNetwork = useCallback(
    async (nextChainId: number): Promise<void> => {
      try {
        // Keep it simple: Wagmi internally handles wallet_addEthereumChain and wallet_switchEthereumChain
        // Do not pass random EIP parameters manually as they might be swallowed or break connector logic
        await switchChainAsync({
          chainId: nextChainId,
          // Only pass the connector if we need to force this specific wallet (useful for multi-wallet setups)
          // Removing this entirely forces wagmi to use the active one, which is usually correct
        })
      } catch (error: unknown) {
        const err = error as { code?: number; message?: string }
        if (err?.code === 4001 || /User rejected/i.test(err?.message || "")) {
          console.info("Chain switch rejected by user", { nextChainId })
          return // User rejected, gracefully exit
        }
        console.error("Chain switch failed:", err)
        throw error // Rethrow so ConnectBtn can catch it and reset state
      }
    },
    [switchChainAsync]
  )

  return {
    isWrongNetwork,
    isSwitchPending,
    targetChains,
    switchNetwork,
    chainId,
  }
}
