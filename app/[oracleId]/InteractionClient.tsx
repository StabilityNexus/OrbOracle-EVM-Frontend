"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { PriceChart } from "@/components/price-chart"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useOracle } from "@/hooks/useOracles"
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
  Database
} from "lucide-react"

function isHexAddress(value: string | null): value is `0x${string}` {
  return !!value && /^0x[a-fA-F0-9]{40}$/.test(value)
}

export default function OracleInteractionPage() {
  const search = useSearchParams()
  const oracleParam = search.get("oracle")
  const chainIdParam = search.get("chainId")

  // Form states
  const [submitValue, setSubmitValue] = useState("")
  const [depositAmount, setDepositAmount] = useState("")
  const [withdrawAmount, setWithdrawAmount] = useState("")
  const [voteTarget, setVoteTarget] = useState("")
  const [loading, setLoading] = useState(false)

  const oracleAddress = isHexAddress(oracleParam) ? (oracleParam as `0x${string}`) : null
  const chainId = chainIdParam ? Number(chainIdParam) : undefined
  const chainIdValid = chainId !== undefined && Number.isFinite(chainId) && chainId > 0

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

  const { oracle, loading: oracleLoading, error } = useOracle(oracleAddress, chainId)

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

  if (error || !oracle) {
    return (
      <div className="min-h-screen bg-background font-[oblique] tracking-wide" style={{ fontStyle: 'oblique 12deg' }}>
        <Navigation />
        <div className="container mx-auto px-6 pt-24 pb-12">
          <div className="text-center py-20">
            <div className="text-red-400 mb-6">
              <TrendingUp className="h-16 w-16 mx-auto mb-4 opacity-50" />
            </div>
            <p className="text-xl text-red-400 mb-2 font-medium">{error || "Oracle not found"}</p>
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

  const handleSubmitValue = async () => {
    setLoading(true)
    try {
      // TODO: Implement contract interaction
      console.log("Submitting value:", submitValue)
      // Add actual contract call here
    } catch (error) {
      console.error("Error submitting value:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDepositTokens = async () => {
    setLoading(true)
    try {
      // TODO: Implement contract interaction
      console.log("Depositing tokens:", depositAmount)
      // Add actual contract call here
    } catch (error) {
      console.error("Error depositing tokens:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleWithdrawTokens = async () => {
    setLoading(true)
    try {
      // TODO: Implement contract interaction
      console.log("Withdrawing tokens:", withdrawAmount)
      // Add actual contract call here
    } catch (error) {
      console.error("Error withdrawing tokens:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleVoteBlacklist = async () => {
    setLoading(true)
    try {
      // TODO: Implement contract interaction
      console.log("Voting to blacklist:", voteTarget)
      // Add actual contract call here
    } catch (error) {
      console.error("Error voting:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleVoteWhitelist = async () => {
    setLoading(true)
    try {
      // TODO: Implement contract interaction
      console.log("Voting to whitelist:", voteTarget)
      // Add actual contract call here
    } catch (error) {
      console.error("Error voting:", error)
    } finally {
      setLoading(false)
    }
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
              <h1 className="text-4xl sm:text-5xl font-bold tracking-wide bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent" style={{ fontStyle: 'oblique 15deg' }}>
                {oracle.name ?? "Oracle Dashboard"}
              </h1>
              {oracle.status === "active" && (
                <Badge className="bg-primary/10 text-primary border-primary/20 font-medium">Active</Badge>
              )}
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
          <Card className="border-border/50 bg-card/30 backdrop-blur-sm hover:bg-card/60 hover:border-primary/20 transition-all duration-300 rounded-2xl">
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
            <Card className="border-border/50 bg-card/30 backdrop-blur-sm hover:bg-card/60 hover:border-primary/20 transition-all duration-300 rounded-2xl">
              <CardHeader className="border-b border-border/30">
                <CardTitle className="text-foreground flex items-center gap-2 font-medium">
                  <Send className="h-5 w-5 text-primary" />
                  Submit Price Value
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Submit a new price value to the oracle. You must have deposited tokens to participate.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="submitValue" className="text-foreground font-medium">Price Value</Label>
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
                  disabled={loading || !submitValue}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground border-primary/50 h-12 rounded-xl transition-all duration-300"
                >
                  {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Send className="h-4 w-4 mr-2" />}
                  Submit Value
                </Button>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-card/30 backdrop-blur-sm hover:bg-card/60 hover:border-primary/20 transition-all duration-300 rounded-2xl">
              <CardHeader className="border-b border-border/30">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-foreground flex items-center gap-2 font-medium">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    Current Values
                  </CardTitle>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>2 min ago</span>
                  </div>
                </div>
                <CardDescription className="text-muted-foreground">
                  Latest submitted and aggregated oracle values.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-card/50 border border-primary/30 rounded-xl transition-all duration-300">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                      <span className="text-muted-foreground font-medium text-sm">Latest Value</span>
                      <span className="text-foreground font-light">{oracle.price ?? "$2,450"}</span>
                    </div>
                    <Button 
                      size="sm"
                      variant="outline"
                      className="h-8 px-3 text-xs border-primary/30 text-primary hover:bg-primary/10 hover:border-primary/50 transition-all duration-300"
                    >
                      View
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-card/50 border border-primary/30 rounded-xl transition-all duration-300">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-primary/60 rounded-full"></div>
                      <span className="text-muted-foreground font-medium text-sm">Aggregated</span>
                      <span className="text-foreground font-light">{oracle.price ?? "$2,450"}</span>
                    </div>
                    <Button 
                      size="sm"
                      variant="outline"
                      className="h-8 px-3 text-xs border-primary/30 text-primary hover:bg-primary/10 hover:border-primary/50 transition-all duration-300"
                    >
                      View
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Token Management Section */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-border/50 bg-card/30 backdrop-blur-sm hover:bg-card/60 hover:border-primary/20 transition-all duration-300 rounded-2xl">
              <CardHeader className="border-b border-border/30">
                <CardTitle className="text-foreground flex items-center gap-2 font-medium">
                  <Wallet className="h-5 w-5 text-primary" />
                  Deposit Tokens
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Deposit weight tokens to participate in oracle governance and earn rewards.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="depositAmount" className="text-foreground font-medium">Amount</Label>
                  <Input
                    id="depositAmount"
                    type="number"
                    placeholder="Enter amount to deposit"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    className="h-12 bg-card/50 border border-primary/30 rounded-xl font-light transition-all duration-300 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 focus:bg-card/70"
                  />
                </div>
                <Button 
                  onClick={handleDepositTokens} 
                  disabled={loading || !depositAmount}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-12 rounded-xl transition-all duration-300"
                >
                  {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Wallet className="h-4 w-4 mr-2" />}
                  Deposit Tokens
                </Button>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-card/30 backdrop-blur-sm hover:bg-card/60 hover:border-primary/20 transition-all duration-300 rounded-2xl">
              <CardHeader className="border-b border-border/30">
                <CardTitle className="text-foreground flex items-center gap-2 font-medium">
                  <Wallet className="h-5 w-5 text-destructive" />
                  Withdraw Tokens
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  Withdraw your deposited tokens. Note the withdrawal locking period.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="withdrawAmount" className="text-foreground font-medium">Amount</Label>
                  <Input
                    id="withdrawAmount"
                    type="number"
                    placeholder="Enter amount to withdraw"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    className="h-12 bg-card/50 border border-primary/30 rounded-xl font-light transition-all duration-300 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 focus:bg-card/70"
                  />
                </div>
                <Button 
                  onClick={handleWithdrawTokens} 
                  disabled={loading || !withdrawAmount}
                  className="w-full bg-destructive hover:bg-destructive/90 text-destructive-foreground h-12 rounded-xl transition-all duration-300"
                >
                  {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Wallet className="h-4 w-4 mr-2" />}
                  Withdraw Tokens
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Governance Section */}
          <Card className="border-border/50 bg-card/30 backdrop-blur-sm hover:bg-card/60 hover:border-primary/20 transition-all duration-300 rounded-2xl">
            <CardHeader className="border-b border-border/30">
              <CardTitle className="text-foreground flex items-center gap-2 font-medium">
                <Vote className="h-5 w-5 text-primary" />
                Governance Voting
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Vote to blacklist or whitelist addresses. Your voting power is based on your deposited tokens.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="voteTarget" className="text-foreground font-medium">Target Address</Label>
                <Input
                  id="voteTarget"
                  placeholder="0x..."
                  value={voteTarget}
                  onChange={(e) => setVoteTarget(e.target.value)}
                  className="h-12 bg-card/50 border border-primary/30 rounded-xl font-light transition-all duration-300 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 focus:bg-card/70"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Button 
                  onClick={handleVoteBlacklist} 
                  disabled={loading || !voteTarget}
                  className="bg-destructive hover:bg-destructive/90 text-destructive-foreground h-12 rounded-xl transition-all duration-300"
                >
                  {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Shield className="h-4 w-4 mr-2" />}
                  Vote Blacklist
                </Button>
                <Button 
                  onClick={handleVoteWhitelist} 
                  disabled={loading || !voteTarget}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground h-12 rounded-xl transition-all duration-300"
                >
                  {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Shield className="h-4 w-4 mr-2" />}
                  Vote Whitelist
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Oracle Configuration */}
          <Card className="border-border/50 bg-card/30 backdrop-blur-sm hover:bg-card/60 hover:border-primary/20 transition-all duration-300 rounded-2xl">
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
          <Card className="border-border/50 bg-card/30 backdrop-blur-sm hover:bg-card/60 hover:border-primary/20 transition-all duration-300 rounded-2xl">
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