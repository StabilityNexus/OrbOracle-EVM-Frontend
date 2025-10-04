"use client"

import { useState, useMemo } from "react"
import { Navigation } from "@/components/navigation"
import { OracleCard } from "@/components/oracle-card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useOracles } from "@/hooks/useOracles"
import { Search, Loader2 } from "lucide-react"

export default function ExplorerPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All Categories")
  const { oracles, loading, error } = useOracles()
  
  const categories = ["All Categories", "Price Feed", "Weather", "Sports", "Custom"]

  const filteredOracles = useMemo(() => {
    return oracles.filter((oracle) => {
      const matchesSearch =
        oracle.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        oracle.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        oracle.category.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesCategory = selectedCategory === "All Categories" || oracle.category === selectedCategory
      
      return matchesSearch && matchesCategory && oracle.status === "active"
    })
  }, [oracles, searchQuery, selectedCategory])

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

        {/* Search & Filter */}
        <div className="mb-12 max-w-2xl mx-auto">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1 group">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground opacity-0 group-focus-within:opacity-100 transition-opacity duration-300" />
              <Input
                placeholder="Search oracles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-12 bg-card/50 border border-primary/30 rounded-xl font-light transition-all duration-300 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 focus:bg-card/70 pl-4 focus:pl-12 group-focus-within:scale-105"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-48 h-12 bg-card/50 border border-primary/30 rounded-xl transition-all duration-300 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 focus:bg-card/70">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
              <Search className="h-16 w-16 mx-auto mb-4 opacity-50" />
            </div>
            <p className="text-xl font-light text-red-400 mb-8">
              {error}
            </p>
            <p className="text-sm text-slate-400 mb-4">
              Make sure you're connected to the correct network and the Oracle Factory is deployed.
            </p>
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
              Be the first to create an oracle on this network!
            </p>
            <a
              href="/create"
              className="text-primary hover:text-primary/80 transition-colors font-medium"
            >
              Create Oracle
            </a>
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
                setSelectedCategory("All Categories")
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
