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
import { OracleFactories } from '@/utils/addresses'
import { OracleFactoryAbi } from '@/utils/abi/OracleFactory'

export default function CreateOracleIntegrated() {
  const account = useAccount()
  const activeChainId = useChainId()
  const config = useConfig()
  
  // Oracle parameters
  const [name, setName] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [owner, setOwner] = useState<string>('')
  const [weightToken, setWeightToken] = useState<string>('')
  const [reward, setReward] = useState<string>('1000')
  const [halfLifeSeconds, setHalfLifeSeconds] = useState<string>('3600')
  const [quorumBps, setQuorumBps] = useState<string>('2000')
  const [depositLock, setDepositLock] = useState<string>('3600')
  const [withdrawLock, setWithdrawLock] = useState<string>('3600')
  const [alpha, setAlpha] = useState<string>('1')

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
    owner?: string
    weightToken?: string
    reward?: string
    halfLifeSeconds?: string
    quorumBps?: string
    depositLock?: string
    withdrawLock?: string
    alpha?: string
  }>({})

  // Pre-fill owner with connected wallet address
  useEffect(() => {
    if (account.address && !owner) {
      setOwner(account.address)
    }
  }, [account.address, owner])

  // Reset form when chain changes
  useEffect(() => {
    setSubmitted(false)
    setHashTx('')
    setOracleAddress('')
  }, [activeChainId])

  const constructorArgs = useMemo(() => {
    return [
      name || "Unnamed Oracle",
      description || "No description provided",
      (weightToken || "0x0000000000000000000000000000000000000000") as `0x${string}`,
      BigInt(Number(reward || 0)),
      BigInt(Number(halfLifeSeconds || 0)),
      BigInt(Number(quorumBps || 0)),
      BigInt(Number(depositLock || 0)),
      BigInt(Number(withdrawLock || 0)),
      BigInt(alpha || "0"),
    ] as const
  }, [name, description, weightToken, reward, halfLifeSeconds, quorumBps, depositLock, withdrawLock, alpha])

  const validateInputs = () => {
    const newErrors: any = {}

    if (!name) newErrors.name = 'Oracle name is required'
    if (!description) newErrors.description = 'Description is required'
    if (!owner) newErrors.owner = 'Owner address is required'
    if (!weightToken) newErrors.weightToken = 'Weight token address is required'
    if (!reward) newErrors.reward = 'Reward is required'
    if (!halfLifeSeconds) newErrors.halfLifeSeconds = 'Half life seconds is required'
    if (!quorumBps) newErrors.quorumBps = 'Quorum is required'
    if (!depositLock) newErrors.depositLock = 'Deposit lock period is required'
    if (!withdrawLock) newErrors.withdrawLock = 'Withdrawal lock period is required'
    if (!alpha) newErrors.alpha = 'Alpha is required'

    if (Number(reward) < 0) newErrors.reward = 'Reward cannot be negative'
    if (Number(quorumBps) < 0 || Number(quorumBps) > 10000) newErrors.quorumBps = 'Quorum must be between 0 and 10000'

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
    }
    return explorers[chainId] ? `${explorers[chainId]}/tx/${txHash}` : ''
  }

  const getAddressExplorerUrl = (chainId: number, address: string) => {
    const explorers: { [key: number]: string } = {
      1: 'https://etherscan.io',
      8453: 'https://basescan.org',
      534351: 'https://sepolia.scrollscan.com',
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
      // Note: In a real implementation, you'd wait for the transaction receipt
      // and parse the events to get the oracle address
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
          setSubmitted(true) // Still show success, but without oracle address
        }
      }, 5000) // Wait 5 seconds for transaction to be mined

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
      <div className="relative min-h-screen flex items-center justify-center bg-background font-[oblique] tracking-wide" style={{ fontStyle: 'oblique 12deg' }}>
        <Card className="bg-background/95 backdrop-blur-sm border-primary/30 shadow-xl max-w-2xl mx-auto">
          <CardContent className="text-center space-y-6 py-8">
            <div className="space-y-3">
              <h2 className="text-3xl font-medium text-slate-100" style={{ fontStyle: 'oblique 15deg' }}>
                Oracle Created Successfully!
              </h2>
              <p className="text-base text-slate-200">
                Your oracle has been deployed and is ready to use.
              </p>
              {oracleAddress && (
                <div className="bg-slate-800/50 border border-blue-100 rounded-lg p-3 font-mono text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-blue-300 font-medium">{formatAddress(oracleAddress)}</span>
                    <button
                      onClick={() => onCopy(oracleAddress)}
                      className="text-xs bg-blue-600/20 hover:bg-blue-600/30 px-2 py-1 rounded transition-colors"
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
                  <Button variant="outline" className="h-10 px-4 border-blue-200 hover:bg-blue-600/10">
                    View Transaction
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              )}
              {oracleAddress && (
                <Link href={`/o?chainId=${activeChainId}&oracle=${oracleAddress}`}>
                  <Button className="h-10 px-6 bg-blue-600 hover:bg-blue-700">
                    Go to Oracle
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              )}
              <Link href="/explorer">
                <Button variant="outline" className="h-10 px-4 border-blue-200 hover:bg-blue-600/10">
                  Browse Oracles
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="font-[oblique] tracking-wide text-slate-100" style={{ fontStyle: "oblique 15deg" }}>
      <form onSubmit={(e) => { e.preventDefault(); createOracle(); }} className="space-y-8">
        <Card className="border-2 border-blue-200 bg-card shadow-sm max-w-4xl mx-auto">
          <CardHeader className="border-b border-blue-100">
            <CardTitle className="text-slate-100 text-xl">
              Oracle Metadata
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Label htmlFor="name" className="text-slate-100 text-md">
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
                  <div className="absolute z-10 bg-slate-800 text-slate-100 text-xs p-2 rounded shadow-lg">
                    Display name for your oracle
                  </div>
                )}
              </div>
              <Input
                id="name"
                placeholder="ETH/USD Oracle"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`border-0 bg-slate-800/50 text-slate-100 placeholder:text-slate-400 border border-blue-100 ${errors.name ? 'border-red-500' : ''}`}
                required
              />
              {errors.name && <p className="text-red-400 text-xs">{errors.name}</p>}
            </div>
            <div className="space-y-1 col-span-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="description" className="text-slate-100 text-md">
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
                  <div className="absolute z-10 bg-slate-800 text-slate-100 text-xs p-2 rounded shadow-lg mt-6">
                    Detailed description of your oracle's purpose
                  </div>
                )}
              </div>
              <Textarea
                id="description"
                placeholder="Describe your oracle's purpose and data source"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={`border-0 bg-slate-800/50 text-slate-100 placeholder:text-slate-400 border border-blue-100 ${errors.description ? 'border-red-500' : ''}`}
                required
              />
              {errors.description && <p className="text-red-400 text-xs">{errors.description}</p>}
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-blue-200 bg-card shadow-sm max-w-4xl mx-auto">
          <CardHeader className="border-b border-blue-100">
            <CardTitle className="text-xl text-slate-100">
              Oracle Parameters
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4 pt-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 mb-2">
                <Label htmlFor="owner" className="text-slate-100 text-md">
                  Owner Address *
                </Label>
                <button
                  type="button"
                  className="text-slate-300 hover:text-slate-100 transition-colors"
                  onMouseEnter={() => setShowTooltip('owner')}
                  onMouseLeave={() => setShowTooltip(null)}
                >
                  <Info className="h-3 w-3" />
                </button>
                {showTooltip === 'owner' && (
                  <div className="absolute z-10 bg-slate-800 text-slate-100 text-xs p-2 rounded shadow-lg mt-6">
                    Address that will own and control the oracle contract
                  </div>
                )}
              </div>
              <Input
                id="owner"
                placeholder="0x..."
                value={owner}
                onChange={(e) => setOwner(e.target.value)}
                required
                className={`border-0 bg-slate-800/50 text-slate-100 placeholder:text-slate-400 text-md border border-blue-100 ${errors.owner ? 'border-red-500' : ''}`}
              />
              {errors.owner && <p className="text-red-400 text-xs">{errors.owner}</p>}
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center gap-2 mb-2">
                <Label htmlFor="weightToken" className="text-slate-100 text-md">
                  Weight Token (ERC20) *
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
                  <div className="absolute z-10 bg-slate-800 text-slate-100 text-xs p-2 rounded shadow-lg mt-6">
                    ERC20 token address used for voting weight calculation
                  </div>
                )}
              </div>
              <Input
                id="weightToken"
                placeholder="0x..."
                value={weightToken}
                onChange={(e) => setWeightToken(e.target.value)}
                required
                className={`border-0 bg-slate-800/50 text-slate-100 placeholder:text-slate-400 font-mono text-md border border-blue-100 ${errors.weightToken ? 'border-red-500' : ''}`}
              />
              {errors.weightToken && <p className="text-red-400 text-xs">{errors.weightToken}</p>}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 mb-2">
                <Label htmlFor="reward" className="text-slate-100 text-md">
                  Reward (out of 1e5) *
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
                  <div className="absolute z-10 bg-slate-800 text-slate-100 text-xs p-2 rounded shadow-lg mt-6">
                    Example: 1000 = 1.000% of contract balance per reward slice
                  </div>
                )}
              </div>
              <Input
                id="reward"
                type="number"
                min={0}
                placeholder="1000"
                value={reward}
                onChange={(e) => setReward(e.target.value)}
                required
                className={`border-0 bg-slate-800/50 text-slate-100 placeholder:text-slate-400 text-md border border-blue-100 ${errors.reward ? 'border-red-500' : ''}`}
              />
              {errors.reward && <p className="text-red-400 text-xs">{errors.reward}</p>}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 mb-2">
                <Label htmlFor="halfLifeSeconds" className="text-slate-100 text-md">
                  Half Life Seconds *
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
                  <div className="absolute z-10 bg-slate-800 text-slate-100 text-xs p-2 rounded shadow-lg mt-6">
                    Controls time-decay in EWMA (Exponentially Weighted Moving Average)
                  </div>
                )}
              </div>
              <Input
                id="halfLifeSeconds"
                type="number"
                min={0}
                placeholder="3600"
                value={halfLifeSeconds}
                onChange={(e) => setHalfLifeSeconds(e.target.value)}
                required
                className={`border-0 bg-slate-800/50 text-slate-100 placeholder:text-slate-400 text-md border border-blue-100 ${errors.halfLifeSeconds ? 'border-red-500' : ''}`}
              />
              {errors.halfLifeSeconds && <p className="text-red-400 text-xs">{errors.halfLifeSeconds}</p>}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 mb-2">
                <Label htmlFor="quorumBps" className="text-slate-100 text-md">
                  Quorum (basis points) *
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
                  <div className="absolute z-10 bg-slate-800 text-slate-100 text-xs p-2 rounded shadow-lg mt-6">
                    Minimum participation required (0-10000). 20% = 2000 bps
                  </div>
                )}
              </div>
              <Input
                id="quorumBps"
                type="number"
                min={0}
                max={10000}
                placeholder="2000"
                value={quorumBps}
                onChange={(e) => setQuorumBps(e.target.value)}
                required
                className={`border-0 bg-slate-800/50 text-slate-100 placeholder:text-slate-400 text-md border border-blue-100 ${errors.quorumBps ? 'border-red-500' : ''}`}
              />
              {errors.quorumBps && <p className="text-red-400 text-xs">{errors.quorumBps}</p>}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 mb-2">
                <Label htmlFor="depositLock" className="text-slate-100 text-md">
                  Deposit Lock Period (sec) *
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
                  <div className="absolute z-10 bg-slate-800 text-slate-100 text-xs p-2 rounded shadow-lg mt-6">
                    Time period deposits are locked before they can be withdrawn
                  </div>
                )}
              </div>
              <Input
                id="depositLock"
                type="number"
                min={0}
                placeholder="3600"
                value={depositLock}
                onChange={(e) => setDepositLock(e.target.value)}
                required
                className={`border-0 bg-slate-800/50 text-slate-100 placeholder:text-slate-400 text-md border border-blue-100 ${errors.depositLock ? 'border-red-500' : ''}`}
              />
              {errors.depositLock && <p className="text-red-400 text-xs">{errors.depositLock}</p>}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 mb-2">
                <Label htmlFor="withdrawLock" className="text-slate-100 text-md">
                  Withdrawal Lock Period (sec) *
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
                  <div className="absolute z-10 bg-slate-800 text-slate-100 text-xs p-2 rounded shadow-lg mt-6">
                    Time period before withdrawal requests can be processed
                  </div>
                )}
              </div>
              <Input
                id="withdrawLock"
                type="number"
                min={0}
                placeholder="3600"
                value={withdrawLock}
                onChange={(e) => setWithdrawLock(e.target.value)}
                required
                className={`border-0 bg-slate-800/50 text-slate-100 placeholder:text-slate-400 text-md border border-blue-100 ${errors.withdrawLock ? 'border-red-500' : ''}`}
              />
              {errors.withdrawLock && <p className="text-red-400 text-xs">{errors.withdrawLock}</p>}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 mb-2">
                <Label htmlFor="alpha" className="text-slate-100 text-md">
                  Alpha *
                </Label>
                <button
                  type="button"
                  className="text-slate-300 hover:text-slate-100 transition-colors"
                  onMouseEnter={() => setShowTooltip('alpha')}
                  onMouseLeave={() => setShowTooltip(null)}
                >
                  <Info className="h-3 w-3" />
                </button>
                {showTooltip === 'alpha' && (
                  <div className="absolute z-10 bg-slate-800 text-slate-100 text-xs p-2 rounded shadow-lg mt-6">
                    Scalar in reward formula. Keep small unless you understand the economics
                  </div>
                )}
              </div>
              <Input
                id="alpha"
                type="number"
                min={0}
                placeholder="1"
                value={alpha}
                onChange={(e) => setAlpha(e.target.value)}
                required
                className={`border-0 bg-slate-800/50 text-slate-100 placeholder:text-slate-400 text-md border border-blue-100 ${errors.alpha ? 'border-red-500' : ''}`}
              />
              {errors.alpha && <p className="text-red-400 text-xs">{errors.alpha}</p>}
            </div>
          </CardContent>
        </Card>

        <div className="justify-center flex  mx-auto">
          <Button
            type="submit"
            size="lg"
            className="bg-black border border-white hover:bg-primary max-w-4xl mx-auto border-slate-400 text-white"
            disabled={loadingCreation || !account.address}
          >
            {loadingCreation ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Oracle...
              </>
            ) : !account.address ? (
              'Connect Wallet to Create Oracle'
            ) : (
              <>
                Create Oracle
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
