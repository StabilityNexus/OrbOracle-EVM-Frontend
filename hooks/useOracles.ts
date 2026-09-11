"use client"

import { useState, useEffect } from 'react'
import { useReadContract, useChainId, useConfig } from 'wagmi'
import { readContract } from '@wagmi/core'
import { OracleFactoryAbi } from '@/utils/abi/OracleFactory'
import { OracleAbi } from '@/utils/abi/Oracle'
import { ComposedOracleFactoryAbi } from '@/utils/abi/ComposedOracleFactory'
import { ComposedOracleAbi } from '@/utils/abi/ComposedOracle'
import { OracleFactories, ComposedOracleFactories } from '@/utils/addresses'

const formatTimestamp = (value: bigint | undefined | null) => {
  if (!value || value === BigInt(0)) {
    return '—'
  }

  const millis = Number(value) * 1000
  if (!Number.isFinite(millis)) {
    return '—'
  }

  return new Date(millis).toLocaleString()
}

export interface Oracle {
  id: string
  name: string
  description: string
  address: string
  token: string
  creator: string
  category: string
  status: 'active' | 'inactive' | 'maintenance'
  updateFrequency: string
  accuracy: string
  lastUpdate: string
  lastUpdated: string
  lastTimestamp: string
  isComposed?: boolean
  feedA?: string
  feedB?: string
  operation?: number
  invertResult?: boolean
  defaultSampleSize?: bigint
}

export function useOracles() {
  const chainId = useChainId()
  const config = useConfig()
  const [oracles, setOracles] = useState<Oracle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchOracles() {
      try {
        setLoading(true)
        setError(null)

        const factoryAddress = OracleFactories[chainId as keyof typeof OracleFactories]
        const composedFactoryAddress = ComposedOracleFactories[chainId as keyof typeof ComposedOracleFactories]
        
        let oracleInfos: Array<{ oracle: string; token: string; creator: string }> = []
        let composedOracleInfos: Array<{ oracle: string; feedA: string; feedB: string; operation: number; creator: string }> = []

        // Read standard oracles
        if (factoryAddress && factoryAddress !== '0x0000000000000000000000000000000000000000') {
          try {
            oracleInfos = await readContract(config, {
              address: factoryAddress,
              abi: OracleFactoryAbi,
              functionName: 'allOracles',
            }) as any
          } catch (e) {
            console.error('Error fetching standard oracles:', e)
          }
        }

        // Read composed oracles
        if (composedFactoryAddress && composedFactoryAddress !== '0x0000000000000000000000000000000000000000') {
          try {
            composedOracleInfos = await readContract(config, {
              address: composedFactoryAddress,
              abi: ComposedOracleFactoryAbi,
              functionName: 'allComposedOracles',
            }) as any
          } catch (e) {
            console.error('Error fetching composed oracles:', e)
          }
        }

        // Fetch details for standard oracles
        const oraclePromises = (oracleInfos || []).map(async (info: any, index: number) => {
          try {
            const [name, description, lastUpdated, lastTimestamp] = await Promise.all([
              readContract(config, {
                address: info.oracle as `0x${string}`,
                abi: OracleAbi,
                functionName: 'name',
              }).catch(() => `Oracle ${index + 1}`),
              readContract(config, {
                address: info.oracle as `0x${string}`,
                abi: OracleAbi,
                functionName: 'description',
              }).catch(() => 'No description available'),
              readContract(config, {
                address: info.oracle as `0x${string}`,
                abi: OracleAbi,
                functionName: 'lastUpdated',
              }).catch(() => BigInt(0)),
              readContract(config, {
                address: info.oracle as `0x${string}`,
                abi: OracleAbi,
                functionName: 'lastTimestamp',
              }).catch(() => BigInt(0)),
            ])

            return {
              id: info.oracle,
              name: name as string,
              description: description as string,
              address: info.oracle,
              token: info.token,
              creator: info.creator,
              category: 'Price Feed',
              status: 'active' as const,
              updateFrequency: '1min',
              accuracy: '99.9%',
              lastUpdate: new Date().toISOString(),
              lastUpdated: formatTimestamp(lastUpdated as bigint),
              lastTimestamp: formatTimestamp(lastTimestamp as bigint),
              isComposed: false,
            }
          } catch (err) {
            console.error(`Error fetching details for oracle ${info.oracle}:`, err)
            return {
              id: info.oracle,
              name: `Oracle ${index + 1}`,
              description: 'Error loading description',
              address: info.oracle,
              token: info.token,
              creator: info.creator,
              category: 'Price Feed',
              status: 'inactive' as const,
              updateFrequency: 'Unknown',
              accuracy: 'Unknown',
              lastUpdate: new Date().toISOString(),
              lastUpdated: '—',
              lastTimestamp: '—',
              isComposed: false,
            }
          }
        })

        // Fetch details for composed oracles
        const composedPromises = (composedOracleInfos || []).map(async (info: any, index: number) => {
          try {
            const lastUpdated = await readContract(config, {
              address: info.oracle as `0x${string}`,
              abi: ComposedOracleAbi,
              functionName: 'lastUpdated',
            }).catch(() => BigInt(0))

            return {
              id: info.oracle,
              name: `Composed Oracle ${index + 1}`,
              description: `Price Feed`,
              address: info.oracle,
              token: '0x0000000000000000000000000000000000000000',
              creator: info.creator,
              category: 'Price Feed',
              status: 'active' as const,
              updateFrequency: '1min',
              accuracy: '99.9%',
              lastUpdate: new Date().toISOString(),
              lastUpdated: formatTimestamp(lastUpdated as bigint),
              lastTimestamp: formatTimestamp(lastUpdated as bigint),
              isComposed: true,
              feedA: info.feedA,
              feedB: info.feedB,
              operation: info.operation,
            }
          } catch (err) {
            console.error(`Error fetching details for composed oracle ${info.oracle}:`, err)
            return {
              id: info.oracle,
              name: `Composed Oracle ${index + 1}`,
              description: 'Error loading price feed',
              address: info.oracle,
              token: '0x0000000000000000000000000000000000000000',
              creator: info.creator,
              category: 'Price Feed',
              status: 'inactive' as const,
              updateFrequency: 'Unknown',
              accuracy: 'Unknown',
              lastUpdate: new Date().toISOString(),
              lastUpdated: '—',
              lastTimestamp: '—',
              isComposed: true,
              feedA: info.feedA,
              feedB: info.feedB,
              operation: info.operation,
            }
          }
        })

        const baseOraclesList = await Promise.all(oraclePromises)
        const composedOraclesList = await Promise.all(composedPromises)

        // Map base addresses to names for dynamic composed labeling
        const addressToName = new Map<string, string>()
        baseOraclesList.forEach(o => addressToName.set(o.address.toLowerCase(), o.name))

        const enhancedComposedOracles = composedOraclesList.map(co => {
          const nameA = addressToName.get(co.feedA.toLowerCase()) || co.feedA.slice(0, 6) + '...' + co.feedA.slice(-4)
          const nameB = addressToName.get(co.feedB.toLowerCase()) || co.feedB.slice(0, 6) + '...' + co.feedB.slice(-4)
          const opSymbol = co.operation === 0 ? '×' : '/'
          const combinedName = `${nameA} ${opSymbol} ${nameB}`
          return {
            ...co,
            name: combinedName,
            description: `${combinedName} Price Feed`,
          }
        })

        setOracles([...baseOraclesList, ...enhancedComposedOracles])
      } catch (err) {
        console.error('Error fetching oracles:', err)
        setError('Failed to fetch oracles from contract')
      } finally {
        setLoading(false)
      }
    }

    fetchOracles()
  }, [chainId])

  return {
    oracles,
    loading,
    error,
    refetch: () => {
      setLoading(true)
      setError(null)
    },
  }
}

export function useOracle(oracleAddress: string, targetChainId?: number) {
  const currentChainId = useChainId()
  const config = useConfig()
  const [oracle, setOracle] = useState<Oracle | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Use provided chainId or fall back to current chain
  const chainId = targetChainId || currentChainId

  useEffect(() => {
    async function fetchOracleDetails() {
      if (!oracleAddress) {
        setLoading(false)
        return
      }

      setLoading(true)
      setError(null)

      // If targetChainId is provided and different from current chain, show warning
      if (targetChainId && targetChainId !== currentChainId) {
        setError(`Please switch to chain ${targetChainId} to interact with this oracle`)
        setLoading(false)
        return
      }

      try {
        // Check if it is a composed oracle first by reading feedA
        let isComposed = false
        let feedA = '0x0000000000000000000000000000000000000000'
        let feedB = '0x0000000000000000000000000000000000000000'
        let invertResult = false
        let defaultSampleSize = BigInt(100)

        try {
          const fA = await readContract(config, {
            address: oracleAddress as `0x${string}`,
            abi: ComposedOracleAbi,
            functionName: 'feedA',
          })
          feedA = fA as string
          isComposed = true
        } catch (e) {
          // Standard base oracle
        }

        if (isComposed) {
          try {
            const [fB, inv, size] = await Promise.all([
              readContract(config, {
                address: oracleAddress as `0x${string}`,
                abi: ComposedOracleAbi,
                functionName: 'feedB',
              }),
              readContract(config, {
                address: oracleAddress as `0x${string}`,
                abi: ComposedOracleAbi,
                functionName: 'invertResult',
              }),
              readContract(config, {
                address: oracleAddress as `0x${string}`,
                abi: ComposedOracleAbi,
                functionName: 'defaultSampleSize',
              }),
            ])
            feedB = fB as string
            invertResult = inv as boolean
            defaultSampleSize = size as bigint
          } catch (e) {
            console.error('Error fetching remaining composed oracle parameters:', e)
          }
        }

        if (isComposed) {
          // Query dynamic names for parent feeds
          const [nameA, nameB, lastUpdated] = await Promise.all([
            readContract(config, {
              address: feedA as `0x${string}`,
              abi: OracleAbi,
              functionName: 'name',
            }).catch(() => feedA.slice(0, 6) + '...' + feedA.slice(-4)),
            readContract(config, {
              address: feedB as `0x${string}`,
              abi: OracleAbi,
              functionName: 'name',
            }).catch(() => feedB.slice(0, 6) + '...' + feedB.slice(-4)),
            readContract(config, {
              address: oracleAddress as `0x${string}`,
              abi: ComposedOracleAbi,
              functionName: 'lastUpdated',
            }).catch(() => BigInt(0)),
          ])

          // Retrieve operation and creator from ComposedOracleFactory
          const composedFactoryAddress = ComposedOracleFactories[chainId as keyof typeof ComposedOracleFactories]
          let operation = 0
          let creator = '0x0000000000000000000000000000000000000000'

          if (composedFactoryAddress) {
            try {
              const composedOracleInfos = await readContract(config, {
                address: composedFactoryAddress,
                abi: ComposedOracleFactoryAbi,
                functionName: 'allComposedOracles',
              }) as any[]

              const matchingInfo = composedOracleInfos.find(
                (info: any) => info.oracle.toLowerCase() === oracleAddress.toLowerCase()
              )
              if (matchingInfo) {
                operation = matchingInfo.operation
                creator = matchingInfo.creator
              }
            } catch (e) {
              console.error('Error matching composed oracle details from factory:', e)
            }
          }

          const opSymbol = operation === 0 ? '×' : '/'

          const combinedName = `${nameA} ${opSymbol} ${nameB}`
          setOracle({
            id: oracleAddress,
            name: combinedName,
            description: `${combinedName} Price Feed`,
            address: oracleAddress,
            token: '0x0000000000000000000000000000000000000000',
            creator: creator,
            category: 'Price Feed',
            status: 'active',
            updateFrequency: '1min',
            accuracy: '99.9%',
            lastUpdate: new Date().toISOString(),
            lastUpdated: formatTimestamp(lastUpdated as bigint),
            lastTimestamp: formatTimestamp(lastUpdated as bigint),
            isComposed: true,
            feedA,
            feedB,
            operation,
            invertResult,
            defaultSampleSize,
          })
        } else {
          // Standard base oracle
          const [name, description, lastUpdated, lastTimestamp] = await Promise.all([
            readContract(config, {
              address: oracleAddress as `0x${string}`,
              abi: OracleAbi,
              functionName: 'name',
            }).catch(() => 'Unknown Oracle'),
            readContract(config, {
              address: oracleAddress as `0x${string}`,
              abi: OracleAbi,
              functionName: 'description',
            }).catch(() => 'No description available'),
            readContract(config, {
              address: oracleAddress as `0x${string}`,
              abi: OracleAbi,
              functionName: 'lastUpdated',
            }).catch(() => BigInt(0)),
            readContract(config, {
              address: oracleAddress as `0x${string}`,
              abi: OracleAbi,
              functionName: 'lastTimestamp',
            }).catch(() => BigInt(0)),
          ])

          setOracle({
            id: oracleAddress,
            name: name as string,
            description: description as string,
            address: oracleAddress,
            token: '0x0000000000000000000000000000000000000000',
            creator: '0x0000000000000000000000000000000000000000',
            category: 'Price Feed',
            status: 'active',
            updateFrequency: '1min',
            accuracy: '99.9%',
            lastUpdate: new Date().toISOString(),
            lastUpdated: formatTimestamp(lastUpdated as bigint),
            lastTimestamp: formatTimestamp(lastTimestamp as bigint),
            isComposed: false,
          })
        }
      } catch (err) {
        console.error('Error fetching oracle details:', err)
        setError('Failed to fetch oracle details')
        setOracle({
          id: oracleAddress,
          name: 'Unknown Oracle',
          description: 'Failed to load details',
          address: oracleAddress,
          token: '0x0000000000000000000000000000000000000000',
          creator: '0x0000000000000000000000000000000000000000',
          category: 'Price Feed',
          status: 'inactive',
          updateFrequency: 'Unknown',
          accuracy: 'Unknown',
          lastUpdate: new Date().toISOString(),
          lastUpdated: '—',
          lastTimestamp: '—',
        })
      } finally {
        setLoading(false)
      }
    }

    fetchOracleDetails()
  }, [oracleAddress, chainId, targetChainId, currentChainId])

  return {
    oracle,
    loading,
    error,
    refetch: () => {
      setLoading(true)
      setError(null)
    },
  }
}
