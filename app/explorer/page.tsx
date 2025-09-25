"use client"

import { useState, useMemo } from "react"
import { Navigation } from "@/components/navigation"
import { OracleCard } from "@/components/oracle-card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { mockOracles, categories, chains } from "@/lib/mock-data"
import { Search } from "lucide-react"

export default function ExplorerPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All Categories")

  const filteredOracles = useMemo(() => {
    return mockOracles.filter((oracle) => {
      const matchesSearch =
        oracle.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        oracle.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        oracle.category.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesCategory = selectedCategory === "All Categories" || oracle.category === selectedCategory
      
      return matchesSearch && matchesCategory && oracle.status === "active"
    })
  }, [searchQuery, selectedCategory])

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-6 pt-24 pb-12">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-bold tracking-tight mb-6 bg-gradient-to-r from-white to-primary bg-clip-text text-transparent">
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
        {filteredOracles.length > 0 ? (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {filteredOracles.map((oracle) => (
              <OracleCard key={oracle.id} oracle={oracle} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <Search className="h-16 w-16 mx-auto mb-6 opacity-30" />
            <p className="text-xl font-light text-muted-foreground mb-8">
              No active oracles found
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
