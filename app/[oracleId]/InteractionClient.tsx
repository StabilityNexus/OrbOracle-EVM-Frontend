"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { PriceChart } from "@/components/price-chart"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useOracle } from "@/hooks/useOracles"
import { useToast } from "@/hooks/use-toast"
import { OracleAbi } from "@/utils/abi/Oracle"
import { 
  ArrowLeft, 
  Zap, 
  Clock, 
  TrendingUp, 
  Copy, 
  Loader2, 
  Send,
  Wallet,
  Vote,
  Settings,
  Info,
  DollarSign,
  Users,
  Shield,
  History,
  Activity,
  Database,
  CheckCircle
} from "lucide-react"
import { useAccount, useWriteContract, useReadContract, useWaitForTransactionReceipt } from "wagmi"
import { parseEther, formatEther, parseUnits, erc20Abi } from "viem"

function isHexAddress(value: string | null): value is `0x${string}` {
  return !!value && /^0x[a-fA-F0-9]{40}$/.test(value)
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

  // Real-time oracle data
  const [latestValue, setLatestValue] = useState<string>("0")
  const [aggregatedValue, setAggregatedValue] = useState<string>("0")
  const [lastUpdated, setLastUpdated] = useState<string>("Loading...")
  const [userDepositedTokens, setUserDepositedTokens] = useState<string>("0")
  const [userTokenBalance, setUserTokenBalance] = useState<string>("0")
  const [tokenAllowance, setTokenAllowance] = useState<string>("0")

  const oracleAddress = isHexAddress(oracleParam) ? (oracleParam as `0x${string}`) : null
  const chainId = chainIdParam ? Number(chainIdParam) : undefined
  const chainIdValid = chainId !== undefined && Number.isFinite(chainId) && chainId > 0

  // Contract write hook
  const { writeContract, data: hash, error: contractError, isPending } = useWriteContract()
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

  const { data: depositedTokensData } = useReadContract({
    address: oracleAddress || undefined,
    abi: OracleAbi,
    functionName: 'depositedTokens',
    args: userAddress ? [userAddress] : undefined,
    query: { enabled: !!oracleAddress && !!userAddress }
  })

  const { data: lastSubmissionTimeData } = useReadContract({
    address: oracleAddress || undefined,
    abi: OracleAbi,
    functionName: 'lastSubmissionTime',
    query: { enabled: !!oracleAddress }
  })

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

  // Update real-time data when contract data changes
  useEffect(() => {
    if (depositedTokensData) {
      setUserDepositedTokens(formatEther(depositedTokensData as bigint))
    }
    if (userTokenBalanceData) {
      setUserTokenBalance(formatEther(userTokenBalanceData as bigint))
    }
    if (tokenAllowanceData) {
      setTokenAllowance(formatEther(tokenAllowanceData as bigint))
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
  }, [depositedTokensData, userTokenBalanceData, tokenAllowanceData, lastSubmissionTimeData])

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
    if (isConfirmed) {
      toast({
        title: "Transaction Confirmed",
        description: "Your transaction has been successfully processed!",
      })
      // Reset loading states
      setIsSubmitting(false)
      setIsDepositing(false)
      setIsWithdrawing(false)
      setIsVoting(false)
      setIsApproving(false)
      // Clear form inputs
      setSubmitValue("")
      setDepositAmount("")
      setWithdrawAmount("")
      setVoteTarget("")
    }
  }, [isConfirmed, toast])

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
      const amount = parseEther(depositAmount)
      
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

    const amount = parseEther(depositAmount)
    const allowance = parseEther(tokenAllowance)
    
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
      const amount = parseEther(withdrawAmount)
      
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

          {/* Oracle Address */}
          <div className="flex items-center gap-2 justify-center mb-8">
            <code className="text-sm bg-card/50 border border-primary/30 px-4 py-2 rounded-xl text-primary font-mono">
              {oracle.address}
            </code>
            <button
              onClick={() => navigator.clipboard.writeText(oracle.address)}
              className="text-muted-foreground hover:text-primary transition-colors p-2 hover:bg-card/50 rounded-lg border border-transparent hover:border-primary/30"
              title="Copy address"
            >
              <Copy className="h-4 w-4" />
            </button>
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
              <PriceChart />
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
                      onClick={() => {
                        toast({
                          title: "Latest Value Details",
                          description: `Current latest value: ${latestValue || "No data"}`,
                        })
                      }}
                    >
                      View
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
                      onClick={() => {
                        toast({
                          title: "Aggregated Value Details",
                          description: `Current aggregated value: ${aggregatedValue || "No data"}`,
                        })
                      }}
                    >
                      View
                    </Button>
                  </div>
                  
                  {/* User's deposited tokens info */}
                  {isConnected && (
                    <div className="flex items-center justify-between p-3 bg-card/50 border border-primary/30 rounded-xl transition-all duration-300">
                      <div className="flex items-center gap-3">
                        <Wallet className="h-4 w-4 text-primary" />
                        <span className="text-muted-foreground font-medium text-sm">Your Deposited</span>
                        <span className="text-foreground font-light">{parseFloat(userDepositedTokens).toFixed(4)} ETH</span>
                      </div>
                    </div>
                  )}
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
                    <div className="grid grid-cols-3 gap-3 p-3 bg-card/50 border border-primary/30 rounded-xl">
                      <div className="text-center">
                        <div className="text-xs text-muted-foreground mb-1">Balance</div>
                        <div className="text-sm font-light text-foreground">{parseFloat(userTokenBalance).toFixed(4)}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-muted-foreground mb-1">Approved</div>
                        <div className="text-sm font-light text-foreground">{parseFloat(tokenAllowance).toFixed(4)}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs text-muted-foreground mb-1">Deposited</div>
                        <div className="text-sm font-light text-primary font-medium">{parseFloat(userDepositedTokens).toFixed(4)}</div>
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
                  const amount = depositAmount ? parseEther(depositAmount) : BigInt(0)
                  const allowance = tokenAllowance ? parseEther(tokenAllowance) : BigInt(0)
                  const needsApproval = amount > allowance

                  if (needsApproval) {
                    return (
                      <Button 
                        onClick={handleApproveTokens} 
                        disabled={isApproving || isPending || isConfirming || !depositAmount || !isConnected}
                        className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground h-12 rounded-xl transition-all duration-300"
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
                  <div className="p-3 bg-card/50 border border-primary/30 rounded-xl mb-4">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-muted-foreground">Your Deposited Tokens</div>
                      <div className="text-lg font-light text-primary font-medium">{parseFloat(userDepositedTokens).toFixed(4)} ETH</div>
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
                    <span className="text-foreground font-light">1.5%</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-card/50 border border-primary/30 rounded-xl transition-all duration-300">
                    <span className="text-muted-foreground font-medium">Half Life</span>
                    <span className="text-foreground font-light">3600s</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-card/50 border border-primary/30 rounded-xl transition-all duration-300">
                    <span className="text-muted-foreground font-medium">Quorum</span>
                    <span className="text-foreground font-light">20%</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-card/50 border border-primary/30 rounded-xl transition-all duration-300">
                    <span className="text-muted-foreground font-medium">Deposit Lock</span>
                    <span className="text-foreground font-light">3600s</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-card/50 border border-primary/30 rounded-xl transition-all duration-300">
                    <span className="text-muted-foreground font-medium">Withdrawal Lock</span>
                    <span className="text-foreground font-light">3600s</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-card/50 border border-primary/30 rounded-xl transition-all duration-300">
                    <span className="text-muted-foreground font-medium">Alpha</span>
                    <span className="text-foreground font-light">1.0</span>
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