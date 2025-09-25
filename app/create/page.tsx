import { Navigation } from "@/components/navigation"
import { CreateOracleForm } from "@/components/create-oracle-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Zap, Shield, Database, Clock } from "lucide-react"

export default function CreatePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Create Your Oracle</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Deploy a custom oracle to connect real-world data to blockchain applications
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-3">
            <CreateOracleForm />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Benefits */}
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-lg">Why Create an Oracle?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Zap className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">Monetize Data</h4>
                    <p className="text-xs text-muted-foreground">Earn fees from every data request</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Shield className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">Secure & Reliable</h4>
                    <p className="text-xs text-muted-foreground">Built-in validation and redundancy</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Database className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">Multi-Chain</h4>
                    <p className="text-xs text-muted-foreground">Deploy across multiple blockchains</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">Real-time Updates</h4>
                    <p className="text-xs text-muted-foreground">Configurable update frequencies</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Popular Categories */}
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-lg">Popular Categories</CardTitle>
                <CardDescription>Most requested oracle types</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="text-xs">
                    Price Feeds
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    Weather
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    Sports
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    Randomness
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    IoT Sensors
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    Market Data
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Deployment Info */}
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-lg">Deployment Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Base Fee:</span>
                  <span className="font-semibold">0.05 ETH</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Gas Estimate:</span>
                  <span className="font-semibold">~$25</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Deploy Time:</span>
                  <span className="font-semibold">2-5 minutes</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Revenue Share:</span>
                  <span className="font-semibold">95% to you</span>
                </div>
              </CardContent>
            </Card>

            {/* Support */}
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-lg">Need Help?</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <p className="text-muted-foreground">Check our documentation or join our Discord for support.</p>
                <div className="flex flex-col gap-2">
                  <a href="#" className="text-primary hover:underline">
                    View Documentation
                  </a>
                  <a href="#" className="text-primary hover:underline">
                    Join Discord
                  </a>
                  <a href="#" className="text-primary hover:underline">
                    Example Oracles
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
