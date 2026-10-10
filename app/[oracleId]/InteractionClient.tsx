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
import { useAccount, useWriteContract, useReadContract, useWaitForTransactionReceipt, usePublicClient } from "wagmi"
import { parseUnits, formatUnits, erc20Abi, BaseError } from "viem"

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

const formatUtcDateTimeString = (seconds: number) => {
  if (!seconds || seconds <= 0) return "Never"
  const date = new Date(seconds * 1000)
  const pad = (n: number) => n.toString().padStart(2, "0")
  const YYYY = date.getUTCFullYear()
  const MM = pad(date.getUTCMonth() + 1)
  const DD = pad(date.getUTCDate())
  const HH = pad(date.getUTCHours())
  const mm = pad(date.getUTCMinutes())
  const ss = pad(date.getUTCSeconds())
  return `${YYYY}-${MM}-${DD} ${HH}:${mm}:${ss} UTC`
}

const compose = (
  valA: bigint,
  valB: bigint,
  decimalsA: number,
  decimalsB: number,
  operation: number,
  invertResult: boolean
) => {
  if (valB === BigInt(0)) return BigInt(0)
  let result = BigInt(0)
  const WAD = BigInt(1000000000000000000)

  if (operation === 0) {
    const scalingPower = decimalsA + decimalsB
    if (18 >= scalingPower) {
      result = valA * valB * BigInt(Math.pow(10, 18 - scalingPower))
    } else {
      result = (valA * valB) / BigInt(Math.pow(10, scalingPower - 18))
    }
  } else {
    if (decimalsB + 18 >= decimalsA) {
      result = (valA * BigInt(Math.pow(10, decimalsB + 18 - decimalsA))) / valB
    } else {
      result = valA / (valB * BigInt(Math.pow(10, decimalsA - decimalsB - 18)))
    }
  }

  if (invertResult) {
    if (result === BigInt(0)) return BigInt(0)
    result = (WAD * WAD) / result
  }
  return result
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
  const [isReadingInterval, setIsReadingInterval] = useState(false)

  // Real-time oracle data
  const [latestValue, setLatestValue] = useState<string>("—")
  const [aggregatedValue, setAggregatedValue] = useState<string>("—")
  const [intervalValue, setIntervalValue] = useState<string>("—")
  const [lastUpdated, setLastUpdated] = useState<string>("Loading...")
  const [userDepositedTokens, setUserDepositedTokens] = useState<string>("0")
  const [userTokenBalance, setUserTokenBalance] = useState<string>("0")
  const [tokenAllowance, setTokenAllowance] = useState<string>("0")

  const [priceHistoryPoints, setPriceHistoryPoints] = useState<PriceChartPoint[]>([])

  // Oracle configuration display values
  const [rewardRate, setRewardRate] = useState<string>("Loading...")
  const [halfLifeSeconds, setHalfLifeSeconds] = useState<string>("Loading...")
  const [quorumPercentage, setQuorumPercentage] = useState<string>("Loading...")
  const [operationLockPeriod, setOperationLockPeriod] = useState<string>("Loading...")
  const [withdrawalLockPeriod, setWithdrawalLockPeriod] = useState<string>("Loading...")
  const [gammaValue, setGammaValue] = useState<string>("Loading...")

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
  const publicClient = usePublicClient({ chainId })

  const { oracle, loading: oracleLoading, error: oracleError } = useOracle(oracleAddress || "", chainId)

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
    query: { enabled: !!oracleAddress && !oracle?.isComposed }
  })

  const { data: weightTokenSymbolData } = useReadContract({
    address: (weightTokenAddress as `0x${string}`) || undefined,
    abi: erc20Abi,
    functionName: 'symbol',
    query: { enabled: !!weightTokenAddress && !oracle?.isComposed }
  })

  const { data: weightTokenDecimalsData } = useReadContract({
    address: (weightTokenAddress as `0x${string}`) || undefined,
    abi: erc20Abi,
    functionName: 'decimals',
    query: { enabled: !!weightTokenAddress && !oracle?.isComposed }
  })

  // Read user's locked tokens (for governance operations)
  const { data: lockedTokensData } = useReadContract({
    address: oracleAddress || undefined,
    abi: OracleAbi,
    functionName: 'lockedTokens',
    args: userAddress ? [userAddress] : undefined,
    query: { enabled: !!oracleAddress && !!userAddress && !oracle?.isComposed }
  })

  // Read user's unlocked tokens (available for withdrawal)
  const { data: unlockedTokensData } = useReadContract({
    address: oracleAddress || undefined,
    abi: OracleAbi,
    functionName: 'unlockedTokens',
    args: userAddress ? [userAddress] : undefined,
    query: { enabled: !!oracleAddress && !!userAddress && !oracle?.isComposed }
  })

  // Read user's deposit timestamp
  const { data: depositTimestampData } = useReadContract({
    address: oracleAddress || undefined,
    abi: OracleAbi,
    functionName: 'depositTimestamp',
    args: userAddress ? [userAddress] : undefined,
    query: { enabled: !!oracleAddress && !!userAddress && !oracle?.isComposed }
  })

  // Read user's last operation timestamp
  const { data: lastOperationTimestampData } = useReadContract({
    address: oracleAddress || undefined,
    abi: OracleAbi,
    functionName: 'lastOperationTimestamp',
    args: userAddress ? [userAddress] : undefined,
    query: { enabled: !!oracleAddress && !!userAddress && !oracle?.isComposed }
  })

  const { data: lastUpdatedData } = useReadContract({
    address: oracleAddress || undefined,
    abi: OracleAbi,
    functionName: 'lastUpdated',
    query: { enabled: !!oracleAddress && !oracle?.isComposed }
  })

  // Read oracle configuration parameters
  const { data: rewardData } = useReadContract({
    address: oracleAddress || undefined,
    abi: OracleAbi,
    functionName: 'REWARD_BPS',
    query: { enabled: !!oracleAddress && !oracle?.isComposed }
  })

  const { data: halfLifeSecondsData } = useReadContract({
    address: oracleAddress || undefined,
    abi: OracleAbi,
    functionName: 'HALF_LIFE_SECONDS',
    query: { enabled: !!oracleAddress && !oracle?.isComposed }
  })

  const { data: quorumData } = useReadContract({
    address: oracleAddress || undefined,
    abi: OracleAbi,
    functionName: 'Q',
    query: { enabled: !!oracleAddress && !oracle?.isComposed }
  })

  const { data: operationLockingPeriodData } = useReadContract({
    address: oracleAddress || undefined,
    abi: OracleAbi,
    functionName: 'DEPOSIT_LOCKING_PERIOD',
    query: { enabled: !!oracleAddress && !oracle?.isComposed }
  })

  const { data: withdrawalLockingPeriodData } = useReadContract({
    address: oracleAddress || undefined,
    abi: OracleAbi,
    functionName: 'WITHDRAWAL_LOCKING_PERIOD',
    query: { enabled: !!oracleAddress && !oracle?.isComposed }
  })

  const { data: gammaData } = useReadContract({
    address: oracleAddress || undefined,
    abi: OracleAbi,
    functionName: 'GAMMA',
    query: { enabled: !!oracleAddress && !oracle?.isComposed }
  })

  // Read current oracle values for display (using view functions or public variables)
  // Note: Since readValue/readLatestValue are not view functions, we need to find the storage variables
  // Let's try to read from events or use a different approach

  // Read the latest price history to get current values
  const { data: priceHistoryLengthData } = useReadContract({
    address: oracleAddress || undefined,
    abi: OracleAbi,
    functionName: 'getPriceHistoryLength',
    query: { enabled: !!oracleAddress && !oracle?.isComposed }
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
      enabled: !!oracleAddress && !!priceHistoryRangeArgs && !oracle?.isComposed
    }
  })

  // Parent feed A reads
  const { data: priceHistoryLengthA } = useReadContract({
    address: (oracle?.feedA as `0x${string}`) || undefined,
    abi: OracleAbi,
    functionName: 'getPriceHistoryLength',
    query: { enabled: !!oracle?.isComposed && !!oracle?.feedA }
  })

  const priceHistoryRangeArgsA = useMemo(() => {
    if (!priceHistoryLengthA) return undefined
    const length = priceHistoryLengthA as bigint
    const zero = BigInt(0)
    if (length === zero) return undefined
    const end = length
    const maxPoints = BigInt(MAX_PRICE_POINTS)
    const start = length > maxPoints ? length - maxPoints : zero
    return [start, end] as const
  }, [priceHistoryLengthA])

  const { data: latestPriceHistoryDataA, isFetching: isFetchingHistoryA } = useReadContract({
    address: (oracle?.feedA as `0x${string}`) || undefined,
    abi: OracleAbi,
    functionName: 'getPriceHistoryRange',
    args: priceHistoryRangeArgsA,
    query: { enabled: !!oracle?.isComposed && !!oracle?.feedA && !!priceHistoryRangeArgsA }
  })

  // Parent feed B reads
  const { data: priceHistoryLengthB } = useReadContract({
    address: (oracle?.feedB as `0x${string}`) || undefined,
    abi: OracleAbi,
    functionName: 'getPriceHistoryLength',
    query: { enabled: !!oracle?.isComposed && !!oracle?.feedB }
  })

  const priceHistoryRangeArgsB = useMemo(() => {
    if (!priceHistoryLengthB) return undefined
    const length = priceHistoryLengthB as bigint
    const zero = BigInt(0)
    if (length === zero) return undefined
    const end = length
    const maxPoints = BigInt(MAX_PRICE_POINTS)
    const start = length > maxPoints ? length - maxPoints : zero
    return [start, end] as const
  }, [priceHistoryLengthB])

  const { data: latestPriceHistoryDataB, isFetching: isFetchingHistoryB } = useReadContract({
    address: (oracle?.feedB as `0x${string}`) || undefined,
    abi: OracleAbi,
    functionName: 'getPriceHistoryRange',
    args: priceHistoryRangeArgsB,
    query: { enabled: !!oracle?.isComposed && !!oracle?.feedB && !!priceHistoryRangeArgsB }
  })

  useEffect(() => {
    if (!latestPriceHistoryData) {
      setPriceHistoryPoints([])
      return
    }

    const history = buildPriceHistoryPoints(latestPriceHistoryData as PriceHistoryResult)
    setPriceHistoryPoints(history)
  }, [latestPriceHistoryData, buildPriceHistoryPoints])

  // Aligned price history calculation for Composed Oracles
  useEffect(() => {
    if (!oracle?.isComposed || !latestPriceHistoryDataA || !latestPriceHistoryDataB) {
      return
    }

    const [timestampsA, aggregatedA, latestA] = latestPriceHistoryDataA as PriceHistoryResult
    const [timestampsB, aggregatedB, latestB] = latestPriceHistoryDataB as PriceHistoryResult

    const alignedPoints: PriceChartPoint[] = []

    const decA = 18
    const decB = 18
    const op = oracle.operation ?? 0
    const inv = oracle.invertResult ?? false

    // Merge unique timestamps and sort them ascending
    const allTimestamps = Array.from(
      new Set([
        ...timestampsA.map((t) => Number(t)),
        ...timestampsB.map((t) => Number(t)),
      ])
    ).sort((a, b) => a - b)

    let lastAggA = BigInt(0)
    let lastAggB = BigInt(0)
    let lastLatA = BigInt(0)
    let lastLatB = BigInt(0)

    if (aggregatedA.length > 0) lastAggA = aggregatedA[0]
    if (aggregatedB.length > 0) lastAggB = aggregatedB[0]
    if (latestA.length > 0) lastLatA = latestA[0]
    if (latestB.length > 0) lastLatB = latestB[0]

    allTimestamps.forEach((ts) => {
      const idxA = timestampsA.findIndex((t) => Number(t) === ts)
      if (idxA !== -1) {
        lastAggA = aggregatedA[idxA]
        lastLatA = latestA[idxA]
      } else {
        const prevIdx = timestampsA.map((t) => Number(t)).reduce((prev, curr, idx) => (curr < ts ? idx : prev), -1)
        if (prevIdx !== -1) {
          lastAggA = aggregatedA[prevIdx]
          lastLatA = latestA[prevIdx]
        }
      }

      const idxB = timestampsB.findIndex((t) => Number(t) === ts)
      if (idxB !== -1) {
        lastAggB = aggregatedB[idxB]
        lastLatB = latestB[idxB]
      } else {
        const prevIdx = timestampsB.map((t) => Number(t)).reduce((prev, curr, idx) => (curr < ts ? idx : prev), -1)
        if (prevIdx !== -1) {
          lastAggB = aggregatedB[prevIdx]
          lastLatB = latestB[prevIdx]
        }
      }

      const composedAgg = compose(lastAggA, lastAggB, decA, decB, op, inv)
      const composedLat = compose(lastLatA, lastLatB, decA, decB, op, inv)

      alignedPoints.push({
        timestamp: ts,
        aggregated: Number(formatUnits(composedAgg, PRICE_DECIMALS)) || 0,
        latest: Number(formatUnits(composedLat, PRICE_DECIMALS)) || 0,
      })
    })

    const finalPoints = alignedPoints.slice(-MAX_PRICE_POINTS)
    setPriceHistoryPoints(finalPoints)

    if (finalPoints.length > 0) {
      const latestPoint = finalPoints[finalPoints.length - 1]
      setAggregatedValue(latestPoint.aggregated.toFixed(DISPLAY_PRECISION))
      setLatestValue(latestPoint.latest.toFixed(DISPLAY_PRECISION))
      setLastUpdated("Just now")
    }
  }, [oracle, latestPriceHistoryDataA, latestPriceHistoryDataB])

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

  const lockedTokensRaw = lockedTokensData ? BigInt(lockedTokensData as bigint) : BigInt(0)
  const unlockedTokensRaw = unlockedTokensData ? BigInt(unlockedTokensData as bigint) : BigInt(0)
  const totalDepositedTokensRaw = lockedTokensRaw + unlockedTokensRaw
  const userTokenBalanceRaw = userTokenBalanceData ? BigInt(userTokenBalanceData as bigint) : BigInt(0)

  const isTokenHolder = userTokenBalanceRaw > BigInt(0)
  const isActiveOperator = totalDepositedTokensRaw > BigInt(0)
  const hasUnlockedTokens = unlockedTokensRaw > BigInt(0)
  const operatorActionsDisabled = isActiveOperator && !hasUnlockedTokens

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
    if (lastUpdatedData !== undefined) {
      const timestamp = Number(lastUpdatedData as bigint)
      if (timestamp === 0) {
        setLastUpdated("Never")
      } else {
        const now = Math.floor(Date.now() / 1000)
        const diff = Math.max(0, now - timestamp)
        if (diff < 60) {
          setLastUpdated(`${diff}s ago`)
        } else if (diff < 3600) {
          setLastUpdated(`${Math.floor(diff / 60)}m ago`)
        } else if (diff < 86400) {
          setLastUpdated(`${Math.floor(diff / 3600)}h ago`)
        } else {
          setLastUpdated(`${Math.floor(diff / 86400)}d ago`)
        }
      }
    } else if (oracle?.isComposed) {
      setLastUpdated("Live Calculated")
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
    if (gammaData) {
      const gamma = Number(gammaData as bigint)
      setGammaValue(`${gamma}s`)
    }

    // Update timestamp values
    if (depositTimestampData) {
      const timestamp = Number(depositTimestampData as bigint)
      setDepositTimestamp(formatUtcDateTimeString(timestamp))
    }
    if (lastOperationTimestampData) {
      const timestamp = Number(lastOperationTimestampData as bigint)
      setLastOperationTimestamp(formatUtcDateTimeString(timestamp))
    }

  }, [lockedTokensData, unlockedTokensData, userTokenBalanceData, tokenAllowanceData, formatTokenAmount, weightTokenDecimals, lastUpdatedData, rewardData, halfLifeSecondsData, quorumData, operationLockingPeriodData, withdrawalLockingPeriodData, gammaData, depositTimestampData, lastOperationTimestampData])

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
        if (result?.data) {
          const data = result.data as PriceHistoryResult
          updatePriceDisplays(data)
        }
      } catch (err) {
        console.error('Error updating price data after confirmation:', err)
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
  }, [isConfirmed, refetchPriceHistory, updatePriceDisplays, toast])

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
      // Parse to bigint using exact decimals to prevent JS precision loss
      const valueAsInt = parseUnits(submitValue, PRICE_DECIMALS)
      
      console.log('Submitting value:', {
        original: submitValue,
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

  const simulateRead = useCallback(
    async (fnName: "readValue" | "readLatestValue") => {
      if (!oracleAddress || !publicClient) {
        throw new Error("Oracle client not ready")
      }

      const result = await publicClient.readContract({
        address: oracleAddress,
        abi: OracleAbi,
        functionName: fnName,
        args: [],
      })
      return { result: result as unknown as bigint, usedFallback: false }
    },
    [oracleAddress, publicClient]
  )

  const handleReadValue = async () => {
    try {
      setIsReadingValue(true)

      const { result, usedFallback } = await simulateRead("readValue")
      const formatted = formatPriceFromWei(result)

      setAggregatedValue(formatted)

      toast({
        title: "Aggregated Value",
        description: usedFallback
          ? `Current aggregated value: ${formatted}. Retrieved via neutral simulation.`
          : `Current aggregated value: ${formatted}`,
      })
    } catch (err: unknown) {
      console.error('Error reading aggregated value:', err)
      const description =
        err instanceof BaseError
          ? err.shortMessage
          : err instanceof Error
            ? err.message
            : "Failed to read aggregated value. Please try again."

      toast({
        title: "Read Failed",
        description,
        variant: "destructive",
      })
    } finally {
      setIsReadingValue(false)
    }
  }

  const handleReadLatestValue = async () => {
    try {
      setIsReadingLatestValue(true)

      const { result, usedFallback } = await simulateRead("readLatestValue")
      const formatted = formatPriceFromWei(result)

      setLatestValue(formatted)

      toast({
        title: "Latest Submission",
        description: usedFallback
          ? `Latest submitted value: ${formatted}. Retrieved via neutral simulation.`
          : `Latest submitted value: ${formatted}`,
      })
    } catch (err: unknown) {
      console.error('Error reading latest value:', err)
      const description =
        err instanceof BaseError
          ? err.shortMessage
          : err instanceof Error
            ? err.message
            : "Failed to read latest value. Please try again."

      toast({
        title: "Read Failed",
        description,
        variant: "destructive",
      })
    } finally {
      setIsReadingLatestValue(false)
    }
  }

  const handleReadInterval = async () => {
    try {
      setIsReadingInterval(true)

      if (!oracleAddress || !publicClient) {
        throw new Error("Oracle client not ready")
      }

      const result = (await publicClient.readContract({
        address: oracleAddress,
        abi: OracleAbi,
        functionName: "readValueInterval",
        args: [],
      })) as [bigint, bigint]

      const minFormatted = formatPriceFromWei(result[0])
      const maxFormatted = formatPriceFromWei(result[1])

      setIntervalValue(`${minFormatted} – ${maxFormatted}`)

      toast({
        title: "Lookback Interval (Min / Max)",
        description: `Min: ${minFormatted} | Max: ${maxFormatted}`,
      })
    } catch (err: unknown) {
      console.error('Error reading interval:', err)
      const description =
        err instanceof BaseError
          ? err.shortMessage
          : err instanceof Error
            ? err.message
            : "Failed to read interval bounds. Ensure the oracle has historical observations."

      toast({
        title: "Interval Read Failed",
        description,
        variant: "destructive",
      })
    } finally {
      setIsReadingInterval(false)
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
    <div className="min-h-screen bg-zinc-950 text-white relative overflow-x-hidden font-sans">
      <Navigation />

      {/* Cosmic Blueprint Radar Grid Backdrop */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-40">
        {/* Radar lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_100%_200px,#8b5cf60c,transparent)]" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 pt-28 pb-20 relative z-10">
        {/* Header */}
        <div className="mb-12 max-w-6xl mx-auto space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <Link
              href="/explorer"
              className="inline-flex items-center text-xs font-mono tracking-widest text-muted-foreground hover:text-white transition-colors uppercase"
            >
              <ArrowLeft className="h-3.5 w-3.5 mr-2" />
              <span>Back to Explorer</span>
            </Link>

            <div className="flex items-center gap-3">
              <span className={`px-2.5 py-0.5 text-[9px] font-mono tracking-widest uppercase rounded-full border ${
                oracle.status === 'active' 
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25' 
                  : 'bg-zinc-800 text-zinc-400 border-zinc-700'
              }`}>
                {oracle.status || 'active'}
              </span>
              {oracle.isComposed && (
                <span className="px-2.5 py-0.5 text-[9px] font-mono tracking-widest uppercase rounded-full bg-primary/10 text-primary border border-primary/25">
                  Composed
                </span>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-white">
              {oracle.name ?? "Oracle Dashboard"}
            </h1>
            {oracle.description && (
              <p className="text-sm sm:text-base text-zinc-400 max-w-3xl leading-relaxed font-light">{oracle.description}</p>
            )}
          </div>

          {/* Addresses */}
          <div className="grid gap-4 md:grid-cols-2 pt-2">
            <div className={`bg-zinc-950/70 border border-white/10 rounded-3xl p-5 text-left backdrop-blur-md shadow-xl ${oracle.isComposed ? 'md:col-span-2' : ''}`}>
              <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 mb-2">Oracle Contract Address</div>
              <div className="flex items-center justify-between gap-3">
                <code className="flex-1 text-xs sm:text-sm bg-black/40 border border-white/5 px-3.5 py-2.5 rounded-xl text-primary font-mono break-all font-medium">
                  {oracle.address}
                </code>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(oracle.address);
                    toast({ description: "Address copied to clipboard" });
                  }}
                  className="text-zinc-400 hover:text-white transition-colors p-2.5 hover:bg-white/5 rounded-xl border border-white/10 shrink-0"
                  title="Copy address"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>
            </div>

            {!oracle.isComposed && (
              <div className="bg-zinc-950/70 border border-white/10 rounded-3xl p-5 text-left backdrop-blur-md shadow-xl">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-400">Staking Weight Token</div>
                  <span className="text-xs font-mono font-semibold text-primary">{weightTokenSymbol}</span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <code className="flex-1 text-xs sm:text-sm bg-black/40 border border-white/5 px-3.5 py-2.5 rounded-xl text-primary font-mono break-all font-medium">
                    {weightTokenAddressString}
                  </code>
                  <button
                    onClick={() => {
                      if (canCopyWeightTokenAddress) {
                        navigator.clipboard.writeText(weightTokenAddressString);
                        toast({ description: "Token address copied" });
                      }
                    }}
                    disabled={!canCopyWeightTokenAddress}
                    className="text-zinc-400 hover:text-white transition-colors p-2.5 hover:bg-white/5 rounded-xl border border-white/10 disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
                    title="Copy token address"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Content Modules Grid */}
        <div className="max-w-7xl mx-auto space-y-8">
          
          {/* Value Chart Section */}
          <div className="bg-zinc-950/70 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-md shadow-2xl transition-all duration-300 hover:border-white/20 space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-white/5">
              <TrendingUp className="h-4 w-4 text-primary" />
              <h3 className="font-mono text-xs uppercase tracking-wider text-white">Oracle Value Chart</h3>
            </div>
            <div className="pt-2">
              <PriceChart data={priceHistoryPoints} loading={isFetchingPriceHistory || isReadingValue || isReadingLatestValue} />
            </div>
          </div>

          {/* Core Interaction Matrix */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Left Module: Feed submission / Formula */}
            {oracle?.isComposed ? (
              <div className="bg-zinc-950/70 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-md shadow-2xl transition-all duration-300 hover:border-white/20 flex flex-col justify-between h-full space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 pb-2 border-b border-white/5">
                    <Settings className="h-4 w-4 text-primary" />
                    <h3 className="font-mono text-xs uppercase tracking-wider text-white">Composition Formula</h3>
                  </div>
                  <p className="text-xs text-zinc-400 pt-1 leading-relaxed">
                    This derivative price index is computed mathematically on-chain from two separate feeds.
                  </p>
                </div>

                <div className="space-y-4 py-2">
                  <div className="flex flex-col gap-2 p-4 bg-black/40 border border-white/5 rounded-2xl">
                    <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Formula Definition</div>
                    <div className="text-base sm:text-lg font-light text-white flex items-center gap-2">
                      <Link
                        href={`/o?chainId=${chainId}&oracle=${oracle.feedA}`}
                        className="text-primary hover:underline font-mono font-medium"
                      >
                        {oracle.name?.split(' ')[0] || (oracle.feedA ? `${oracle.feedA.slice(0, 6)}...${oracle.feedA.slice(-4)}` : "")}
                      </Link>
                      <span className="font-bold text-primary font-mono text-lg">{oracle.operation === 0 ? "×" : "/"}</span>
                      <Link
                        href={`/o?chainId=${chainId}&oracle=${oracle.feedB}`}
                        className="text-primary hover:underline font-mono font-medium"
                      >
                        {oracle.name?.split(' ')[2] || (oracle.feedB ? `${oracle.feedB.slice(0, 6)}...${oracle.feedB.slice(-4)}` : "")}
                      </Link>
                      {oracle.invertResult && (
                        <span className="text-[10px] font-mono bg-primary/10 text-primary px-2.5 py-0.5 rounded-full border border-primary/20 ml-2 uppercase tracking-wider">
                          Inverted
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div className="p-3.5 bg-black/30 border border-white/5 rounded-2xl">
                      <span className="text-[10px] font-mono text-zinc-500 uppercase block mb-1">Index Deployer</span>
                      <span className="font-mono text-xs text-white block truncate" title={oracle.creator}>
                        {oracle.creator ? `${oracle.creator.slice(0, 6)}...${oracle.creator.slice(-4)}` : "—"}
                      </span>
                    </div>
                    <div className="p-3.5 bg-black/30 border border-white/5 rounded-2xl">
                      <span className="text-[10px] font-mono text-zinc-500 uppercase block mb-1">Lookback Points</span>
                      <span className="font-mono text-sm text-white font-medium block">
                        {oracle.defaultSampleSize ? oracle.defaultSampleSize.toString() : "100"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-zinc-950/70 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-md shadow-2xl transition-all duration-300 hover:border-white/20 flex flex-col justify-between h-full space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 pb-2 border-b border-white/5">
                    <Send className="h-4 w-4 text-primary" />
                    <h3 className="font-mono text-xs uppercase tracking-wider text-white">Submit Value</h3>
                  </div>
                  <p className="text-xs text-zinc-400 pt-1 leading-relaxed">
                    Publish a new observation update. Submitting updates requires a deposited staking balance.
                  </p>
                </div>

                <div className="space-y-4 pt-2">
                  <div>
                    <label htmlFor="submitValue" className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 block mb-2">Value</label>
                    <input
                      id="submitValue"
                      type="number"
                      placeholder="Enter value (e.g. 2500.50)"
                      value={submitValue}
                      onChange={(e) => setSubmitValue(e.target.value)}
                      className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-sm placeholder:text-zinc-500 text-white focus:border-primary/45 focus:ring-1 focus:ring-primary/20 transition-all outline-none font-mono"
                    />
                  </div>
                  <button 
                    onClick={handleSubmitValue} 
                    disabled={isSubmitting || isPending || isConfirming || !submitValue || !isConnected}
                    className="w-full h-12 rounded-xl bg-white text-black hover:bg-zinc-200 font-mono text-xs font-semibold tracking-wider active:scale-[0.98] transition-all flex items-center justify-center space-x-2 disabled:opacity-40"
                  >
                    {(isSubmitting || isPending || isConfirming) ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
                    <span>{isSubmitting || isPending ? "Submitting..." : isConfirming ? "Confirming..." : "Submit Value"}</span>
                  </button>
                </div>
              </div>
            )}

            {/* Right Module: Current Feed metrics */}
            <div className="bg-zinc-950/70 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-md shadow-2xl transition-all duration-300 hover:border-white/20 flex flex-col justify-between h-full space-y-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 pb-2 border-b border-white/5">
                  <Database className="h-4 w-4 text-primary" />
                  <h3 className="font-mono text-xs uppercase tracking-wider text-white">Aggregated Metrics</h3>
                </div>
                <p className="text-xs text-zinc-400 pt-1 leading-relaxed">
                  Query the on-chain registry state for latest node reports and global updates.
                </p>
              </div>

              <div className="space-y-3.5 pt-2">
                <div className="flex items-center justify-between p-3.5 bg-black/40 border border-white/5 rounded-2xl">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-primary" />
                    <span className="text-zinc-400 font-mono text-[10px] uppercase tracking-wider">Latest Value</span>
                    <span className="text-white font-mono text-sm font-medium ml-2">{latestValue || "—"}</span>
                  </div>
                  <button 
                    className="h-8 px-3.5 text-[10px] font-mono border border-white/10 text-white rounded-lg hover:bg-white/5 active:scale-95 transition-all font-semibold"
                    onClick={handleReadLatestValue}
                    disabled={isReadingLatestValue || isPending || isConfirming || !isConnected}
                  >
                    {isReadingLatestValue ? <Loader2 className="h-3 w-3 animate-spin" /> : "QUERY"}
                  </button>
                </div>
                
                <div className="flex items-center justify-between p-3.5 bg-black/40 border border-white/5 rounded-2xl">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-primary" />
                    <span className="text-zinc-400 font-mono text-[10px] uppercase tracking-wider">Aggregated Value</span>
                    <span className="text-white font-mono text-sm font-medium ml-2">{aggregatedValue || "—"}</span>
                  </div>
                  <button 
                    className="h-8 px-3.5 text-[10px] font-mono border border-white/10 text-white rounded-lg hover:bg-white/5 active:scale-95 transition-all font-semibold"
                    onClick={handleReadValue}
                    disabled={isReadingValue || isPending || isConfirming || !isConnected}
                  >
                    {isReadingValue ? <Loader2 className="h-3 w-3 animate-spin" /> : "QUERY"}
                  </button>
                </div>

                <div className="flex items-center justify-between p-3.5 bg-black/40 border border-white/5 rounded-2xl">
                  <div className="flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-primary" />
                    <span className="text-zinc-400 font-mono text-[10px] uppercase tracking-wider">Min / Max Interval</span>
                    <span className="text-white font-mono text-sm font-medium ml-2">{intervalValue || "—"}</span>
                  </div>
                  <button 
                    className="h-8 px-3.5 text-[10px] font-mono border border-white/10 text-white rounded-lg hover:bg-white/5 active:scale-95 transition-all font-semibold"
                    onClick={handleReadInterval}
                    disabled={isReadingInterval || isPending || isConfirming || !isConnected}
                  >
                    {isReadingInterval ? <Loader2 className="h-3 w-3 animate-spin" /> : "QUERY"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Weight Token Staking Controls (Standard Oracles Only) */}
          {!oracle?.isComposed && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Deposit Weight Staking */}
              <div className="bg-zinc-950/70 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-md shadow-2xl transition-all duration-300 hover:border-white/20 space-y-5">
                <div className="flex items-center gap-2 pb-2 border-b border-white/5">
                  <Wallet className="h-4 w-4 text-primary" />
                  <h3 className="font-mono text-xs uppercase tracking-wider text-white">Staking Deposit</h3>
                </div>

                {isConnected && (
                  <div className="grid grid-cols-3 gap-2.5 p-3.5 bg-black/40 border border-white/5 rounded-2xl text-center">
                    <div>
                      <div className="text-[9.5px] font-mono text-zinc-400 uppercase mb-1">Staked</div>
                      <div className="text-white font-mono text-xs sm:text-sm font-medium truncate">
                        {formatTokenAmount(lockedTokensData ? (lockedTokensData as bigint) : undefined)}
                      </div>
                    </div>
                    <div>
                      <div className="text-[9.5px] font-mono text-zinc-400 uppercase mb-1">Locked Since</div>
                      <div className="text-zinc-300 font-mono text-[10px] truncate">{depositTimestamp}</div>
                    </div>
                    <div>
                      <div className="text-[9.5px] font-mono text-zinc-400 uppercase mb-1">Wallet</div>
                      <div className="text-white font-mono text-xs sm:text-sm font-medium truncate">
                        {walletTokenBalanceDisplay}
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <label htmlFor="depositAmount" className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 block mb-2">Amount to Stake</label>
                    <input
                      id="depositAmount"
                      type="number"
                      placeholder="0.0"
                      value={depositAmount}
                      onChange={(e) => setDepositAmount(e.target.value)}
                      className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-sm placeholder:text-zinc-500 text-white focus:border-primary/45 focus:ring-1 focus:ring-primary/20 transition-all outline-none font-mono"
                    />
                  </div>

                  {(() => {
                    const amount = depositAmount ? parseUnits(depositAmount, weightTokenDecimals) : BigInt(0)
                    const allowance = tokenAllowanceData ? BigInt(tokenAllowanceData as bigint) : BigInt(0)
                    const needsApproval = amount > allowance

                    if (needsApproval) {
                      return (
                        <button 
                          onClick={handleApproveTokens} 
                          disabled={isApproving || isPending || isConfirming || !depositAmount || !isConnected}
                          className="w-full h-12 rounded-xl bg-white text-black hover:bg-zinc-200 font-mono text-xs font-semibold tracking-wider active:scale-[0.98] transition-all flex items-center justify-center space-x-2 disabled:opacity-40"
                        >
                          {(isApproving || isPending || isConfirming) ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle className="h-3.5 w-3.5" />}
                          <span>{isApproving || isPending ? "Approving..." : isConfirming ? "Confirming..." : "Approve Staking"}</span>
                        </button>
                      )
                    } else {
                      return (
                        <button 
                          onClick={handleDepositTokens} 
                          disabled={isDepositing || isPending || isConfirming || !depositAmount || !isConnected}
                          className="w-full h-12 rounded-xl bg-white text-black hover:bg-zinc-200 font-mono text-xs font-semibold tracking-wider active:scale-[0.98] transition-all flex items-center justify-center space-x-2 disabled:opacity-40"
                        >
                          {(isDepositing || isPending || isConfirming) ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Wallet className="h-3.5 w-3.5" />}
                          <span>{isDepositing || isPending ? "Depositing..." : isConfirming ? "Confirming..." : "Stake Tokens"}</span>
                        </button>
                      )
                    }
                  })()}
                </div>
              </div>

              {/* Withdraw Weight Staking */}
              <div className="bg-zinc-950/70 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-md shadow-2xl transition-all duration-300 hover:border-white/20 space-y-5">
                <div className="flex items-center gap-2 pb-2 border-b border-white/5">
                  <Wallet className="h-4 w-4 text-red-400" />
                  <h3 className="font-mono text-xs uppercase tracking-wider text-white">Staking Withdrawal</h3>
                </div>

                {isConnected && (
                  <div className="grid grid-cols-2 gap-3 p-3.5 bg-black/40 border border-white/5 rounded-2xl text-center">
                    <div>
                      <div className="text-[9.5px] font-mono text-zinc-400 uppercase mb-1">Lock Release</div>
                      <div className="text-zinc-300 font-mono text-[10px] truncate">{lastOperationTimestamp}</div>
                    </div>
                    <div>
                      <div className="text-[9.5px] font-mono text-zinc-400 uppercase mb-1">Unlocked</div>
                      <div className="text-white font-mono text-xs sm:text-sm font-medium truncate">
                        {formatTokenAmount(unlockedTokensData ? (unlockedTokensData as bigint) : undefined)}
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <label htmlFor="withdrawAmount" className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 block mb-2">Amount to Withdraw</label>
                    <input
                      id="withdrawAmount"
                      type="number"
                      placeholder="0.0"
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-sm placeholder:text-zinc-500 text-white focus:border-primary/45 focus:ring-1 focus:ring-primary/20 transition-all outline-none font-mono"
                    />
                  </div>
                  <button 
                    onClick={handleWithdrawTokens} 
                    disabled={isWithdrawing || isPending || isConfirming || !withdrawAmount || !isConnected}
                    className="w-full h-12 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 font-mono text-xs font-semibold tracking-wider active:scale-[0.98] transition-all flex items-center justify-center space-x-2 disabled:opacity-40"
                  >
                    {(isWithdrawing || isPending || isConfirming) ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Wallet className="h-3.5 w-3.5" />}
                    <span>{isWithdrawing || isPending ? "Withdrawing..." : isConfirming ? "Confirming..." : "Withdraw Staked"}</span>
                  </button>
                </div>
              </div>

              {/* Staking Governance module */}
              <div className="bg-zinc-950/70 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-md shadow-2xl transition-all duration-300 hover:border-white/20 space-y-5">
                <div className="flex items-center gap-2 pb-2 border-b border-white/5">
                  <Vote className="h-4 w-4 text-primary" />
                  <h3 className="font-mono text-xs uppercase tracking-wider text-white">Staking Governance</h3>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Vote to blacklist or whitelist consumers. Staked weight token holders vote to prevent free-riding protocols from reading oracle values without fulfilling usage terms.
                </p>

                <div className="space-y-4 pt-2">
                  <div>
                    <label htmlFor="voteTarget" className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 block mb-2">Target Address</label>
                    <input
                      id="voteTarget"
                      placeholder="0x..."
                      value={voteTarget}
                      onChange={(e) => setVoteTarget(e.target.value)}
                      className="w-full h-12 bg-white/5 border border-white/10 rounded-xl px-4 text-xs font-mono placeholder:text-zinc-500 text-white focus:border-primary/45 focus:ring-1 focus:ring-primary/20 transition-all outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <button 
                      onClick={handleVoteBlacklist} 
                      disabled={isVoting || isPending || isConfirming || !voteTarget || !isConnected}
                      className="h-12 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 font-mono text-[10px] font-bold tracking-wider active:scale-[0.98] transition-all flex items-center justify-center space-x-1.5 disabled:opacity-40"
                    >
                      {(isVoting || isPending || isConfirming) ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Shield className="h-3.5 w-3.5" />}
                      <span>BLACKLIST</span>
                    </button>
                    <button 
                      onClick={handleVoteWhitelist} 
                      disabled={isVoting || isPending || isConfirming || !voteTarget || !isConnected}
                      className="h-12 rounded-xl bg-white text-black hover:bg-zinc-200 font-mono text-[10px] font-bold tracking-wider active:scale-[0.98] transition-all flex items-center justify-center space-x-1.5 disabled:opacity-40"
                    >
                      {(isVoting || isPending || isConfirming) ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Shield className="h-3.5 w-3.5" />}
                      <span>WHITELIST</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Weight Refresh Module */}
              <div className="bg-zinc-950/70 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-md shadow-2xl transition-all duration-300 hover:border-white/20 space-y-5">
                <div className="flex items-center gap-2 pb-2 border-b border-white/5">
                  <Vote className="h-4 w-4 text-primary" />
                  <h3 className="font-mono text-xs uppercase tracking-wider text-white">Synchronize Vote Weights</h3>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Updates your previously cast blacklist and whitelist votes to reflect your current unlocked stake. Useful if you deposited additional tokens after voting.
                </p>

                <div className="space-y-4 pt-2">
                  {isConnected && (
                    <div className="p-3.5 bg-black/40 border border-white/5 rounded-2xl">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono text-zinc-400 uppercase">Current Voting Stake</span>
                        <span className="text-sm font-mono font-medium text-white">{parseFloat(userDepositedTokens).toFixed(4)}</span>
                      </div>
                    </div>
                  )}
                  
                  <button 
                    onClick={handleUpdateVoteWeights} 
                    disabled={isUpdatingVoteWeights || isPending || isConfirming || !isConnected}
                    className="w-full h-12 rounded-xl bg-white text-black hover:bg-zinc-200 font-mono text-xs font-semibold tracking-wider active:scale-[0.98] transition-all flex items-center justify-center space-x-2 disabled:opacity-40"
                  >
                    {(isUpdatingVoteWeights || isPending || isConfirming) ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Vote className="h-3.5 w-3.5" />}
                    <span>UPDATE VOTE WEIGHTS</span>
                  </button>
                </div>
              </div>

            </div>
          )}

          {/* Oracle Configuration Detail Parameters */}
          <div className="bg-zinc-950/70 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-md shadow-2xl transition-all duration-300 hover:border-white/20 space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-white/5">
              <Settings className="h-4 w-4 text-primary" />
              <h3 className="font-mono text-xs uppercase tracking-wider text-white">Oracle Parameters</h3>
            </div>

            {oracle?.isComposed ? (
              <div className="grid md:grid-cols-2 gap-4 sm:gap-6 text-xs pt-2">
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3.5 bg-black/40 border border-white/5 rounded-2xl">
                    <span className="text-zinc-400 font-mono text-[10px] uppercase tracking-wider">Parent Feed A</span>
                    <Link
                      href={`/o?chainId=${chainId}&oracle=${oracle.feedA}`}
                      className="text-primary hover:underline font-mono text-xs font-medium"
                    >
                      {oracle.feedA ? `${oracle.feedA.slice(0, 6)}...${oracle.feedA.slice(-4)}` : "—"}
                    </Link>
                  </div>
                  <div className="flex justify-between items-center p-3.5 bg-black/40 border border-white/5 rounded-2xl">
                    <span className="text-zinc-400 font-mono text-[10px] uppercase tracking-wider">Parent Feed B</span>
                    <Link
                      href={`/o?chainId=${chainId}&oracle=${oracle.feedB}`}
                      className="text-primary hover:underline font-mono text-xs font-medium"
                    >
                      {oracle.feedB ? `${oracle.feedB.slice(0, 6)}...${oracle.feedB.slice(-4)}` : "—"}
                    </Link>
                  </div>
                  <div className="flex justify-between items-center p-3.5 bg-black/40 border border-white/5 rounded-2xl">
                    <span className="text-zinc-400 font-mono text-[10px] uppercase tracking-wider">Mathematical Op</span>
                    <span className="text-white font-mono text-xs font-medium">
                      {oracle.operation === 0 ? "Multiplication (×)" : "Division (/)"}
                    </span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3.5 bg-black/40 border border-white/5 rounded-2xl">
                    <span className="text-zinc-400 font-mono text-[10px] uppercase tracking-wider">Invert Index Result</span>
                    <span className="text-white font-mono text-xs font-medium">{oracle.invertResult ? "Yes" : "No"}</span>
                  </div>
                  <div className="flex justify-between items-center p-3.5 bg-black/40 border border-white/5 rounded-2xl">
                    <span className="text-zinc-400 font-mono text-[10px] uppercase tracking-wider">Default Sample Size</span>
                    <span className="text-white font-mono text-xs font-medium">
                      {oracle.defaultSampleSize ? oracle.defaultSampleSize.toString() : "100"} points
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3.5 bg-black/40 border border-white/5 rounded-2xl">
                    <span className="text-zinc-400 font-mono text-[10px] uppercase tracking-wider">Staking Creator</span>
                    <span className="text-white font-mono text-xs font-medium truncate max-w-[120px]" title={oracle.creator}>
                      {oracle.creator ? `${oracle.creator.slice(0, 6)}...${oracle.creator.slice(-4)}` : "—"}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4 sm:gap-6 text-xs pt-2">
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3.5 bg-black/40 border border-white/5 rounded-2xl">
                    <span className="text-zinc-400 font-mono text-[10px] uppercase tracking-wider">Reward Rate</span>
                    <span className="text-white font-mono text-xs font-medium">{rewardRate}</span>
                  </div>
                  <div className="flex justify-between items-center p-3.5 bg-black/40 border border-white/5 rounded-2xl">
                    <span className="text-zinc-400 font-mono text-[10px] uppercase tracking-wider">Decay Half Life</span>
                    <span className="text-white font-mono text-xs font-medium">{halfLifeSeconds}</span>
                  </div>
                  <div className="flex justify-between items-center p-3.5 bg-black/40 border border-white/5 rounded-2xl">
                    <span className="text-zinc-400 font-mono text-[10px] uppercase tracking-wider">Governance Quorum</span>
                    <span className="text-white font-mono text-xs font-medium">{quorumPercentage}</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3.5 bg-black/40 border border-white/5 rounded-2xl">
                    <span className="text-zinc-400 font-mono text-[10px] uppercase tracking-wider">Submit Lock Period</span>
                    <span className="text-white font-mono text-xs font-medium">{operationLockPeriod}</span>
                  </div>
                  <div className="flex justify-between items-center p-3.5 bg-black/40 border border-white/5 rounded-2xl">
                    <span className="text-zinc-400 font-mono text-[10px] uppercase tracking-wider">Withdraw Lock Period</span>
                    <span className="text-white font-mono text-xs font-medium">{withdrawalLockPeriod}</span>
                  </div>
                  <div className="flex justify-between items-center p-3.5 bg-black/40 border border-white/5 rounded-2xl">
                    <span className="text-zinc-400 font-mono text-[10px] uppercase tracking-wider">Gamma (Sampling Interval)</span>
                    <span className="text-white font-mono text-xs font-medium">{gammaValue}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}
