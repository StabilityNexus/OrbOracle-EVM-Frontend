"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useCallback, useEffect, useMemo, useState } from "react"
import { Navigation } from "@/components/navigation"
import { PriceChart, type PriceChartPoint } from "@/components/price-chart"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useOracle } from "@/hooks/useOracles"
import { useToast } from "@/hooks/use-toast"
import { OracleAbi } from "@/utils/abi/Oracle"
import {
  ArrowLeft,
  Clock,
  TrendingUp,
  Copy,
  Loader2,
  Send,
  Wallet,
  Vote,
  Settings,
  Shield,
  History,
  Database,
  CheckCircle,
} from "lucide-react"
import { useAccount, useWriteContract, useReadContract, useWaitForTransactionReceipt } from "wagmi"
import { parseUnits, formatUnits, erc20Abi } from "viem"

function isHexAddress(value: string | null): value is `0x${string}` {
  return !!value && /^0x[a-fA-F0-9]{40}$/.test(value)
}

type PriceHistoryResult = readonly [readonly bigint[], readonly bigint[], readonly bigint[]]

const PRICE_DECIMALS = 18
const DISPLAY_PRECISION = 6
const MAX_PRICE_POINTS = 20

const formatPriceFromWei = (value: bigint) => {
  const numeric = Number.parseFloat(formatUnits(value, PRICE_DECIMALS))
  if (Number.isNaN(numeric)) {
    return "—"
  }
  return numeric.toFixed(DISPLAY_PRECISION)
}

export default function OracleInteractionPage() {
  const search = useSearchParams()
  const oracleParam = search.get("oracle")
  const chainIdParam = search.get("chainId")
  const { toast } = useToast()
  const { address: userAddress, isConnected } = useAccount()

  // Form states
  const [submitValue, setSubmitValue] = useState("")
  const [depositAmount, setDepositAmount] = useState("")
  const [withdrawAmount, setWithdrawAmount] = useState("")
  const [voteTarget, setVoteTarget] = useState("")
  
  // Contract interaction states
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDepositing, setIsDepositing] = useState(false)
  const [isWithdrawing, setIsWithdrawing] = useState(false)
  const [isVoting, setIsVoting] = useState(false)
  const [isApproving, setIsApproving] = useState(false)
  const [isUpdatingVoteWeights, setIsUpdatingVoteWeights] = useState(false)
  const [isReadingValue, setIsReadingValue] = useState(false)
  const [isReadingLatestValue, setIsReadingLatestValue] = useState(false)

  // Real-time oracle data
  const [latestValue, setLatestValue] = useState<string>("—")
  const [aggregatedValue, setAggregatedValue] = useState<string>("—")
  const [lastUpdated, setLastUpdated] = useState<string>("Loading...")
  const [userDepositedTokens, setUserDepositedTokens] = useState<string>("0")
  const [userTokenBalance, setUserTokenBalance] = useState<string>("0")
  const [tokenAllowance, setTokenAllowance] = useState<string>("0")

  const [priceHistoryPoints, setPriceHistoryPoints] = useState<PriceChartPoint[]>([])
  const [pendingRead, setPendingRead] = useState<"aggregated" | "latest" | null>(null)

  // Oracle configuration display values
  const [rewardRate, setRewardRate] = useState<string>("Loading...")
  const [halfLifeSeconds, setHalfLifeSeconds] = useState<string>("Loading...")
  const [quorumPercentage, setQuorumPercentage] = useState<string>("Loading...")
  const [operationLockPeriod, setOperationLockPeriod] = useState<string>("Loading...")
  const [withdrawalLockPeriod, setWithdrawalLockPeriod] = useState<string>("Loading...")
  const [alphaValue, setAlphaValue] = useState<string>("Loading...")

  // Timestamp display values
  const [depositTimestamp, setDepositTimestamp] = useState<string>("Never")
  const [lastOperationTimestamp, setLastOperationTimestamp] = useState<string>("Never")

  const buildPriceHistoryPoints = useCallback((data?: PriceHistoryResult) => {
    if (!data) {
      return [] as PriceChartPoint[]
    }

    const [timestamps, aggregatedPrices, latestValues] = data
    return timestamps
      .map((timestamp, index) => {
        const aggregatedRaw = aggregatedPrices[index] ?? BigInt(0)
        const latestRaw = latestValues[index] ?? BigInt(0)

        return {
          timestamp: Number(timestamp),
          aggregated: Number(formatUnits(aggregatedRaw, PRICE_DECIMALS)) || 0,
          latest: Number(formatUnits(latestRaw, PRICE_DECIMALS)) || 0,
        }
      })
      .sort((a, b) => a.timestamp - b.timestamp)
      .slice(-MAX_PRICE_POINTS)
  }, [])

  const updatePriceDisplays = useCallback((data?: PriceHistoryResult) => {
    if (!data) {
      setAggregatedValue("—")
      setLatestValue("—")
      setPriceHistoryPoints([])
      return
    }

    const points = buildPriceHistoryPoints(data)
    setPriceHistoryPoints(points)

    if (points.length > 0) {
      const latestPoint = points[points.length - 1]
      setAggregatedValue(latestPoint.aggregated.toFixed(DISPLAY_PRECISION))
      setLatestValue(latestPoint.latest.toFixed(DISPLAY_PRECISION))
      setLastUpdated("Just now")
    }
  }, [buildPriceHistoryPoints])

  const oracleAddress = isHexAddress(oracleParam) ? (oracleParam as `0x${string}`) : null
  const chainId = chainIdParam ? Number(chainIdParam) : undefined
  const chainIdValid = chainId !== undefined && Number.isFinite(chainId) && chainId > 0

  // Contract write hook
  const { writeContract, writeContractAsync, data: hash, error: contractError, isPending } = useWriteContract()
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  })

  // Read contract data
  const { data: weightTokenAddress } = useReadContract({
    address: oracleAddress || undefined,
    abi: OracleAbi,
    functionName: 'WEIGHT_TOKEN',
    query: { enabled: !!oracleAddress }
  })

  const { data: weightTokenSymbolData } = useReadContract({
    address: (weightTokenAddress as `0x${string}`) || undefined,
    abi: erc20Abi,
    functionName: 'symbol',
    query: { enabled: !!weightTokenAddress }
  })

  const { data: weightTokenDecimalsData } = useReadContract({
    address: (weightTokenAddress as `0x${string}`) || undefined,
    abi: erc20Abi,
    functionName: 'decimals',
    query: { enabled: !!weightTokenAddress }
  })

  // Read user's locked tokens (for governance operations)
  const { data: lockedTokensData } = useReadContract({
    address: oracleAddress || undefined,
    abi: OracleAbi,
    functionName: 'lockedTokens',
    args: userAddress ? [userAddress] : undefined,
    query: { enabled: !!oracleAddress && !!userAddress }
  })

  // Read user's unlocked tokens (available for withdrawal)
  const { data: unlockedTokensData } = useReadContract({
    address: oracleAddress || undefined,
    abi: OracleAbi,
    functionName: 'unlockedTokens',
    args: userAddress ? [userAddress] : undefined,
    query: { enabled: !!oracleAddress && !!userAddress }
  })

  // Read user's deposit timestamp
  const { data: depositTimestampData } = useReadContract({
    address: oracleAddress || undefined,
    abi: OracleAbi,
    functionName: 'depositTimestamp',
    args: userAddress ? [userAddress] : undefined,
    query: { enabled: !!oracleAddress && !!userAddress }
  })

  // Read user's last operation timestamp
  const { data: lastOperationTimestampData } = useReadContract({
    address: oracleAddress || undefined,
    abi: OracleAbi,
    functionName: 'lastOperationTimestamp',
    args: userAddress ? [userAddress] : undefined,
    query: { enabled: !!oracleAddress && !!userAddress }
  })

  const { data: lastSubmissionTimeData } = useReadContract({
    address: oracleAddress || undefined,
    abi: OracleAbi,
    functionName: 'lastSubmissionTime',
    query: { enabled: !!oracleAddress }
  })

  // Read oracle configuration parameters
  const { data: rewardData } = useReadContract({
    address: oracleAddress || undefined,
    abi: OracleAbi,
    functionName: 'REWARD',
    query: { enabled: !!oracleAddress }
  })

  const { data: halfLifeSecondsData } = useReadContract({
    address: oracleAddress || undefined,
    abi: OracleAbi,
    functionName: 'HALF_LIFE_SECONDS',
    query: { enabled: !!oracleAddress }
  })

  const { data: quorumData } = useReadContract({
    address: oracleAddress || undefined,
    abi: OracleAbi,
    functionName: 'QUORUM',
    query: { enabled: !!oracleAddress }
  })

  const { data: operationLockingPeriodData } = useReadContract({
    address: oracleAddress || undefined,
    abi: OracleAbi,
    functionName: 'OPERATION_LOCKING_PERIOD',
    query: { enabled: !!oracleAddress }
  })

  const { data: withdrawalLockingPeriodData } = useReadContract({
    address: oracleAddress || undefined,
    abi: OracleAbi,
    functionName: 'WITHDRAWAL_LOCKING_PERIOD',
    query: { enabled: !!oracleAddress }
  })

  const { data: alphaData } = useReadContract({
    address: oracleAddress || undefined,
    abi: OracleAbi,
    functionName: 'ALPHA',
    query: { enabled: !!oracleAddress }
  })

  // Read current oracle values for display (using view functions or public variables)
  // Note: Since readValue/readLatestValue are not view functions, we need to find the storage variables
  // Let's try to read from events or use a different approach

  // Read the latest price history to get current values
  const { data: priceHistoryLengthData } = useReadContract({
    address: oracleAddress || undefined,
    abi: OracleAbi,
    functionName: 'getPriceHistoryLength',
    query: { enabled: !!oracleAddress }
  })

  const priceHistoryRangeArgs = useMemo(() => {
    if (!priceHistoryLengthData) {
      return undefined
    }

    const length = priceHistoryLengthData as bigint
    const zero = BigInt(0)
    if (length === zero) {
      return undefined
    }

    const end = length
    const maxPoints = BigInt(MAX_PRICE_POINTS)
    const start = length > maxPoints ? length - maxPoints : zero
    return [start, end] as const
  }, [priceHistoryLengthData])

  // Read the latest price entry if history exists
  const { data: latestPriceHistoryData, refetch: refetchPriceHistory, isFetching: isFetchingPriceHistory } = useReadContract({
    address: oracleAddress || undefined,
    abi: OracleAbi,
    functionName: 'getPriceHistoryRange',
    args: priceHistoryRangeArgs,
    query: { 
      enabled: !!oracleAddress && !!priceHistoryRangeArgs
    }
  })

  useEffect(() => {
    if (!latestPriceHistoryData) {
      setPriceHistoryPoints([])
      return
    }

    const history = buildPriceHistoryPoints(latestPriceHistoryData as PriceHistoryResult)
    setPriceHistoryPoints(history)
  }, [latestPriceHistoryData, buildPriceHistoryPoints])

  // Token balance and allowance
  const { data: userTokenBalanceData } = useReadContract({
    address: weightTokenAddress as `0x${string}` | undefined,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: userAddress ? [userAddress] : undefined,
    query: { enabled: !!weightTokenAddress && !!userAddress }
  })

  const { data: tokenAllowanceData } = useReadContract({
    address: weightTokenAddress as `0x${string}` | undefined,
    abi: erc20Abi,
    functionName: 'allowance',
    args: userAddress && oracleAddress ? [userAddress, oracleAddress] : undefined,
    query: { enabled: !!weightTokenAddress && !!userAddress && !!oracleAddress }
  })

  const weightTokenSymbol = useMemo(() => (weightTokenSymbolData ? String(weightTokenSymbolData) : "WEIGHT"), [weightTokenSymbolData])
  const weightTokenDecimals = useMemo(() => {
    if (weightTokenDecimalsData === undefined || weightTokenDecimalsData === null) {
      return 18
    }
    const value = Number(weightTokenDecimalsData)
    return Number.isFinite(value) ? value : 18
  }, [weightTokenDecimalsData])
  const weightTokenAddressString = useMemo(() => (weightTokenAddress ? String(weightTokenAddress) : "—"), [weightTokenAddress])
  const canCopyWeightTokenAddress = useMemo(
    () => weightTokenAddressString.startsWith("0x") && weightTokenAddressString.length === 42,
    [weightTokenAddressString]
  )
  const formatTokenAmount = useCallback(
    (value?: bigint | null, fractionDigits = 2) => {
      try {
        const normalized = formatUnits(value ?? BigInt(0), weightTokenDecimals)
        const numeric = Number.parseFloat(normalized)
        if (!Number.isFinite(numeric)) {
          return "0.00"
        }
        return numeric.toFixed(fractionDigits)
      } catch {
        return "0.00"
      }
    },
    [weightTokenDecimals]
  )
  const walletTokenBalanceDisplay = useMemo(
    () => {
      const numeric = Number.parseFloat(userTokenBalance || "0")
      return Number.isFinite(numeric) ? numeric.toFixed(2) : "0.00"
    },
    [userTokenBalance]
  )

  // Update real-time data when contract data changes
  useEffect(() => {
    // Calculate total deposited tokens (sum of locked and unlocked tokens)
    if (lockedTokensData !== undefined || unlockedTokensData !== undefined) {
      const locked = lockedTokensData ? BigInt(lockedTokensData as bigint) : BigInt(0)
      const unlocked = unlockedTokensData ? BigInt(unlockedTokensData as bigint) : BigInt(0)
      const total = locked + unlocked
      setUserDepositedTokens(formatTokenAmount(total, 4))
    }
    if (userTokenBalanceData !== undefined) {
      setUserTokenBalance(formatTokenAmount(userTokenBalanceData as bigint, 4))
    }
    if (tokenAllowanceData !== undefined) {
      setTokenAllowance(formatTokenAmount(tokenAllowanceData as bigint, 4))
    }
    if (lastSubmissionTimeData) {
      const timestamp = Number(lastSubmissionTimeData as bigint)
      const now = Math.floor(Date.now() / 1000)
      const diff = now - timestamp
      if (diff < 60) {
        setLastUpdated(`${diff}s ago`)
      } else if (diff < 3600) {
        setLastUpdated(`${Math.floor(diff / 60)}m ago`)
      } else {
        setLastUpdated(`${Math.floor(diff / 3600)}h ago`)
      }
    }

    // Update oracle configuration values
    if (rewardData) {
      const reward = Number(rewardData as bigint)
      setRewardRate(`${(reward / 1000).toFixed(3)}%`) // Convert from basis points to percentage 
    }
    if (halfLifeSecondsData) {
      const halfLife = Number(halfLifeSecondsData as bigint)
      setHalfLifeSeconds(`${halfLife}s`)
    }
    if (quorumData) {
      const quorum = Number(quorumData as bigint)
      setQuorumPercentage(`${(quorum / 100).toFixed(1)}%`) // Convert from basis points to percentage
    }
    if (operationLockingPeriodData) {
      const operationLock = Number(operationLockingPeriodData as bigint)
      setOperationLockPeriod(`${operationLock}s`)
    }
    if (withdrawalLockingPeriodData) {
      const withdrawalLock = Number(withdrawalLockingPeriodData as bigint)
      setWithdrawalLockPeriod(`${withdrawalLock}s`)
    }
    if (alphaData) {
      const alpha = Number(alphaData as bigint)
      setAlphaValue(alpha.toString())
    }

    // Update timestamp values
    if (depositTimestampData) {
      const timestamp = Number(depositTimestampData as bigint)
      if (timestamp === 0) {
        setDepositTimestamp("Never")
      } else {
        const date = new Date(timestamp * 1000)
        setDepositTimestamp(date.toLocaleString())
      }
    }
    if (lastOperationTimestampData) {
      const timestamp = Number(lastOperationTimestampData as bigint)
      if (timestamp === 0) {
        setLastOperationTimestamp("Never")
      } else {
        const date = new Date(timestamp * 1000)
        setLastOperationTimestamp(date.toLocaleString())
      }
    }

  }, [lockedTokensData, unlockedTokensData, userTokenBalanceData, tokenAllowanceData, formatTokenAmount, weightTokenDecimals, lastSubmissionTimeData, rewardData, halfLifeSecondsData, quorumData, operationLockingPeriodData, withdrawalLockingPeriodData, alphaData, depositTimestampData, lastOperationTimestampData])

  // Early validation before calling the hook
  if (!oracleAddress || !chainIdValid) {
    return (
      <div className="min-h-screen bg-background font-[oblique] tracking-wide" style={{ fontStyle: 'oblique 12deg' }}>
        <Navigation />
        <div className="container mx-auto px-6 pt-24 pb-12">
          <div className="text-center py-20">
            <div className="text-red-400 mb-6">
              <TrendingUp className="h-16 w-16 mx-auto mb-4 opacity-50" />
            </div>
            <p className="text-xl text-red-400 mb-2 font-medium">Missing or invalid query params</p>
            <p className="text-sm text-muted-foreground mb-8">
              Expected <code className="bg-card/50 border border-primary/30 px-2 py-1 rounded text-primary">oracle</code> (0x…40 chars) and <code className="bg-card/50 border border-primary/30 px-2 py-1 rounded text-primary">chainId</code> (number) in the URL.
            </p>
            <div className="text-sm text-muted-foreground mb-8">
              Example:&nbsp;
              <code className="bg-card/50 border border-primary/30 px-3 py-2 rounded-lg text-xs text-primary">
                /o?chainId=534351&oracle=0xfd8EA784cac0D42040579a7ced6080Fe45e9Cc7d
              </code>
            </div>
            <Link href="/explorer" className="text-primary hover:text-primary/80 font-medium hover:underline transition-colors">
              Back to Explorer
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const { oracle, loading: oracleLoading, error: oracleError } = useOracle(oracleAddress, chainId)

  // Handle transaction success
  useEffect(() => {
    if (!isConfirmed) {
      return
    }

    toast({
      title: "Transaction Confirmed",
      description: "Your transaction has been successfully processed!",
    })

    const refreshValues = async () => {
      try {
        const result = await refetchPriceHistory()
        if (pendingRead && result?.data) {
          const data = result.data as PriceHistoryResult
          updatePriceDisplays(data)

          const points = buildPriceHistoryPoints(data)
          if (points.length > 0) {
            const latestPoint = points[points.length - 1]
            if (pendingRead === "aggregated") {
              toast({
                title: "Aggregated Value",
                description: `Current aggregated value: ${latestPoint.aggregated.toFixed(DISPLAY_PRECISION)}`,
              })
            }
            if (pendingRead === "latest") {
              toast({
                title: "Latest Submission",
                description: `Latest submitted value: ${latestPoint.latest.toFixed(DISPLAY_PRECISION)}`,
              })
            }
          }
        }
      } catch (err) {
        console.error('Error updating price data after confirmation:', err)
      } finally {
        setPendingRead(null)
      }
    }

    refreshValues()

    // Reset loading states
    setIsSubmitting(false)
    setIsDepositing(false)
    setIsWithdrawing(false)
    setIsVoting(false)
    setIsApproving(false)
    setIsUpdatingVoteWeights(false)
    setIsReadingValue(false)
    setIsReadingLatestValue(false)
    // Clear form inputs
    setSubmitValue("")
    setDepositAmount("")
    setWithdrawAmount("")
    setVoteTarget("")
  }, [isConfirmed, pendingRead, refetchPriceHistory, updatePriceDisplays, buildPriceHistoryPoints, toast])

  // Handle transaction errors
  useEffect(() => {
    if (contractError) {
      toast({
        title: "Transaction Failed",
        description: contractError.message || "An error occurred during the transaction.",
        variant: "destructive",
      })
      setIsSubmitting(false)
      setIsDepositing(false)
      setIsWithdrawing(false)
      setIsVoting(false)
      setIsApproving(false)
      setIsUpdatingVoteWeights(false)
      setIsReadingValue(false)
      setIsReadingLatestValue(false)
    }
  }, [contractError, toast])

  const handleSubmitValue = async () => {
    if (!isConnected || !userAddress) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to submit values.",
        variant: "destructive",
      })
      return
    }

    if (!submitValue || isNaN(parseFloat(submitValue))) {
      toast({
        title: "Invalid Value",
        description: "Please enter a valid numeric value.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsSubmitting(true)
      // Convert to int256 - the value should be a scaled integer
      // For example, if submitting 2500, multiply by 1e18 to get proper precision
      const valueAsFloat = parseFloat(submitValue)
      const valueAsInt = BigInt(Math.floor(valueAsFloat * 1e18))
      
      console.log('Submitting value:', {
        original: submitValue,
        asFloat: valueAsFloat,
        asInt: valueAsInt.toString(),
        oracleAddress: oracleAddress,
        userAddress: userAddress
      })
      
      writeContract({
        address: oracleAddress!,
        abi: OracleAbi,
        functionName: 'submitValue',
        args: [valueAsInt],
      })

      toast({
        title: "Transaction Submitted",
        description: "Your price submission is being processed...",
      })
    } catch (err: any) {
      console.error('Error submitting value:', err)
      setIsSubmitting(false)
      toast({
        title: "Submission Failed",
        description: err?.message || "Failed to submit value. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleApproveTokens = async () => {
    if (!isConnected || !userAddress || !weightTokenAddress) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to approve tokens.",
        variant: "destructive",
      })
      return
    }

    if (!depositAmount || isNaN(parseFloat(depositAmount)) || parseFloat(depositAmount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount to approve.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsApproving(true)
      const amount = parseUnits(depositAmount, weightTokenDecimals)
      
      writeContract({
        address: weightTokenAddress as `0x${string}`,
        abi: erc20Abi,
        functionName: 'approve',
        args: [oracleAddress!, amount],
      })

      toast({
        title: "Approval Submitted",
        description: "Your token approval is being processed...",
      })
    } catch (err) {
      console.error('Error approving tokens:', err)
      setIsApproving(false)
      toast({
        title: "Approval Failed",
        description: "Failed to approve tokens. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDepositTokens = async () => {
    if (!isConnected || !userAddress) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to deposit tokens.",
        variant: "destructive",
      })
      return
    }

    if (!depositAmount || isNaN(parseFloat(depositAmount)) || parseFloat(depositAmount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount to deposit.",
        variant: "destructive",
      })
      return
    }

    const amount = parseUnits(depositAmount, weightTokenDecimals)
    const allowance = tokenAllowanceData ? BigInt(tokenAllowanceData as bigint) : BigInt(0)
    
    if (allowance < amount) {
      toast({
        title: "Insufficient Allowance",
        description: "Please approve tokens first before depositing.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsDepositing(true)
      
      writeContract({
        address: oracleAddress!,
        abi: OracleAbi,
        functionName: 'depositTokens',
        args: [amount],
      })

      toast({
        title: "Transaction Submitted",
        description: "Your token deposit is being processed...",
      })
    } catch (err) {
      console.error('Error depositing tokens:', err)
      setIsDepositing(false)
      toast({
        title: "Deposit Failed",
        description: "Failed to deposit tokens. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleWithdrawTokens = async () => {
    if (!isConnected || !userAddress) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to withdraw tokens.",
        variant: "destructive",
      })
      return
    }

    if (!withdrawAmount || isNaN(parseFloat(withdrawAmount)) || parseFloat(withdrawAmount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount to withdraw.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsWithdrawing(true)
      const amount = parseUnits(withdrawAmount, weightTokenDecimals)
      
      console.log('Withdrawing tokens:', {
        amount: amount.toString(),
        withdrawAmount,
        oracleAddress: oracleAddress,
        userAddress: userAddress,
        depositedTokens: userDepositedTokens
      })
      
      writeContract({
        address: oracleAddress!,
        abi: OracleAbi,
        functionName: 'withdrawTokens',
        args: [amount],
      })

      toast({
        title: "Transaction Submitted",
        description: "Your token withdrawal is being processed...",
      })
    } catch (err: any) {
      console.error('Error withdrawing tokens:', err)
      setIsWithdrawing(false)
      toast({
        title: "Withdrawal Failed",
        description: err?.message || "Failed to withdraw tokens. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleVoteBlacklist = async () => {
    if (!isConnected || !userAddress) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to vote.",
        variant: "destructive",
      })
      return
    }

    if (!voteTarget || !isHexAddress(voteTarget)) {
      toast({
        title: "Invalid Address",
        description: "Please enter a valid Ethereum address.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsVoting(true)
      
      console.log('Voting blacklist:', {
        target: voteTarget,
        oracleAddress: oracleAddress,
        userAddress: userAddress,
        depositedTokens: userDepositedTokens
      })
      
      writeContract({
        address: oracleAddress!,
        abi: OracleAbi,
        functionName: 'voteBlacklist',
        args: [voteTarget as `0x${string}`],
      })

      toast({
        title: "Transaction Submitted",
        description: "Your blacklist vote is being processed...",
      })
    } catch (err: any) {
      console.error('Error voting blacklist:', err)
      setIsVoting(false)
      toast({
        title: "Vote Failed",
        description: err?.message || "Failed to submit blacklist vote. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleVoteWhitelist = async () => {
    if (!isConnected || !userAddress) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to vote.",
        variant: "destructive",
      })
      return
    }

    if (!voteTarget || !isHexAddress(voteTarget)) {
      toast({
        title: "Invalid Address",
        description: "Please enter a valid Ethereum address.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsVoting(true)
      
      console.log('Voting whitelist:', {
        target: voteTarget,
        oracleAddress: oracleAddress,
        userAddress: userAddress,
        depositedTokens: userDepositedTokens
      })
      
      writeContract({
        address: oracleAddress!,
        abi: OracleAbi,
        functionName: 'voteWhitelist',
        args: [voteTarget as `0x${string}`],
      })

      toast({
        title: "Transaction Submitted",
        description: "Your whitelist vote is being processed...",
      })
    } catch (err: any) {
      console.error('Error voting whitelist:', err)
      setIsVoting(false)
      toast({
        title: "Vote Failed",
        description: err?.message || "Failed to submit whitelist vote. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleUpdateVoteWeights = async () => {
    if (!isConnected || !userAddress) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to update vote weights.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsUpdatingVoteWeights(true)
      
      console.log('Updating vote weights:', {
        oracleAddress: oracleAddress,
        userAddress: userAddress
      })
      
      writeContract({
        address: oracleAddress!,
        abi: OracleAbi,
        functionName: 'updateUserVoteWeights',
        args: [],
      })

      toast({
        title: "Transaction Submitted",
        description: "Your vote weights are being updated...",
      })
    } catch (err: any) {
      console.error('Error updating vote weights:', err)
      setIsUpdatingVoteWeights(false)
      toast({
        title: "Update Failed",
        description: err?.message || "Failed to update vote weights. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleReadValue = async () => {
    if (!isConnected || !userAddress) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to read values.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsReadingValue(true)
      setPendingRead("aggregated")

      await writeContractAsync({
        address: oracleAddress!,
        abi: OracleAbi,
        functionName: 'readValue',
        args: [],
      })

      toast({
        title: "Transaction Submitted",
        description: "Awaiting confirmation to retrieve the aggregated value.",
      })
    } catch (err: any) {
      console.error('Error reading value:', err)
      toast({
        title: "Read Failed",
        description: err?.message || "Failed to read aggregated value. Please try again.",
        variant: "destructive",
      })
      setPendingRead(null)
    } finally {
      setIsReadingValue(false)
    }
  }

  const handleReadLatestValue = async () => {
    if (!isConnected || !userAddress) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to read values.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsReadingLatestValue(true)
      setPendingRead("latest")

      await writeContractAsync({
        address: oracleAddress!,
        abi: OracleAbi,
        functionName: 'readLatestValue',
        args: [],
      })

      toast({
        title: "Transaction Submitted",
        description: "Awaiting confirmation to retrieve the latest value.",
      })
    } catch (err: any) {
      console.error('Error reading latest value:', err)
      toast({
        title: "Read Failed",
        description: err?.message || "Failed to read latest value. Please try again.",
        variant: "destructive",
      })
      setPendingRead(null)
    } finally {
      setIsReadingLatestValue(false)
    }
  }

  if (oracleLoading) {
    return (
      <div className="min-h-screen bg-background font-[oblique] tracking-wide" style={{ fontStyle: 'oblique 12deg' }}>
        <Navigation />
        <div className="container mx-auto px-6 pt-24 pb-12">
          <div className="text-center py-20">
            <Loader2 className="h-16 w-16 mx-auto mb-6 animate-spin text-primary" />
            <p className="text-xl text-foreground font-medium">Loading oracle details from blockchain…</p>
          </div>
        </div>
      </div>
    )
  }

  if (oracleError || !oracle) {
    return (
      <div className="min-h-screen bg-background font-[oblique] tracking-wide" style={{ fontStyle: 'oblique 12deg' }}>
        <Navigation />
        <div className="container mx-auto px-6 pt-24 pb-12">
          <div className="text-center py-20">
            <div className="text-red-400 mb-6">
              <TrendingUp className="h-16 w-16 mx-auto mb-4 opacity-50" />
            </div>
            <p className="text-xl text-red-400 mb-2 font-medium">{oracleError || "Oracle not found"}</p>
            <p className="text-sm text-muted-foreground mb-8">
              The oracle at address {oracleAddress} on chain {chainId} could not be loaded.
            </p>
            <Link href="/explorer" className="text-primary hover:text-primary/80 font-medium hover:underline transition-colors">
              Back to Explorer
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background font-[oblique] tracking-wide" style={{ fontStyle: 'oblique 12deg' }}>
      <Navigation />

      <div className="container mx-auto px-6 pt-24 pb-12">
        {/* Header */}
        <div className="mb-12 text-center max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <Link
              href="/explorer"
              className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors font-medium"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              <span>Back to Explorer</span>
            </Link>

            <div className="flex items-center gap-4">
              <h1 className="text-4xl sm:text-5xl font-medium tracking-wide bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent" style={{ fontStyle: 'oblique 15deg' }}>
                {oracle.name ?? "Oracle Dashboard"}
              </h1>
            </div>

            <div className="w-24" />
          </div>

          {oracle.description && (
            <p className="text-lg text-muted-foreground mb-6 max-w-3xl mx-auto font-light">{oracle.description}</p>
          )}

          {/* Addresses */}
          <div className="grid gap-4 md:grid-cols-2 mb-8">
            <div className="bg-card/40 border border-primary/25 rounded-xl p-4 text-left">
              <div className="text-xs uppercase tracking-wide text-muted-foreground/70 mb-2">Oracle Address</div>
              <div className="flex items-center justify-between gap-3">
                <code className="flex-1 text-xs sm:text-sm bg-card/60 border border-primary/30 px-3 py-2 rounded-lg text-primary font-mono break-all">
                  {oracle.address}
                </code>
                <button
                  onClick={() => navigator.clipboard.writeText(oracle.address)}
                  className="text-muted-foreground hover:text-primary transition-colors p-2 hover:bg-card/50 rounded-lg border border-transparent hover:border-primary/30"
                  title="Copy oracle address"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="bg-card/40 border border-primary/25 rounded-xl p-4 text-left">
              <div className="flex items-center justify-between mb-2">
                <div className="text-xs uppercase tracking-wide text-muted-foreground/70">Weight Token</div>
                <span className="text-xs font-medium text-primary/80">{weightTokenSymbol}</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <code className="flex-1 text-xs sm:text-sm bg-card/60 border border-primary/30 px-3 py-2 rounded-lg text-primary font-mono break-all">
                  {weightTokenAddressString}
                </code>
                <button
                  onClick={() =>
                    canCopyWeightTokenAddress && navigator.clipboard.writeText(weightTokenAddressString)
                  }
                  disabled={!canCopyWeightTokenAddress}
                  className="text-muted-foreground hover:text-primary transition-colors p-2 hover:bg-card/50 rounded-lg border border-transparent hover:border-primary/30 disabled:opacity-40 disabled:cursor-not-allowed"
                  title="Copy weight token address"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Content - All sections in one page */}
        <div className="max-w-7xl mx-auto space-y-12">
          
          {/* Price Chart Section */}
          <Card className="border-border/50 bg-card/30 backdrop-blur-sm hover:bg-card/60 border-primary/20 hover:border-white transition-all duration-300 rounded-2xl">
            <CardHeader className="border-b border-border/30">
              <CardTitle className="text-foreground flex items-center gap-2 font-medium">
                <TrendingUp className="h-5 w-5 text-primary" />
                Price Chart & Analytics
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <PriceChart data={priceHistoryPoints} loading={pendingRead !== null || isFetchingPriceHistory} />
            </CardContent>
          </Card>

          {/* Submit Value Section */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-border/50 bg-card/30 backdrop-blur-sm hover:bg-card/60 border-primary/20 hover:border-white transition-all duration-300 rounded-2xl">
              <CardHeader className="border-b border-border/30">
                <CardTitle className="text-foreground flex items-center gap-2 font-medium">
                  <Send className="h-5 w-5 text-primary" />
                Submit Price Value
              </CardTitle>
                <CardDescription className="text-muted-foreground">
                Submit a new price value to the oracle. You must have deposited tokens to participate.
              </CardDescription>
            </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <Label htmlFor="submitValue" className="text-foreground font-medium mb-2">Price Value</Label>
                <Input
                  id="submitValue"
                  type="number"
                  placeholder="Enter price value (e.g., 2500)"
                  value={submitValue}
                  onChange={(e) => setSubmitValue(e.target.value)}
                    className="h-12 bg-card/50 border border-primary/30 rounded-xl font-light transition-all duration-300 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 focus:bg-card/70"
                />
              </div>
              <Button 
                onClick={handleSubmitValue} 
                disabled={isSubmitting || isPending || isConfirming || !submitValue || !isConnected}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground border-primary/50 h-12 rounded-xl transition-all duration-300"
              >
                {(isSubmitting || isPending || isConfirming) ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Send className="h-4 w-4 mr-2" />}
                {isSubmitting || isPending ? "Submitting..." : isConfirming ? "Confirming..." : "Submit Value"}
              </Button>
            </CardContent>
          </Card>

            <Card className="border-border/50 bg-card/30 backdrop-blur-sm hover:bg-card/60 border-primary/20 hover:border-white transition-all duration-300 rounded-2xl">
              <CardHeader className="border-b border-border/30">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-foreground flex items-center gap-2 font-medium">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    Current Values
                  </CardTitle>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{lastUpdated}</span>
                  </div>
                </div>
                <CardDescription className="text-muted-foreground">
                  Latest submitted and aggregated oracle values.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div>
                  <div className="flex items-center mb-4 justify-between p-3 bg-card/50 border border-primary/30 rounded-xl transition-all duration-300">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                      <span className="text-muted-foreground font-medium text-sm">Latest Value</span>
                      <span className="text-foreground font-light">{latestValue || "—"}</span>
                    </div>
                    <Button 
                      size="sm"
                      variant="outline"
                      className="h-8 px-3 text-xs border-primary/30 text-primary hover:bg-primary/10 hover:border-primary/50 transition-all duration-300"
                      onClick={handleReadLatestValue}
                      disabled={isReadingLatestValue || isPending || isConfirming || !isConnected}
                    >
                      {isReadingLatestValue || isPending || isConfirming ? <Loader2 className="h-3 w-3 animate-spin" /> : "Read"}
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-card/50 border border-primary/30 rounded-xl transition-all duration-300">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-primary/60 rounded-full"></div>
                      <span className="text-muted-foreground font-medium text-sm">Aggregated</span>
                      <span className="text-foreground font-light">{aggregatedValue || "—"}</span>
                    </div>
                    <Button 
                      size="sm"
                      variant="outline"
                      className="h-8 px-3 text-xs border-primary/30 text-primary hover:bg-primary/10 hover:border-primary/50 transition-all duration-300"
                      onClick={handleReadValue}
                      disabled={isReadingValue || isPending || isConfirming || !isConnected}
                    >
                      {isReadingValue || isPending || isConfirming ? <Loader2 className="h-3 w-3 animate-spin" /> : "Read"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Token Management Section */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-border/50 bg-card/30 backdrop-blur-sm hover:bg-card/60 border-primary/20 hover:border-white transition-all duration-300 rounded-2xl">
              <CardHeader className="border-b border-border/30">
                <CardTitle className="text-foreground flex items-center gap-2 font-medium">
                  <Wallet className="h-5 w-5 text-primary" />
                  Deposit Tokens
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Deposit weight tokens to participate in oracle governance and earn rewards.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Token Balance Display */}
                {isConnected && (
                  <div className="space-y-3 mb-4">
                    
                    {/* Detailed Token State Breakdown */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-2 bg-card/30 border border-primary/20 rounded-lg text-xs">
                  <div className="text-center">
                    <div className="text-muted-foreground/80 mb-0.5">🔒 Locked</div>
                    <div className="text-foreground/90 font-light">
                      {formatTokenAmount(lockedTokensData ? (lockedTokensData as bigint) : undefined)} {weightTokenSymbol}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-muted-foreground/80 mb-0.5">📅 Deposit Time</div>
                    <div className="text-foreground/90 font-light text-xs">{depositTimestamp}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-muted-foreground/80 mb-0.5">💼 Wallet Balance</div>
                    <div className="text-foreground/90 font-light">
                      {walletTokenBalanceDisplay} {weightTokenSymbol}
                    </div>
                  </div>
                </div>
              </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="depositAmount" className="text-foreground font-medium">Amount</Label>
                  <Input
                    id="depositAmount"
                    type="number"
                    placeholder="Enter amount to deposit"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    className="h-12 mb-4 bg-card/50 border border-primary/30 rounded-xl font-light transition-all duration-300 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 focus:bg-card/70"
                  />
                </div>
                
                {/* Conditional Buttons based on allowance */}
                {(() => {
                  const amount = depositAmount ? parseUnits(depositAmount, weightTokenDecimals) : BigInt(0)
                  const allowance = tokenAllowanceData ? BigInt(tokenAllowanceData as bigint) : BigInt(0)
                  const needsApproval = amount > allowance

                  if (needsApproval) {
                    return (
                      <Button 
                        onClick={handleApproveTokens} 
                        disabled={isApproving || isPending || isConfirming || !depositAmount || !isConnected}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground border-primary/50 h-12 rounded-xl transition-all duration-300"

                      >
                        {(isApproving || isPending || isConfirming) ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <CheckCircle className="h-4 w-4 mr-2" />}
                        {isApproving || isPending ? "Approving..." : isConfirming ? "Confirming..." : "Approve Tokens"}
                      </Button>
                    )
                  } else {
                    return (
                <Button 
                  onClick={handleDepositTokens} 
                        disabled={isDepositing || isPending || isConfirming || !depositAmount || !isConnected}
                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-12 rounded-xl transition-all duration-300"
                >
                        {(isDepositing || isPending || isConfirming) ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Wallet className="h-4 w-4 mr-2" />}
                        {isDepositing || isPending ? "Depositing..." : isConfirming ? "Confirming..." : "Deposit Tokens"}
                </Button>
                    )
                  }
                })()}
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-card/30 backdrop-blur-sm hover:bg-card/60 border-primary/20 hover:border-white transition-all duration-300 rounded-2xl">
              <CardHeader className="border-b border-border/30">
                <CardTitle className="text-foreground flex items-center gap-2 font-medium">
                  <Wallet className="h-5 w-5 text-destructive" />
                  Withdraw Tokens
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Withdraw your deposited tokens. Note the withdrawal locking period.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Show deposited tokens */}
                {isConnected && (
                  <div className="grid grid-cols-2 gap-2 p-2 bg-card/30 border border-primary/20 rounded-lg text-xs mb-4">
                  <div className="text-center">
                    <div className="text-muted-foreground/80 mb-0.5">⏰ Last Operation</div>
                    <div className="text-foreground/90 font-light text-xs">{lastOperationTimestamp}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-muted-foreground/80 mb-0.5">✓ Unlocked</div>
                    <div className="text-foreground/90 font-light">
                      {formatTokenAmount(unlockedTokensData ? (unlockedTokensData as bigint) : undefined)} {weightTokenSymbol}
                    </div>
                  </div>
                </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="withdrawAmount" className="text-foreground font-medium">Amount</Label>
                  <Input
                    id="withdrawAmount"
                    type="number"
                    placeholder="Enter amount to withdraw"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    className="h-12 mb-4 bg-card/50 border border-primary/30 rounded-xl font-light transition-all duration-300 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 focus:bg-card/70"
                  />
                </div>
                <Button 
                  onClick={handleWithdrawTokens} 
                  disabled={isWithdrawing || isPending || isConfirming || !withdrawAmount || !isConnected}
                  className="w-full bg-destructive hover:bg-destructive/90 text-destructive-foreground h-12 rounded-xl transition-all duration-300"
                >
                  {(isWithdrawing || isPending || isConfirming) ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Wallet className="h-4 w-4 mr-2" />}
                  {isWithdrawing || isPending ? "Withdrawing..." : isConfirming ? "Confirming..." : "Withdraw Tokens"}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Governance Section */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-border/50 bg-card/30 backdrop-blur-sm hover:bg-card/60 border-primary/20 hover:border-white transition-all duration-300 rounded-2xl">
              <CardHeader className="border-b border-border/30">
                <CardTitle className="text-foreground flex items-center gap-2 font-medium">
                  <Vote className="h-5 w-5 text-primary" />
                  Governance Voting
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Vote to blacklist or whitelist addresses. Your voting power is based on your deposited tokens.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="voteTarget" className="text-foreground font-medium">Target Address</Label>
                  <Input
                    id="voteTarget"
                    placeholder="0x..."
                    value={voteTarget}
                    onChange={(e) => setVoteTarget(e.target.value)}
                    className="h-12 mb-4 bg-card/50 border border-primary/30 rounded-xl font-light transition-all duration-300 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 focus:bg-card/70"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Button 
                    onClick={handleVoteBlacklist} 
                    disabled={isVoting || isPending || isConfirming || !voteTarget || !isConnected}
                    className="bg-destructive hover:bg-destructive/90 text-destructive-foreground h-12 rounded-xl transition-all duration-300"
                  >
                    {(isVoting || isPending || isConfirming) ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Shield className="h-4 w-4 mr-2" />}
                    {isVoting || isPending ? "Voting..." : isConfirming ? "Confirming..." : "Vote Blacklist"}
                  </Button>
                  <Button 
                    onClick={handleVoteWhitelist} 
                    disabled={isVoting || isPending || isConfirming || !voteTarget || !isConnected}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground h-12 rounded-xl transition-all duration-300"
                  >
                    {(isVoting || isPending || isConfirming) ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Shield className="h-4 w-4 mr-2" />}
                    {isVoting || isPending ? "Voting..." : isConfirming ? "Confirming..." : "Vote Whitelist"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-card/30 backdrop-blur-sm hover:bg-card/60 border-primary/20 hover:border-white transition-all duration-300 rounded-2xl">
              <CardHeader className="border-b border-border/30">
                <CardTitle className="text-foreground flex items-center gap-2 font-medium" >
                  <Settings className="h-5 w-5 text-primary" />
                  Update Vote Weights
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Update your vote weights to reflect your current token balance. Required after depositing new tokens.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Current voting power display */}
                {isConnected && (
                  <div className="p-3 bg-card/50 border border-primary/30 rounded-xl mb-4">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-muted-foreground">Current Voting Power</div>
                      <div className="text-lg font-light text-primary font-medium">{parseFloat(userDepositedTokens).toFixed(4)}</div>
                    </div>
                  </div>
                )}
                
                <Button 
                  onClick={handleUpdateVoteWeights} 
                  disabled={isUpdatingVoteWeights || isPending || isConfirming || !isConnected}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground border-primary/50 h-12 rounded-xl transition-all duration-300"
                >
                  {(isUpdatingVoteWeights || isPending || isConfirming) ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Settings className="h-4 w-4 mr-2" />}
                  {isUpdatingVoteWeights || isPending ? "Updating..." : isConfirming ? "Confirming..." : "Update Vote Weights"}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Oracle Configuration */}
          <Card className="border-border/50 bg-card/30 backdrop-blur-sm hover:bg-card/60 border-primary/20 hover:border-white transition-all duration-300 rounded-2xl">
            <CardHeader className="border-b border-border/30">
              <CardTitle className="text-foreground flex items-center gap-2 font-medium">
                <Settings className="h-5 w-5 text-primary" />
                Oracle Configuration
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                View oracle parameters and configuration details.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-card/50 border border-primary/30 rounded-xl transition-all duration-300">
                    <span className="text-muted-foreground font-medium">Reward Rate</span>
                    <span className="text-foreground font-light">{rewardRate}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-card/50 border border-primary/30 rounded-xl transition-all duration-300">
                    <span className="text-muted-foreground font-medium">Half Life</span>
                    <span className="text-foreground font-light">{halfLifeSeconds}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-card/50 border border-primary/30 rounded-xl transition-all duration-300">
                    <span className="text-muted-foreground font-medium">Quorum</span>
                    <span className="text-foreground font-light">{quorumPercentage}</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-card/50 border border-primary/30 rounded-xl transition-all duration-300">
                    <span className="text-muted-foreground font-medium">Operation Locking Period</span>
                    <span className="text-foreground font-light">{operationLockPeriod}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-card/50 border border-primary/30 rounded-xl transition-all duration-300">
                    <span className="text-muted-foreground font-medium">Withdrawal Locking Period</span>
                    <span className="text-foreground font-light">{withdrawalLockPeriod}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-card/50 border border-primary/30 rounded-xl transition-all duration-300">
                    <span className="text-muted-foreground font-medium">Alpha</span>
                    <span className="text-foreground font-light">{alphaValue}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Price History */}
          <Card className="border-border/50 bg-card/30 backdrop-blur-sm hover:bg-card/60 border-primary/20 hover:border-white transition-all duration-300 rounded-2xl">
            <CardHeader className="border-b border-border/30">
              <CardTitle className="text-foreground flex items-center gap-2 font-medium">
                <History className="h-5 w-5 text-primary" />
                Recent Activity & History
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                View historical price submissions and oracle activity.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="text-center py-12 text-muted-foreground">
                <Database className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg mb-2 font-light">Price history will be displayed here</p>
                <p className="text-sm">Connect your wallet to view detailed transaction history</p>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  )
}
