"use client"

import { useState, useMemo } from "react"
import { OracleCard } from "@/components/oracle-card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useOracles } from "@/hooks/useOracles"
import { Search, X, RotateCcw, ArrowUpDown, Filter, SlidersHorizontal } from "lucide-react"
import dynamic from "next/dynamic"

const ParticleBackground = dynamic(() => import("@/components/ParticleBackground"), { ssr: false })

export default function UsePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState<"all" | "base" | "composed">("all")
  const [category, setCategory] = useState("all")
  const [status, setStatus] = useState("all")
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "name-asc" | "name-desc">("newest")
  const { oracles, loading, error } = useOracles()

  const filteredOracles = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()

    return oracles
      .filter((o) => {
        const matchSearch =
          !q ||
          [o.name, o.description, o.address, o.token, o.creator, o.feedA, o.feedB].some((v) =>
            v?.toLowerCase().includes(q)
          )
        const matchType =
          filterType === "all" || (filterType === "composed" ? !!o.isComposed : !o.isComposed)
        const matchCat =
          category === "all" ||
          o.category?.toLowerCase().includes(category) ||
          o.description?.toLowerCase().includes(category) ||
          o.name?.toLowerCase().includes(category)
        const matchStatus = status === "all" || o.status === status

        return matchSearch && matchType && matchCat && matchStatus
      })
      .sort((a, b) => {
        if (sortBy === "name-asc") return (a.name || "").localeCompare(b.name || "")
        if (sortBy === "name-desc") return (b.name || "").localeCompare(a.name || "")
        const tA = a.lastUpdated && a.lastUpdated !== "—" ? Date.parse(a.lastUpdated.replace(" UTC", "Z")) || 0 : 0
        const tB = b.lastUpdated && b.lastUpdated !== "—" ? Date.parse(b.lastUpdated.replace(" UTC", "Z")) || 0 : 0
        return sortBy === "oldest" ? tA - tB : tB - tA
      })
  }, [oracles, searchQuery, filterType, category, status, sortBy])

  const activeChips = [
    searchQuery && { label: `Search: "${searchQuery}"`, clear: () => setSearchQuery("") },
    filterType !== "all" && { label: `Type: ${filterType}`, clear: () => setFilterType("all") },
    category !== "all" && { label: `Category: ${category}`, clear: () => setCategory("all") },
    status !== "all" && { label: `Status: ${status}`, clear: () => setStatus("all") },
    sortBy !== "newest" && { label: `Sort: ${sortBy}`, clear: () => setSortBy("newest") },
  ].filter(Boolean) as { label: string; clear: () => void }[]

  const resetAll = () => {
    setSearchQuery("")
    setFilterType("all")
    setCategory("all")
    setStatus("all")
    setSortBy("newest")
  }

  return (
    <div className="min-h-screen bg-background font-sans text-foreground overflow-x-hidden selection:bg-primary/30 selection:text-white relative bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,#8b5cf606,transparent),linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:4rem_4rem]">
      <ParticleBackground />

      <div className="container mx-auto px-6 pt-36 pb-24 relative z-10 max-w-7xl">
        {/* Header */}
        <div className="mb-10 text-center space-y-4">
          <h1 className="text-4xl sm:text-5xl font-medium tracking-tight leading-tight text-white">
            Active Oracle Registry
          </h1>
          <p className="text-muted-foreground text-sm max-w-xl mx-auto leading-relaxed">
            Query cryptographic oracles, sync signatures, and monitor active consensus verified on‑chain.
          </p>
        </div>

        {/* Toolbar: Search & Filters */}
        <div className="mb-12 max-w-4xl mx-auto space-y-4">
          {/* Search Bar */}
          <div className="relative group bg-zinc-950/70 border border-white/10 rounded-full px-4 py-1 flex items-center transition-all duration-300 focus-within:border-primary/40 backdrop-blur-md shadow-xl">
            <Search className="h-4 w-4 text-muted-foreground ml-2 mr-2 opacity-55 shrink-0" />
            <Input
              placeholder="Search by name, description, contract (0x...) or token..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-white font-mono text-xs placeholder:text-muted-foreground/60 h-10 w-full"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="mr-2 text-muted-foreground hover:text-white cursor-pointer" aria-label="Clear search">
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Controls: Type Pills & Dropdown Filters */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-zinc-950/60 border border-white/5 p-2.5 rounded-2xl backdrop-blur-md">
            {/* Type Pills */}
            <div className="flex items-center gap-1.5 font-mono text-xs uppercase font-semibold">
              {(["all", "base", "composed"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setFilterType(t)}
                  className={`h-8 px-4 rounded-full border transition-all cursor-pointer ${
                    filterType === t
                      ? "bg-white text-black border-white shadow-sm font-bold"
                      : "bg-white/5 text-muted-foreground border-white/10 hover:text-white"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            {/* Select Dropdowns */}
            <div className="flex flex-wrap items-center gap-2">
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="h-8 px-3 rounded-full bg-zinc-900 border-white/10 text-white font-mono text-xs">
                  <Filter className="h-3 w-3 mr-1.5 opacity-60 text-primary" />
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-950 border-white/10 text-white font-mono text-xs">
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="price">Price Feed</SelectItem>
                  <SelectItem value="twap">TWAP</SelectItem>
                  <SelectItem value="governance">Governance / Custom</SelectItem>
                </SelectContent>
              </Select>

              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="h-8 px-3 rounded-full bg-zinc-900 border-white/10 text-white font-mono text-xs">
                  <SlidersHorizontal className="h-3 w-3 mr-1.5 opacity-60 text-primary" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-950 border-white/10 text-white font-mono text-xs">
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={(v: any) => setSortBy(v)}>
                <SelectTrigger className="h-8 px-3 rounded-full bg-zinc-900 border-white/10 text-white font-mono text-xs">
                  <ArrowUpDown className="h-3 w-3 mr-1.5 opacity-60 text-primary" />
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-950 border-white/10 text-white font-mono text-xs">
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="name-asc">Name (A → Z)</SelectItem>
                  <SelectItem value="name-desc">Name (Z → A)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Active Chips & Counter */}
          <div className="flex flex-wrap items-center justify-between gap-2 px-1 text-xs font-mono text-muted-foreground">
            <span>
              Showing <span className="text-white font-semibold">{filteredOracles.length}</span> of {oracles.length} feeds
            </span>

            {activeChips.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5">
                {activeChips.map((chip, idx) => (
                  <Badge key={idx} variant="outline" className="bg-white/5 border-white/10 text-zinc-300 font-mono text-[11px] px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <span>{chip.label}</span>
                    <button onClick={chip.clear} className="hover:text-white cursor-pointer" aria-label="Remove filter">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
                <button onClick={resetAll} className="text-primary hover:underline flex items-center gap-1 text-[11px] cursor-pointer ml-1">
                  <RotateCcw className="h-3 w-3" /> Clear all
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Oracle Grid / Skeleton / Error / Empty States */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-zinc-950/70 border border-white/10 rounded-3xl p-6 h-44 animate-pulse space-y-4">
                <div className="h-5 w-3/4 rounded bg-white/10" />
                <div className="h-3 w-full rounded bg-white/5" />
                <div className="h-3 w-2/3 rounded bg-white/5" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12 px-8 max-w-md mx-auto bg-zinc-950/70 border border-white/10 rounded-3xl backdrop-blur-md shadow-2xl space-y-3">
            <Search className="h-10 w-10 mx-auto text-red-500 opacity-60" />
            <h3 className="text-lg font-medium text-white">Consensus Error</h3>
            <p className="text-xs text-muted-foreground">{error}</p>
          </div>
        ) : filteredOracles.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {filteredOracles.map((oracle) => (
              <OracleCard key={oracle.id} oracle={oracle} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 px-8 max-w-md mx-auto bg-zinc-950/70 border border-white/10 rounded-3xl backdrop-blur-md shadow-2xl space-y-3">
            <Search className="h-10 w-10 mx-auto opacity-30 text-white" />
            <h3 className="text-lg font-medium text-white">{oracles.length === 0 ? "No Oracles" : "No matches found"}</h3>
            <p className="text-xs text-muted-foreground">
              {oracles.length === 0 ? "Be the first to deploy an oracle!" : "No oracles matched your active filters."}
            </p>
            <div className="pt-2">
              {oracles.length === 0 ? (
                <a href="/deploy" className="inline-flex px-5 py-2.5 rounded-full bg-white text-black font-mono text-[10px] font-bold tracking-wider hover:bg-zinc-200 transition-all">
                  Deploy Oracle
                </a>
              ) : (
                <button onClick={resetAll} className="px-5 py-2 rounded-full border border-white/10 bg-white/5 font-mono text-[10px] font-bold tracking-wider hover:bg-white/10 text-white cursor-pointer">
                  Clear all filters
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
