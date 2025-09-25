"use client"

import { notFound } from "next/navigation"
import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { PriceChart } from "@/components/price-chart"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { mockOracles } from "@/lib/mock-data"
import { ArrowLeft, Zap, Clock, TrendingUp, Copy } from "lucide-react"

interface InteractionClientProps {
  oracleId: string
}

export default function InteractionClient({ oracleId }: InteractionClientProps) {
  const oracle = mockOracles.find((o) => o.id === oracleId)

  if (!oracle) {
    notFound()
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      case "maintenance":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
      case "inactive":
        return "bg-red-500/10 text-red-500 border-red-500/20"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-6 pt-24 pb-12">
        {/* Back Button */}
       

        {/* Header */}
        <div className="mb-16 text-center max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <Link href="/explorer" className="inline-flex items-center text-muted-foreground hover:text-primary transition-colors">
              <ArrowLeft className="h-4 w-4 mr-2" />
              <span className="font-light">Back to Explorer</span>
            </Link>
            
            <div className="flex items-center gap-4">
              <h1 className="text-5xl font-bold tracking-tight bg-gradient-to-r from-white to-primary bg-clip-text text-transparent">
                {oracle.name}
              </h1>
              {oracle.status === 'active' && (
                <Badge className="bg-primary/10 text-primary border-primary/20 font-light">
                  Active
                </Badge>
              )}
            </div>
            
            {/* Spacer for balance */}
            <div className="w-32"></div>
          </div>
          <p className="text-xl text-muted-foreground/80 font-light text-white leading-relaxed mb-8">
            {oracle.description}
          </p>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Price Chart */}
          <div className="bg-card/30 backdrop-blur-sm border border-primary/20 rounded-2xl">
            <PriceChart />
          </div>

          {/* Key Stats */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="bg-card/30 backdrop-blur-sm border-primary/20 rounded-2xl text-center p-6">
              <div className="flex items-center justify-center mb-4">
                <Clock className="h-8 w-8 text-primary/80" />
              </div>
              <div className="text-2xl font-light text-primary mb-2">{oracle.updateFrequency}</div>
              <div className="text-sm text-muted-foreground font-light">Update Frequency</div>
            </Card>
            
            <Card className="bg-card/30 backdrop-blur-sm border-primary/20 rounded-2xl text-center p-6">
              <div className="flex items-center justify-center mb-4">
                <TrendingUp className="h-8 w-8 text-primary/80" />
              </div>
              <div className="text-2xl font-light text-primary mb-2">{oracle.accuracy}</div>
              <div className="text-sm text-muted-foreground font-light">Accuracy</div>
            </Card>

            <Card className="bg-card/30 backdrop-blur-sm border-primary/20 rounded-2xl text-center p-6">
              <div className="flex items-center justify-center mb-4">
                <Zap className="h-8 w-8 text-primary/80" />
              </div>
              <div className="text-2xl font-light text-primary mb-2">{oracle.price}</div>
              <div className="text-sm text-muted-foreground font-light">Subscription Price</div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}