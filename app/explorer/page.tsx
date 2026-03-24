"use client"

import Link from "next/link"
import { useState, useMemo } from "react"
import { Navigation } from "@/components/navigation"
import { OracleCard } from "@/components/oracle-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useOracles } from "@/hooks/useOracles"
import { OracleFactories, getOracleChainLabel, supportedOracleChainIds } from "@/utils/addresses"
import { useAccount, useChainId } from "wagmi"
import { Search, Loader2, AlertTriangle, CheckCircle2 } from "lucide-react"

export default function ExplorerPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const { oracles, loading, error } = useOracles()
  const { isConnected } = useAccount()
  const chainId = useChainId()
  const supportedChainLabel = getOracleChainLabel(chainId)
  const isSupportedChain = Boolean(OracleFactories[chainId as keyof typeof OracleFactories])
  const supportedNetworksLabel = supportedOracleChainIds
    .map((id) => getOracleChainLabel(id) ?? `Chain ${id}`)
    .join(", ")

  const filteredOracles = useMemo(() => {
    return oracles.filter((oracle) => {
      const matchesSearch =
        oracle.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        oracle.description.toLowerCase().includes(searchQuery.toLowerCase())

      return matchesSearch && oracle.status === "active"
    })
  }, [oracles, searchQuery])

  return (
    <div className="min-h-screen bg-background font-[oblique] tracking-wide" style={{ fontStyle: 'oblique 12deg' }}>
      <Navigation />

      <div className="container mx-auto px-6 pt-24 pb-12">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-medium tracking-wide mb-6 bg-gradient-to-r from-white to-primary bg-clip-text text-transparent" style={{ fontStyle: 'oblique 15deg' }}>
            Orb Oracle Explorer
          </h1>
        </div>

        <div className="mb-10 max-w-4xl mx-auto rounded-2xl border border-primary/20 bg-card/30 backdrop-blur-sm p-5">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-primary/15 bg-card/40 p-4">
              <div className="mb-2 text-xs uppercase tracking-wide text-muted-foreground">Network Status</div>
              <div className="flex items-start gap-3">
                {isSupportedChain ? (
                  <CheckCircle2 className="mt-0.5 h-5 w-5 text-primary" />
                ) : (
                  <AlertTriangle className="mt-0.5 h-5 w-5 text-amber-400" />
                )}
                <div>
                  <div className="font-medium text-foreground">
                    {isSupportedChain ? `Ready on ${supportedChainLabel}` : "Unsupported network for Orb Oracle"}
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {isSupportedChain
                      ? "The connected network has an Orb Oracle factory configured, so deployed feeds can be discovered here."
                      : `Switch to a supported network to load deployed oracles. Supported: ${supportedNetworksLabel}.`}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-primary/15 bg-card/40 p-4">
              <div className="mb-2 text-xs uppercase tracking-wide text-muted-foreground">Wallet Status</div>
              <div className="font-medium text-foreground">
                {isConnected ? "Wallet connected" : "Wallet not connected"}
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                {isConnected
                  ? "You can browse available oracles and open their interaction dashboards."
                  : "Connect a wallet to browse the correct network and create a new oracle if none are deployed yet."}
              </p>
            </div>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="mb-12 max-w-2xl mx-auto">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground opacity-0 group-focus-within:opacity-100 transition-opacity duration-300" />
            <Input
              placeholder="Search by oracle name or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-12 bg-card/50 border border-primary/30 rounded-xl font-light transition-all duration-300 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 focus:bg-card/70 pl-4 focus:pl-12 group-focus-within:scale-105"
            />
          </div>
        </div>

        {/* Oracle Grid */}
        {loading ? (
          <div className="text-center py-20">
            <Loader2 className="h-16 w-16 mx-auto mb-6 animate-spin text-primary" />
            <p className="text-xl font-light text-slate-200 mb-8">
              Loading oracles from blockchain...
            </p>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <div className="text-red-500 mb-6">
              <AlertTriangle className="h-16 w-16 mx-auto mb-4 opacity-70" />
            </div>
            <p className="text-xl font-light text-red-400 mb-8">
              {error}
            </p>
            <p className="text-sm text-slate-400 mb-4">
              {isSupportedChain
                ? "The factory or oracle query failed on this network. Try refreshing after confirming the contract deployment."
                : `Switch to a supported network first. Supported networks: ${supportedNetworksLabel}.`}
            </p>
            <Button asChild variant="outline" className="border-primary/30 hover:bg-primary/10">
              <Link href="/create">Open Create Flow</Link>
            </Button>
          </div>
        ) : filteredOracles.length > 0 ? (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {filteredOracles.map((oracle) => (
              <OracleCard key={oracle.id} oracle={oracle} />
            ))}
          </div>
        ) : oracles.length === 0 ? (
          <div className="text-center py-20">
            <Search className="h-16 w-16 mx-auto mb-6 opacity-30" />
            <p className="text-xl font-light text-slate-200 mb-8">
              No oracles deployed yet
            </p>
            <p className="text-sm text-slate-400 mb-8">
              Connect a supported wallet and launch the first oracle for this network.
            </p>
            <Button asChild variant="outline" className="border-primary/30 hover:bg-primary/10">
              <Link href="/create">Create Oracle</Link>
            </Button>
          </div>
        ) : (
          <div className="text-center py-20">
            <Search className="h-16 w-16 mx-auto mb-6 opacity-30" />
            <p className="text-xl font-light text-slate-200 mb-8">
              No oracles match your search
            </p>
            <button
              onClick={() => {
                setSearchQuery("")
              }}
              className="text-primary hover:text-primary/80 transition-colors font-medium"
            >
              Clear search
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
