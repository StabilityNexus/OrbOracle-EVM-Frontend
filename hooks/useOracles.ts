"use client"

import { useState, useEffect } from 'react'
import { useReadContract, useChainId, useConfig } from 'wagmi'
import { readContract } from '@wagmi/core'
import { OracleFactoryAbi } from '@/utils/abi/OracleFactory'
import { OracleAbi } from '@/utils/abi/Oracle'
import { OracleFactories } from '@/utils/addresses'

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
  lastSubmissionTime: string
  lastTimestamp: string
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
        
        if (!factoryAddress || factoryAddress === '0x0000000000000000000000000000000000000000') {
          setError('Oracle Factory not deployed on this network')
          setLoading(false)
          return
        }

        // Read all oracles from the factory
        const oracleInfos = await readContract(config, {
          address: factoryAddress,
          abi: OracleFactoryAbi,
          functionName: 'allOracles',
        }) as Array<{ oracle: string; token: string; creator: string }>

        if (!oracleInfos || !Array.isArray(oracleInfos)) {
          setOracles([])
          setLoading(false)
          return
        }

        // Fetch details for each oracle
        const oraclePromises = oracleInfos.map(async (info: any, index: number) => {
          try {
            // Read oracle name and description from the contract
            const [name, description, lastSubmissionTime, lastTimestamp] = await Promise.all([
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
                functionName: 'lastSubmissionTime',
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
              lastSubmissionTime: formatTimestamp(lastSubmissionTime as bigint),
              lastTimestamp: formatTimestamp(lastTimestamp as bigint),
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
              lastSubmissionTime: '—',
              lastTimestamp: '—',
            }
          }
        })

        const oracleDetails = await Promise.all(oraclePromises)
        setOracles(oracleDetails)
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
        // Read oracle details from the contract
        const [name, description, lastSubmissionTime, lastTimestamp] = await Promise.all([
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
            functionName: 'lastSubmissionTime',
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
          lastSubmissionTime: formatTimestamp(lastSubmissionTime as bigint),
          lastTimestamp: formatTimestamp(lastTimestamp as bigint),
        })
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
          lastSubmissionTime: '—',
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
