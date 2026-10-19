'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Loader2, ArrowRight, Info, Check, Copy } from 'lucide-react'
import { toast } from '@/components/ui/use-toast'
import Link from 'next/link'
import { useState, useEffect, useMemo } from 'react'
import { useAccount, useChainId, useConfig } from 'wagmi'
import { writeContract, simulateContract, readContract } from '@wagmi/core'
import { OracleFactories, ComposedOracleFactories } from '@/utils/addresses'
import { OracleFactoryAbi } from '@/utils/abi/OracleFactory'
import { ComposedOracleFactoryAbi } from '@/utils/abi/ComposedOracleFactory'
import TokenSelector from '@/components/TokenSelector'
import { useOracles } from '@/hooks/useOracles'

interface CustomSelectProps {
  value: string
  onChange: (val: string) => void
  options: Array<{ address: string; name: string }>
  placeholder: string
  error?: string
}

function CustomSelect({ value, onChange, options, placeholder, error }: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const selectedOption = options.find(opt => opt.address.toLowerCase() === value.toLowerCase())

  useEffect(() => {
    if (!isOpen) return
    const handleOutsideClick = () => setIsOpen(false)
    window.addEventListener('click', handleOutsideClick)
    return () => window.removeEventListener('click', handleOutsideClick)
  }, [isOpen])

  return (
    <div className="relative w-full" onClick={(e) => e.stopPropagation()}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between w-full h-11 px-4 bg-white/5 border border-white/10 rounded-xl text-left text-white font-mono text-xs cursor-pointer focus:border-primary/40 transition-all outline-none ${
          error ? 'border-red-500' : ''
        }`}
      >
        <span className={selectedOption ? 'text-white' : 'text-zinc-500'}>
          {selectedOption ? `${selectedOption.name} (${selectedOption.address.slice(0, 6)}...${selectedOption.address.slice(-4)})` : placeholder}
        </span>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="12" 
          height="12" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="rgba(255,255,255,0.6)" 
          strokeWidth="1.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-50 left-0 right-0 mt-2 bg-zinc-950 border border-white/10 rounded-2xl p-1.5 shadow-2xl backdrop-blur-md max-h-60 overflow-y-auto scrollbar-none animate-fadeIn">
          {options.length === 0 ? (
            <div className="px-4 py-3 text-zinc-500 font-mono text-xs">No options available</div>
          ) : (
            <div className="flex flex-col space-y-1">
              {options.map((opt) => (
                <button
                  key={opt.address}
                  type="button"
                  onClick={() => {
                    onChange(opt.address)
                    setIsOpen(false)
                  }}
                  className={`w-full text-left px-3 py-2 rounded-xl font-mono text-xs transition-all cursor-pointer flex items-center justify-between ${
                    value.toLowerCase() === opt.address.toLowerCase()
                      ? 'bg-primary/20 text-white border border-primary/25'
                      : 'text-zinc-400 hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <span>{opt.name}</span>
                  <span className="text-[10px] opacity-60">({opt.address.slice(0, 6)}...{opt.address.slice(-4)})</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

interface CustomOperationSelectProps {
  value: string
  onChange: (val: string) => void
}

function CustomOperationSelect({ value, onChange }: CustomOperationSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const operations = [
    { value: '0', label: 'Multiplication (Feed A × Feed B)' },
    { value: '1', label: 'Division (Feed A / Feed B)' }
  ]
  const selectedOp = operations.find(op => op.value === value)

  useEffect(() => {
    if (!isOpen) return
    const handleOutsideClick = () => setIsOpen(false)
    window.addEventListener('click', handleOutsideClick)
    return () => window.removeEventListener('click', handleOutsideClick)
  }, [isOpen])

  return (
    <div className="relative w-full" onClick={(e) => e.stopPropagation()}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full h-11 px-4 bg-white/5 border border-white/10 rounded-xl text-left text-white font-mono text-xs cursor-pointer focus:border-primary/40 transition-all outline-none"
      >
        <span className="text-white">{selectedOp ? selectedOp.label : 'Select Operation'}</span>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="12" 
          height="12" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="rgba(255,255,255,0.6)" 
          strokeWidth="1.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-50 left-0 right-0 mt-2 bg-zinc-950 border border-white/10 rounded-2xl p-1.5 shadow-2xl backdrop-blur-md animate-fadeIn">
          <div className="flex flex-col space-y-1">
            {operations.map((op) => (
              <button
                key={op.value}
                type="button"
                onClick={() => {
                  onChange(op.value)
                  setIsOpen(false)
                }}
                className={`w-full text-left px-3 py-2 rounded-xl font-mono text-xs transition-all cursor-pointer ${
                  value === op.value
                    ? 'bg-primary/20 text-white border border-primary/25'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                {op.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default function CreateOracleIntegrated() {
  const account = useAccount()
  const activeChainId = useChainId()
  const config = useConfig()
  
  // Tab layout state
  const [activeTab, setActiveTab] = useState<'base' | 'composed'>('base')

  // Base Oracle parameters
  const [name, setName] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [weightToken, setWeightToken] = useState<string>('')
  const [rewardPercent, setRewardPercent] = useState<string>('1.0')
  const [halfLifeSeconds, setHalfLifeSeconds] = useState<string>('3600')
  const [quorumPercent, setQuorumPercent] = useState<string>('20')
  const [depositLock, setDepositLock] = useState<string>('3600')
  const [withdrawLock, setWithdrawLock] = useState<string>('3600')
  const [gamma, setGamma] = useState<string>('1')
  const [defaultSampleSize, setDefaultSampleSize] = useState<string>('100')

  // Composed Oracle parameters
  const [feedAAddress, setFeedAAddress] = useState<string>('')
  const [feedBAddress, setFeedBAddress] = useState<string>('')
  const [composedOperation, setComposedOperation] = useState<string>('0') // 0 for multiplication, 1 for division
  const [composedInvertResult, setComposedInvertResult] = useState<boolean>(false)
  const [composedSampleSize, setComposedSampleSize] = useState<string>('100')
  const [composedDescription, setComposedDescription] = useState<string>('')

  // Load existing feeds for selector dropdown
  const { oracles: existingOracles } = useOracles()
  const baseOracles = useMemo(() => {
    return existingOracles ? existingOracles.filter((o) => !o.isComposed) : []
  }, [existingOracles])

  // UI state
  const [loadingCreation, setLoadingCreation] = useState<boolean>(false)
  const [submitted, setSubmitted] = useState<boolean>(false)
  const [hashTx, setHashTx] = useState<string>('')
  const [oracleAddress, setOracleAddress] = useState<string>('')
  const [showTooltip, setShowTooltip] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const [errors, setErrors] = useState<{
    name?: string
    description?: string
    weightToken?: string
    reward?: string
    halfLifeSeconds?: string
    quorumBps?: string
    depositLock?: string
    withdrawLock?: string
    gamma?: string
    defaultSampleSize?: string
    feedAAddress?: string
    feedBAddress?: string
    composedSampleSize?: string
    composedDescription?: string
  }>({})

  // Reset form when chain changes
  useEffect(() => {
    setSubmitted(false)
    setHashTx('')
    setOracleAddress('')
  }, [activeChainId])

  const constructorArgs = useMemo(() => {
    return [
      name || "Unnamed Oracle",                                                    // name
      description || "No description provided",                                   // description
      (weightToken || "0x0000000000000000000000000000000000000000") as `0x${string}`, // weightToken
      BigInt(Math.round(Number(halfLifeSeconds || 0))),                                       // halfLifeSeconds
      BigInt(Math.round(Number(quorumPercent || 0) * 100)),                                   // q (percentage -> basis points)
      BigInt(Math.round(Number(depositLock || 0))),                                           // depositLockingPeriod
      BigInt(Math.round(Number(withdrawLock || 0))),                                          // withdrawalLockingPeriod
      BigInt(Math.round(Number(rewardPercent || 0) * 1000)),                                  // rewardBps (percentage -> 1e5 scale)
      BigInt(gamma && /^\d+$/.test(gamma) ? gamma : "0"),                         // gamma
      BigInt(defaultSampleSize && /^\d+$/.test(defaultSampleSize) ? defaultSampleSize : "100"), // defaultSampleSize
    ] as const
  }, [name, description, weightToken, rewardPercent, halfLifeSeconds, quorumPercent, depositLock, withdrawLock, gamma, defaultSampleSize])

  const validateInputs = () => {
    const newErrors: any = {}

    if (activeTab === 'composed') {
      if (!feedAAddress) newErrors.feedAAddress = 'Parent Oracle A is required'
      if (!feedBAddress) newErrors.feedBAddress = 'Parent Oracle B is required'
      if (feedAAddress && feedBAddress && feedAAddress.toLowerCase() === feedBAddress.toLowerCase()) {
        newErrors.feedBAddress = 'Parent Oracle B cannot be the same as Parent Oracle A'
      }
      if (!composedSampleSize) {
        newErrors.composedSampleSize = 'Default sample size is required'
      } else if (!/^\d+$/.test(composedSampleSize) || BigInt(composedSampleSize) <= BigInt(0)) {
        newErrors.composedSampleSize = 'Default sample size must be a positive integer'
      }
      if (!composedDescription.trim()) {
        newErrors.composedDescription = 'Composed oracle description is required'
      }
    } else {
      if (!name) newErrors.name = 'Oracle name is required'
      if (!description) newErrors.description = 'Description is required'
      if (!weightToken) newErrors.weightToken = 'Oracle operator token address is required'
      if (!rewardPercent) newErrors.reward = 'Reward percentage is required'
      else if (Number(rewardPercent) < 0 || Number(rewardPercent) > 100) newErrors.reward = 'Reward must be between 0% and 100%'

      if (!halfLifeSeconds) newErrors.halfLifeSeconds = 'Half life seconds is required'
      if (!depositLock) newErrors.depositLock = 'Deposit lock period is required'
      if (!withdrawLock) newErrors.withdrawLock = 'Withdrawal lock period is required'
      if (!gamma) newErrors.gamma = 'Gamma is required'
      if (!defaultSampleSize) newErrors.defaultSampleSize = 'Default sample size is required'
      else if (Number(defaultSampleSize) <= 0) newErrors.defaultSampleSize = 'Default sample size must be greater than 0'

      if (!quorumPercent) newErrors.quorumBps = 'Quorum percentage is required'
      else if (Number(quorumPercent) < 0 || Number(quorumPercent) > 100) newErrors.quorumBps = 'Quorum must be between 0% and 100%'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const onCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
      toast({
        title: 'Copied!',
        description: 'Address copied to clipboard',
      })
    } catch (e) {
      console.error(e)
    }
  }

  const getBlockExplorerUrl = (chainId: number, txHash: string) => {
    const explorers: { [key: number]: string } = {
      1: 'https://etherscan.io',
      8453: 'https://basescan.org',
      534351: 'https://sepolia.scrollscan.com',
      11155111: 'https://sepolia.etherscan.io',
    }
    return explorers[chainId] ? `${explorers[chainId]}/tx/${txHash}` : ''
  }

  const getAddressExplorerUrl = (chainId: number, address: string) => {
    const explorers: { [key: number]: string } = {
      1: 'https://etherscan.io',
      8453: 'https://basescan.org',
      534351: 'https://sepolia.scrollscan.com',
      11155111: 'https://sepolia.etherscan.io',
    }
    return explorers[chainId] ? `${explorers[chainId]}/address/${address}` : ''
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  async function createOracle() {
    if (!validateInputs()) {
      toast({
        title: 'Error',
        description: 'Please fix the errors before submitting.',
        variant: 'destructive',
      })
      return
    }

    if (!account.address) {
      toast({
        title: 'Error',
        description: 'Please connect your wallet first.',
        variant: 'destructive',
      })
      return
    }

    try {
      setLoadingCreation(true)

      if (activeTab === 'composed') {
        const factoryAddress = ComposedOracleFactories[activeChainId as keyof typeof ComposedOracleFactories]

        if (!factoryAddress || factoryAddress === '0x0000000000000000000000000000000000000000') {
          throw new Error('Composed Oracle Factory not deployed on this network')
        }

        const composedArgs = [
          feedAAddress as `0x${string}`,
          feedBAddress as `0x${string}`,
          Number(composedOperation),
          composedInvertResult,
          BigInt(composedSampleSize),
          composedDescription.trim() || 'Composed Oracle',
        ] as const

        // Simulate the transaction first
        const { request } = await simulateContract(config, {
          address: factoryAddress,
          abi: ComposedOracleFactoryAbi,
          functionName: 'createComposedOracle',
          args: composedArgs,
          account: account.address,
        })

        // Execute the transaction
        const tx = await writeContract(config, request)
        setHashTx(tx)

        toast({
          title: 'Transaction Submitted',
          description: 'Your composed oracle is being created...',
        })

        // Wait for transaction and get composed oracle address
        setTimeout(async () => {
          try {
            // Get the list of all composed oracles from the factory
            const allComposed = await readContract(config, {
              address: factoryAddress,
              abi: ComposedOracleFactoryAbi,
              functionName: 'allComposedOracles',
            }) as any[]

            const matching = allComposed.filter((info: any) => info.creator.toLowerCase() === account.address!.toLowerCase())
            if (matching.length > 0) {
              const latestComposed = matching[matching.length - 1]
              setOracleAddress(latestComposed.oracle)
            }

            setSubmitted(true)
            toast({
              title: 'Composed Oracle Created',
              description: 'Your composed oracle has been successfully deployed!',
            })
          } catch (err) {
            console.error('Error getting composed oracle address:', err)
            setSubmitted(true)
          }
        }, 5000)

      } else {
        const factoryAddress = OracleFactories[activeChainId as keyof typeof OracleFactories]

        if (!factoryAddress || factoryAddress === '0x0000000000000000000000000000000000000000') {
          throw new Error('Oracle Factory not deployed on this network')
        }

        // Simulate the transaction first
        const { request } = await simulateContract(config, {
          address: factoryAddress,
          abi: OracleFactoryAbi,
          functionName: 'createOracle',
          args: constructorArgs,
          account: account.address,
        })

        // Execute the transaction
        const tx = await writeContract(config, request)
        setHashTx(tx)

        toast({
          title: 'Transaction Submitted',
          description: 'Your oracle is being created...',
        })

        // Wait for transaction and get oracle address
        setTimeout(async () => {
          try {
            // Get the latest oracle from the factory
            const allOracles = await readContract(config, {
              address: factoryAddress,
              abi: OracleFactoryAbi,
              functionName: 'allOracles',
            }) as Array<{ oracle: string; token: string; creator: string }>

            if (allOracles.length > 0) {
              const latestOracle = allOracles[allOracles.length - 1]
              setOracleAddress(latestOracle.oracle)
            }

            setSubmitted(true)
            toast({
              title: 'Oracle Created',
              description: 'Your oracle has been successfully deployed!',
            })
          } catch (err) {
            console.error('Error getting oracle address:', err)
            setSubmitted(true)
          }
        }, 5000)
      }

    } catch (err: any) {
      console.error(err)
      toast({
        title: 'Error',
        description: err.message || 'An unexpected error occurred while creating the oracle.',
        variant: 'destructive',
      })
    } finally {
      setLoadingCreation(false)
    }
  }

  if (submitted) {
    return (
      <div className="relative min-h-[60vh] flex items-center justify-center">
        {/* Success Card Single Surface */}
        <div className="bg-zinc-950/70 border border-white/10 rounded-3xl p-8 shadow-2xl backdrop-blur-md max-w-2xl mx-auto w-full text-center space-y-6">
          <div className="space-y-3">
            <h2 className="text-3xl font-medium text-slate-100">
              Oracle Created Successfully!
            </h2>
            <p className="text-base text-slate-200">
              Your oracle has been deployed and is ready to use.
            </p>
            {oracleAddress && (
              <div className="bg-zinc-950/60 border border-white/10 rounded-xl p-3 font-mono text-xs text-white max-w-sm mx-auto shadow-inner">
                <div className="flex items-center justify-between">
                  <span className="text-primary font-semibold">{formatAddress(oracleAddress)}</span>
                  <button
                    onClick={() => onCopy(oracleAddress)}
                    className="text-[10px] bg-white/5 hover:bg-white/10 border border-white/10 px-2.5 py-1 rounded-lg transition-colors text-white"
                  >
                    {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                  </button>
                </div>
              </div>
            )}
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center pt-4">
            {hashTx && (
              <Link href={getBlockExplorerUrl(activeChainId, hashTx)} target="_blank">
                <Button variant="outline" className="h-11 px-6 rounded-full border-white/10 hover:bg-white/5 text-white font-mono text-xs font-medium tracking-wide uppercase transition-all">
                  View Transaction
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            )}
            {oracleAddress && (
              <Link href={`/o?chainId=${activeChainId}&oracle=${oracleAddress}`}>
                <Button className="h-11 px-6 rounded-full bg-white hover:bg-zinc-200 text-black font-mono text-xs font-semibold tracking-wide uppercase shadow-md transition-all">
                  Go to Oracle
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            )}
            <Link href="/explorer">
              <Button variant="outline" className="h-11 px-6 rounded-full border-white/10 hover:bg-white/5 text-white font-mono text-xs font-medium tracking-wide uppercase transition-all">
                Browse Oracles
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="font-sans text-foreground text-slate-100" >
      <form onSubmit={(e) => { e.preventDefault(); createOracle(); }} className="space-y-8">
        
        {/* Tab Selector */}
        <div className="flex justify-center mb-8 max-w-4xl mx-auto gap-3 sm:gap-4">
          <Button
            type="button"
            onClick={() => {
              setActiveTab('base')
              setSubmitted(false)
              setOracleAddress('')
              setHashTx('')
            }}
            className={`h-11 sm:h-12 px-6 sm:px-8 rounded-full border transition-all duration-300 font-mono text-xs sm:text-sm tracking-wide font-medium ${
              activeTab === 'base'
                ? 'bg-white text-black border-white shadow-md'
                : 'bg-white/5 text-muted-foreground border-white/10 hover:bg-white/10 hover:text-white'
            }`}
          >
            Base Oracle
          </Button>
          <Button
            type="button"
            onClick={() => {
              setActiveTab('composed')
              setSubmitted(false)
              setOracleAddress('')
              setHashTx('')
            }}
            className={`h-11 sm:h-12 px-6 sm:px-8 rounded-full border transition-all duration-300 font-mono text-xs sm:text-sm tracking-wide font-medium ${
              activeTab === 'composed'
                ? 'bg-white text-black border-white shadow-md'
                : 'bg-white/5 text-muted-foreground border-white/10 hover:bg-white/10 hover:text-white'
            }`}
          >
            Composed Oracle
          </Button>
        </div>

        {activeTab === 'composed' ? (
          <div className="bg-zinc-950/70 border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md max-w-4xl mx-auto space-y-6">
            <div className="border-b border-white/5 pb-4">
                <h2 className="text-sm font-mono tracking-widest text-primary uppercase font-bold">
                  Composed Oracle Configuration
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="space-y-1">
                <div className="flex items-center gap-2 mb-2 relative">
                  <Label htmlFor="feedA" className="font-mono text-[10.5px] tracking-wider text-muted-foreground uppercase">
                    Parent Oracle A (Base) *
                  </Label>
                  <button
                    type="button"
                    className="text-slate-300 hover:text-slate-100 transition-colors"
                    onMouseEnter={() => setShowTooltip('feedA')}
                    onMouseLeave={() => setShowTooltip(null)}
                  >
                    <Info className="h-3 w-3" />
                  </button>
                  {showTooltip === 'feedA' && (
                    <div className="absolute bottom-full mb-2 left-0 z-50 bg-zinc-950 border border-white/10 text-white font-mono text-[9.5px] rounded-lg p-2.5 shadow-xl max-w-xs pointer-events-none">
                      The first parent oracle contract address to compose.
                    </div>
                  )}
                </div>
                <CustomSelect
                  value={feedAAddress}
                  onChange={(address) => setFeedAAddress(address)}
                  options={baseOracles}
                  placeholder="Select Parent Oracle A"
                  error={errors.feedAAddress}
                />
                {errors.feedAAddress && <p className="text-red-400 text-xs">{errors.feedAAddress}</p>}
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 mb-2 relative">
                  <Label htmlFor="feedB" className="font-mono text-[10.5px] tracking-wider text-muted-foreground uppercase">
                    Parent Oracle B (Base) *
                  </Label>
                  <button
                    type="button"
                    className="text-slate-300 hover:text-slate-100 transition-colors"
                    onMouseEnter={() => setShowTooltip('feedB')}
                    onMouseLeave={() => setShowTooltip(null)}
                  >
                    <Info className="h-3 w-3" />
                  </button>
                  {showTooltip === 'feedB' && (
                    <div className="absolute bottom-full mb-2 left-0 z-50 bg-zinc-950 border border-white/10 text-white font-mono text-[9.5px] rounded-lg p-2.5 shadow-xl max-w-xs pointer-events-none">
                      The second parent oracle contract address to compose.
                    </div>
                  )}
                </div>
                <CustomSelect
                  value={feedBAddress}
                  onChange={(address) => setFeedBAddress(address)}
                  options={baseOracles}
                  placeholder="Select Parent Oracle B"
                  error={errors.feedBAddress}
                />
                {errors.feedBAddress && <p className="text-red-400 text-xs">{errors.feedBAddress}</p>}
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 mb-2 relative">
                  <Label htmlFor="operation" className="font-mono text-[10.5px] tracking-wider text-muted-foreground uppercase">
                    Mathematical Operation *
                  </Label>
                  <button
                    type="button"
                    className="text-slate-300 hover:text-slate-100 transition-colors"
                    onMouseEnter={() => setShowTooltip('operation')}
                    onMouseLeave={() => setShowTooltip(null)}
                  >
                    <Info className="h-3 w-3" />
                  </button>
                  {showTooltip === 'operation' && (
                    <div className="absolute bottom-full mb-2 left-0 z-50 bg-zinc-950 border border-white/10 text-white font-mono text-[9.5px] rounded-lg p-2.5 shadow-xl max-w-xs pointer-events-none">
                      Multiplication (A × B) or Division (A / B) to apply to parent feeds.
                    </div>
                  )}
                </div>
                <CustomOperationSelect
                  value={composedOperation}
                  onChange={(op) => setComposedOperation(op)}
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 mb-2 relative">
                  <Label htmlFor="composedSampleSize" className="font-mono text-[10.5px] tracking-wider text-muted-foreground uppercase">
                    Default Lookback Sample Size *
                  </Label>
                  <button
                    type="button"
                    className="text-slate-300 hover:text-slate-100 transition-colors"
                    onMouseEnter={() => setShowTooltip('composedSampleSize')}
                    onMouseLeave={() => setShowTooltip(null)}
                  >
                    <Info className="h-3 w-3" />
                  </button>
                  {showTooltip === 'composedSampleSize' && (
                    <div className="absolute bottom-full mb-2 left-0 z-50 bg-zinc-950 border border-white/10 text-white font-mono text-[9.5px] rounded-lg p-2.5 shadow-xl max-w-xs pointer-events-none">
                      The default number of historical price samples used to evaluate readValueInterval.
                    </div>
                  )}
                </div>
                <Input
                  id="composedSampleSize"
                  type="number"
                  min={1}
                  step={1}
                  placeholder="100"
                  value={composedSampleSize}
                  onChange={(e) => setComposedSampleSize(e.target.value)}
                  required
                  className={`bg-white/5 border border-white/10 text-white rounded-xl placeholder:text-zinc-500 focus:border-primary/40 focus:ring-1 focus:ring-primary/40 transition-all duration-300 text-sm h-11 ${
                    errors.composedSampleSize ? 'border-red-500 focus:ring-red-500' : ''
                  }`}
                />
                {errors.composedSampleSize && <p className="text-red-400 text-xs">{errors.composedSampleSize}</p>}
              </div>

              <div className="space-y-1 col-span-2">
                <div className="flex items-center gap-2 relative">
                  <Label htmlFor="composedDescription" className="font-mono text-[10.5px] tracking-wider text-muted-foreground uppercase">
                    Description *
                  </Label>
                  <button
                    type="button"
                    className="text-slate-300 hover:text-slate-100 transition-colors"
                    onMouseEnter={() => setShowTooltip('composedDescription')}
                    onMouseLeave={() => setShowTooltip(null)}
                  >
                    <Info className="h-3 w-3" />
                  </button>
                  {showTooltip === 'composedDescription' && (
                    <div className="absolute bottom-full mb-2 left-0 z-50 bg-zinc-950 border border-white/10 text-white font-mono text-[9.5px] rounded-lg p-2.5 shadow-xl max-w-xs pointer-events-none">
                      Description for this composed oracle
                    </div>
                  )}
                </div>
                <Input
                  id="composedDescription"
                  placeholder="Composed Oracle Feed"
                  value={composedDescription}
                  onChange={(e) => setComposedDescription(e.target.value)}
                  className={`bg-zinc-950/50 border border-white/10 focus:border-primary/45 focus:ring-0 text-white rounded-xl h-11 px-4 font-mono text-xs placeholder:text-muted-foreground/60 w-full max-w-full ${errors.composedDescription ? 'border-red-500' : ''}`}
                  required
                />
                {errors.composedDescription && <p className="text-red-400 text-xs">{errors.composedDescription}</p>}
              </div>

              <div className="space-y-1 col-span-2 pt-2">
                <div className="flex items-center gap-3">
                  <input
                    id="invertResult"
                    type="checkbox"
                    checked={composedInvertResult}
                    onChange={(e) => setComposedInvertResult(e.target.checked)}
                     className="h-5 w-5 bg-white/5 border border-white/10 text-primary rounded focus:ring-primary/20 accent-primary cursor-pointer"
                  />
                  <Label htmlFor="invertResult" className="font-mono text-[10.5px] tracking-wider text-muted-foreground uppercase cursor-pointer select-none">
                    Invert Final Price Result (1 / price)
                  </Label>
                </div>
                <p className="text-xs text-slate-400 mt-1 pl-8">
                  Check this if the desired price feed represents the inverse price (e.g. converting asset/USD to USD/asset).
                </p>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="bg-zinc-950/70 border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md max-w-4xl mx-auto space-y-6">
              <div className="border-b border-white/5 pb-4">
                <h2 className="text-sm font-mono tracking-widest text-primary uppercase font-bold">
                  Oracle Metadata
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="space-y-1">
                <div className="flex items-center gap-2 relative">
                  <Label htmlFor="name" className="font-mono text-[10.5px] tracking-wider text-muted-foreground uppercase">
                    Name *
                  </Label>
                  <button
                    type="button"
                    className="text-slate-300 hover:text-slate-100 transition-colors"
                    onMouseEnter={() => setShowTooltip('name')}
                    onMouseLeave={() => setShowTooltip(null)}
                  >
                    <Info className="h-3 w-3" />
                  </button>
                  {showTooltip === 'name' && (
                    <div className="absolute bottom-full mb-2 left-0 z-50 bg-zinc-950 border border-white/10 text-white font-mono text-[9.5px] rounded-lg p-2.5 shadow-xl max-w-xs pointer-events-none">
                      Display name for your oracle
                    </div>
                  )}
                </div>
                <Input
                  id="name"
                  placeholder="ETH/USD Oracle"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`bg-zinc-950/50 border border-white/10 focus:border-primary/45 focus:ring-0 text-white rounded-xl h-11 px-4 font-mono text-xs placeholder:text-muted-foreground/60 w-full max-w-full ${errors.name ? 'border-red-500' : ''}`}
                  required
                />
                {errors.name && <p className="text-red-400 text-xs">{errors.name}</p>}
              </div>
              <div className="space-y-1 col-span-2">
                <div className="flex items-center gap-2 relative">
                  <Label htmlFor="description" className="font-mono text-[10.5px] tracking-wider text-muted-foreground uppercase">
                    Description *
                  </Label>
                  <button
                    type="button"
                    className="text-slate-300 hover:text-slate-100 transition-colors"
                    onMouseEnter={() => setShowTooltip('description')}
                    onMouseLeave={() => setShowTooltip(null)}
                  >
                    <Info className="h-3 w-3" />
                  </button>
                  {showTooltip === 'description' && (
                    <div className="absolute bottom-full mb-2 left-0 z-50 bg-zinc-950 border border-white/10 text-white font-mono text-[9.5px] rounded-lg p-2.5 shadow-xl max-w-xs pointer-events-none">
                      Detailed description of your oracle's purpose
                    </div>
                  )}
                </div>
                <Textarea
                  id="description"
                  placeholder="Describe your oracle's purpose and data source"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  className={`bg-zinc-950/50 border border-white/10 focus:border-primary/45 focus:ring-0 text-white rounded-xl h-11 px-4 font-mono text-xs placeholder:text-muted-foreground/60 w-full ${errors.description ? 'border-red-500' : ''}`}
                />
                {errors.description && <p className="text-red-400 text-xs">{errors.description}</p>}
              </div>
            </div>
          </div>

            <div className="bg-zinc-950/70 border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md max-w-4xl mx-auto mt-8 space-y-6">
              <div className="border-b border-white/5 pb-4">
                <h2 className="text-sm font-mono tracking-widest text-primary uppercase font-bold">
                  Oracle Configuration
                </h2>
              </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 mb-2 relative">
                    <Label htmlFor="weightToken" className="font-mono text-[10.5px] tracking-wider text-muted-foreground uppercase">
                      Oracle Operator Token (ERC20) *
                    </Label>
                    <button
                      type="button"
                      className="text-slate-300 hover:text-slate-100 transition-colors"
                      onMouseEnter={() => setShowTooltip('weightToken')}
                      onMouseLeave={() => setShowTooltip(null)}
                    >
                      <Info className="h-3 w-3" />
                    </button>
                    {showTooltip === 'weightToken' && (
                      <div className="absolute bottom-full mb-2 left-0 z-50 bg-zinc-950 border border-white/10 text-white font-mono text-[9.5px] rounded-lg p-2.5 shadow-xl max-w-xs pointer-events-none">
                        Enter the address of the ERC20 token that is, or will be, held by oracle operators. Or select it from a list of known tokens. The weight of values submitted by an oracle operator is proportional to the operator's token balance.
                      </div>
                    )}
                  </div>
                  <TokenSelector
                    value={weightToken}
                    onChange={(address) => setWeightToken(address)}
                    error={errors.weightToken}
                    placeholder="0x..."
                    label=""
                    required={true}
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 mb-2 relative">
                    <Label htmlFor="reward" className="font-mono text-[10.5px] tracking-wider text-muted-foreground uppercase">
                      Reward Percentage *
                    </Label>
                    <button
                      type="button"
                      className="text-slate-300 hover:text-slate-100 transition-colors"
                      onMouseEnter={() => setShowTooltip('reward')}
                      onMouseLeave={() => setShowTooltip(null)}
                    >
                      <Info className="h-3 w-3" />
                    </button>
                    {showTooltip === 'reward' && (
                      <div className="absolute bottom-full mb-2 left-0 z-50 bg-zinc-950 border border-white/10 text-white font-mono text-[9.5px] rounded-lg p-2.5 shadow-xl max-w-xs pointer-events-none">
                        Percentage of the oracle balance paid as reward per value submission (e.g., 1.25% = 1,250 / 100,000).
                      </div>
                    )}
                  </div>
                  <div className="relative">
                    <Input
                      id="reward"
                      type="number"
                      step="any"
                      min={0}
                      max={100}
                      placeholder="1.25"
                      value={rewardPercent}
                      onChange={(e) => setRewardPercent(e.target.value)}
                      required
                      className={`pr-8 bg-white/5 border border-white/10 text-white rounded-xl placeholder:text-zinc-500 focus:border-primary/40 focus:ring-1 focus:ring-primary/40 transition-all duration-300 text-sm h-11 ${errors.reward ? 'border-red-500 focus:ring-red-500' : ''}`}
                    />
                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 font-mono text-sm pointer-events-none select-none">
                      %
                    </span>
                  </div>
                  {errors.reward && <p className="text-red-400 text-xs">{errors.reward}</p>}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 mb-2 relative">
                    <Label htmlFor="halfLifeSeconds" className="font-mono text-[10.5px] tracking-wider text-muted-foreground uppercase">
                      Half Life *
                    </Label>
                    <button
                      type="button"
                      className="text-slate-300 hover:text-slate-100 transition-colors"
                      onMouseEnter={() => setShowTooltip('halfLifeSeconds')}
                      onMouseLeave={() => setShowTooltip(null)}
                    >
                      <Info className="h-3 w-3" />
                    </button>
                    {showTooltip === 'halfLifeSeconds' && (
                      <div className="absolute bottom-full mb-2 left-0 z-50 bg-zinc-950 border border-white/10 text-white font-mono text-[9.5px] rounded-lg p-2.5 shadow-xl max-w-xs pointer-events-none">
                        Controls time-decay in EWMA (Exponentially Weighted Moving Average)
                      </div>
                    )}
                  </div>
                  <div className="relative">
                    <Input
                      id="halfLifeSeconds"
                      type="number"
                      min={0}
                      placeholder="3600"
                      value={halfLifeSeconds}
                      onChange={(e) => setHalfLifeSeconds(e.target.value)}
                      required
                      className={`pr-20 bg-white/5 border border-white/10 text-white rounded-xl placeholder:text-zinc-500 focus:border-primary/40 focus:ring-1 focus:ring-primary/40 transition-all duration-300 text-sm h-11 ${errors.halfLifeSeconds ? 'border-red-500 focus:ring-red-500' : ''}`}
                    />
                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 font-mono text-xs pointer-events-none select-none">
                      seconds
                    </span>
                  </div>
                  {errors.halfLifeSeconds && <p className="text-red-400 text-xs">{errors.halfLifeSeconds}</p>}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 mb-2 relative">
                    <Label htmlFor="quorumBps" className="font-mono text-[10.5px] tracking-wider text-muted-foreground uppercase">
                      Quorum Percentage *
                    </Label>
                    <button
                      type="button"
                      className="text-slate-300 hover:text-slate-100 transition-colors"
                      onMouseEnter={() => setShowTooltip('quorumBps')}
                      onMouseLeave={() => setShowTooltip(null)}
                    >
                      <Info className="h-3 w-3" />
                    </button>
                    {showTooltip === 'quorumBps' && (
                      <div className="absolute bottom-full mb-2 left-0 z-50 bg-zinc-950 border border-white/10 text-white font-mono text-[9.5px] rounded-lg p-2.5 shadow-xl max-w-xs pointer-events-none">
                        Minimum percentage of staked token participation required for governance actions (e.g., 20% = 2,000 basis points).
                      </div>
                    )}
                  </div>
                  <div className="relative">
                    <Input
                      id="quorumBps"
                      type="number"
                      step="any"
                      min={0}
                      max={100}
                      placeholder="20"
                      value={quorumPercent}
                      onChange={(e) => setQuorumPercent(e.target.value)}
                      required
                      className={`pr-8 bg-white/5 border border-white/10 text-white rounded-xl placeholder:text-zinc-500 focus:border-primary/40 focus:ring-1 focus:ring-primary/40 transition-all duration-300 text-sm h-11 ${errors.quorumBps ? 'border-red-500 focus:ring-red-500' : ''}`}
                    />
                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 font-mono text-sm pointer-events-none select-none">
                      %
                    </span>
                  </div>
                  {errors.quorumBps && <p className="text-red-400 text-xs">{errors.quorumBps}</p>}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 mb-2 relative">
                    <Label htmlFor="depositLock" className="font-mono text-[10.5px] tracking-wider text-muted-foreground uppercase">
                      Deposit Lock Period *
                    </Label>
                    <button
                      type="button"
                      className="text-slate-300 hover:text-slate-100 transition-colors"
                      onMouseEnter={() => setShowTooltip('depositLock')}
                      onMouseLeave={() => setShowTooltip(null)}
                    >
                      <Info className="h-3 w-3" />
                    </button>
                    {showTooltip === 'depositLock' && (
                      <div className="absolute bottom-full mb-2 left-0 z-50 bg-zinc-950 border border-white/10 text-white font-mono text-[9.5px] rounded-lg p-2.5 shadow-xl max-w-xs pointer-events-none">
                        Time period deposits are locked before they can be withdrawn
                      </div>
                    )}
                  </div>
                  <div className="relative">
                    <Input
                      id="depositLock"
                      type="number"
                      min={0}
                      placeholder="3600"
                      value={depositLock}
                      onChange={(e) => setDepositLock(e.target.value)}
                      required
                      className={`pr-20 bg-white/5 border border-white/10 text-white rounded-xl placeholder:text-zinc-500 focus:border-primary/40 focus:ring-1 focus:ring-primary/40 transition-all duration-300 text-sm h-11 ${errors.depositLock ? 'border-red-500 focus:ring-red-500' : ''}`}
                    />
                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 font-mono text-xs pointer-events-none select-none">
                      seconds
                    </span>
                  </div>
                  {errors.depositLock && <p className="text-red-400 text-xs">{errors.depositLock}</p>}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 mb-2 relative">
                    <Label htmlFor="withdrawLock" className="font-mono text-[10.5px] tracking-wider text-muted-foreground uppercase">
                      Withdrawal Lock Period *
                    </Label>
                    <button
                      type="button"
                      className="text-slate-300 hover:text-slate-100 transition-colors"
                      onMouseEnter={() => setShowTooltip('withdrawLock')}
                      onMouseLeave={() => setShowTooltip(null)}
                    >
                      <Info className="h-3 w-3" />
                    </button>
                    {showTooltip === 'withdrawLock' && (
                      <div className="absolute bottom-full mb-2 left-0 z-50 bg-zinc-950 border border-white/10 text-white font-mono text-[9.5px] rounded-lg p-2.5 shadow-xl max-w-xs pointer-events-none">
                        Time period before withdrawal requests can be processed
                      </div>
                    )}
                  </div>
                  <div className="relative">
                    <Input
                      id="withdrawLock"
                      type="number"
                      min={0}
                      placeholder="3600"
                      value={withdrawLock}
                      onChange={(e) => setWithdrawLock(e.target.value)}
                      required
                      className={`pr-20 bg-white/5 border border-white/10 text-white rounded-xl placeholder:text-zinc-500 focus:border-primary/40 focus:ring-1 focus:ring-primary/40 transition-all duration-300 text-sm h-11 ${errors.withdrawLock ? 'border-red-500 focus:ring-red-500' : ''}`}
                    />
                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 font-mono text-xs pointer-events-none select-none">
                      seconds
                    </span>
                  </div>
                  {errors.withdrawLock && <p className="text-red-400 text-xs">{errors.withdrawLock}</p>}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 mb-2 relative">
                    <Label htmlFor="gamma" className="font-mono text-[10.5px] tracking-wider text-muted-foreground uppercase">
                      Gamma (Sampling Interval) *
                    </Label>
                    <button
                      type="button"
                      className="text-slate-300 hover:text-slate-100 transition-colors"
                      onMouseEnter={() => setShowTooltip('gamma')}
                      onMouseLeave={() => setShowTooltip(null)}
                    >
                      <Info className="h-3 w-3" />
                    </button>
                    {showTooltip === 'gamma' && (
                      <div className="absolute bottom-full mb-2 left-0 z-50 bg-zinc-950 border border-white/10 text-white font-mono text-[9.5px] rounded-lg p-2.5 shadow-xl max-w-xs pointer-events-none">
                        The sampling interval in seconds between historical snapshots used to compute min/max Value Ranges. Ensures the lookback window represents a genuine time spread.
                      </div>
                    )}
                  </div>
                  <Input
                    id="gamma"
                    type="number"
                    min={0}
                    placeholder="1"
                    value={gamma}
                    onChange={(e) => setGamma(e.target.value)}
                    required
                    className={`bg-white/5 border border-white/10 text-white rounded-xl placeholder:text-zinc-500 focus:border-primary/40 focus:ring-1 focus:ring-primary/40 transition-all duration-300 text-sm h-11 ${errors.gamma ? 'border-red-500 focus:ring-red-500' : ''}`}
                  />
                  {errors.gamma && <p className="text-red-400 text-xs">{errors.gamma}</p>}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 mb-2 relative">
                    <Label htmlFor="defaultSampleSize" className="font-mono text-[10.5px] tracking-wider text-muted-foreground uppercase">
                      Default Lookback Sample Size *
                    </Label>
                    <button
                      type="button"
                      className="text-slate-300 hover:text-slate-100 transition-colors"
                      onMouseEnter={() => setShowTooltip('defaultSampleSize')}
                      onMouseLeave={() => setShowTooltip(null)}
                    >
                      <Info className="h-3 w-3" />
                    </button>
                    {showTooltip === 'defaultSampleSize' && (
                      <div className="absolute bottom-full mb-2 left-0 z-50 bg-zinc-950 border border-white/10 text-white font-mono text-[9.5px] rounded-lg p-2.5 shadow-xl max-w-xs pointer-events-none">
                        The default number of historical price points used for min/max calculations
                      </div>
                    )}
                  </div>
                  <Input
                    id="defaultSampleSize"
                    type="number"
                    min={1}
                    step={1}
                    placeholder="100"
                    value={defaultSampleSize}
                    onChange={(e) => setDefaultSampleSize(e.target.value)}
                    required
                    className={`bg-white/5 border border-white/10 text-white rounded-xl placeholder:text-zinc-500 focus:border-primary/40 focus:ring-1 focus:ring-primary/40 transition-all duration-300 text-sm h-11 ${errors.defaultSampleSize ? 'border-red-500 focus:ring-red-500' : ''}`}
                  />
                  {errors.defaultSampleSize && <p className="text-red-400 text-xs">{errors.defaultSampleSize}</p>}
                </div>
              </div>
            </div>
          </>
        )}

        <div className="justify-center flex pt-8">
          <Button
            type="submit"
            disabled={loadingCreation || !account.address}
            className="h-12 sm:h-14 rounded-full pl-7 pr-3 bg-white text-black hover:bg-zinc-200 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] active:scale-[0.98] group flex items-center justify-between space-x-4 min-w-[260px] shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed border border-white/20"
          >
            <span className="font-mono text-xs sm:text-sm font-bold tracking-wider uppercase">
              {loadingCreation ? 'Creating Oracle...' : !account.address ? 'Connect Wallet' : 'Create Oracle'}
            </span>
            <span className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/10 flex items-center justify-center group-hover:translate-x-1 transition-transform duration-300 shrink-0">
              {loadingCreation ? (
                <Loader2 className="h-4 w-4 animate-spin text-black" />
              ) : (
                <ArrowRight className="h-4 w-4 stroke-[2] text-black" />
              )}
            </span>
          </Button>
        </div>
      </form>
    </div>
  )
}
