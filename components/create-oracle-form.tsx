"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Plus, X, Code, Zap } from "lucide-react"

const categories = [
  "Price Feeds",
  "Market Data",
  "Weather",
  "Commodities",
  "Randomness",
  "Sports",
  "IoT Sensors",
  "Custom",
]

const blockchains = ["Ethereum", "Polygon", "Arbitrum", "Optimism", "BSC", "Avalanche"]

const updateFrequencies = ["Real-time", "30 seconds", "1 minute", "5 minutes", "15 minutes", "1 hour", "On-demand"]

export function CreateOracleForm() {
  const [selectedChains, setSelectedChains] = useState<string[]>([])
  const [dataSources, setDataSources] = useState<string[]>([""])
  const [step, setStep] = useState(1)

  const addDataSource = () => {
    setDataSources([...dataSources, ""])
  }

  const removeDataSource = (index: number) => {
    setDataSources(dataSources.filter((_, i) => i !== index))
  }

  const updateDataSource = (index: number, value: string) => {
    const updated = [...dataSources]
    updated[index] = value
    setDataSources(updated)
  }

  const toggleChain = (chain: string) => {
    setSelectedChains((prev) => (prev.includes(chain) ? prev.filter((c) => c !== chain) : [...prev, chain]))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log("Oracle creation submitted")
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Step 1: Basic Information */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
              1
            </span>
            Basic Information
          </CardTitle>
          <CardDescription>Define the core details of your oracle</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Oracle Name *</Label>
              <Input id="name" placeholder="e.g., ETH/USD Price Feed" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select required>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
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

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              placeholder="Describe what data your oracle provides and how it works..."
              className="min-h-24"
              required
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="price">Subscription Price (ETH) *</Label>
              <Input id="price" type="number" step="0.001" placeholder="0.1" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="frequency">Update Frequency *</Label>
              <Select required>
                <SelectTrigger>
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  {updateFrequencies.map((freq) => (
                    <SelectItem key={freq} value={freq}>
                      {freq}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Step 2: Data Sources */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
              2
            </span>
            Data Sources
          </CardTitle>
          <CardDescription>Configure where your oracle gets its data from</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <Label>Data Source URLs *</Label>
            {dataSources.map((source, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={source}
                  onChange={(e) => updateDataSource(index, e.target.value)}
                  placeholder="https://api.example.com/data"
                  required
                />
                {dataSources.length > 1 && (
                  <Button type="button" variant="outline" size="icon" onClick={() => removeDataSource(index)}>
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button type="button" variant="outline" onClick={addDataSource} className="w-full bg-transparent">
              <Plus className="h-4 w-4 mr-2" />
              Add Data Source
            </Button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="aggregation">Data Aggregation Method</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select aggregation method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="median">Median</SelectItem>
                <SelectItem value="mean">Mean (Average)</SelectItem>
                <SelectItem value="weighted">Weighted Average</SelectItem>
                <SelectItem value="first">First Source</SelectItem>
                <SelectItem value="custom">Custom Logic</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Step 3: Blockchain Configuration */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
              3
            </span>
            Blockchain Configuration
          </CardTitle>
          <CardDescription>Choose which blockchains to deploy your oracle on</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <Label>Supported Blockchains *</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {blockchains.map((chain) => (
                <div key={chain} className="flex items-center space-x-2">
                  <Checkbox
                    id={chain}
                    checked={selectedChains.includes(chain)}
                    onCheckedChange={() => toggleChain(chain)}
                  />
                  <Label htmlFor={chain} className="text-sm font-normal cursor-pointer">
                    {chain}
                  </Label>
                </div>
              ))}
            </div>
            {selectedChains.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {selectedChains.map((chain) => (
                  <Badge key={chain} variant="secondary">
                    {chain}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <Separator />

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="gasLimit">Gas Limit</Label>
              <Input id="gasLimit" type="number" placeholder="100000" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmations">Required Confirmations</Label>
              <Input id="confirmations" type="number" placeholder="3" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Step 4: Advanced Settings */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
              4
            </span>
            Advanced Settings
          </CardTitle>
          <CardDescription>Optional configuration for advanced users</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="customCode">Custom Validation Code (Optional)</Label>
            <Textarea
              id="customCode"
              placeholder="// Add custom validation logic here
function validateData(data) {
  // Your validation logic
  return data > 0;
}"
              className="min-h-32 font-mono text-sm"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="minStake">Minimum Stake (ETH)</Label>
              <Input id="minStake" type="number" step="0.01" placeholder="1.0" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slashingRate">Slashing Rate (%)</Label>
              <Input id="slashingRate" type="number" step="0.1" placeholder="5.0" />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox id="publicAccess" />
            <Label htmlFor="publicAccess" className="text-sm font-normal">
              Make this oracle publicly accessible
            </Label>
          </div>
        </CardContent>
      </Card>

      {/* Submit Section */}
      <Card className="border-border bg-card">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
            <div className="text-sm text-muted-foreground">
              <p>
                Deployment fee: <span className="font-semibold">0.05 ETH</span>
              </p>
              <p>
                Estimated gas cost: <span className="font-semibold">~$25</span>
              </p>
            </div>
            <div className="flex gap-3">
              <Button type="button" variant="outline">
                <Code className="h-4 w-4 mr-2" />
                Preview Contract
              </Button>
              <Button type="submit" size="lg">
                <Zap className="h-4 w-4 mr-2" />
                Deploy Oracle
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}
