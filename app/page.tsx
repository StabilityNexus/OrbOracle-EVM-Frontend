import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Navigation } from "@/components/navigation"
import { ArrowRight, Database, Shield, Zap, Users, TrendingUp, Lock, Coins, CheckCircle2, XCircle } from "lucide-react"
import Orb from "@/components/Orb"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background font-[oblique] tracking-wide" style={{ fontStyle: 'oblique 12deg' }}>
      {/* <SplashCursor /> */}
      <Navigation />

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div style={{ 
            width: '100vw', 
            height: '100vh', 
            position: 'absolute', 
            top: '0', 
            left: '0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <div style={{ 
              width: 'min(90vw, 90vh)', 
              height: 'min(90vw, 90vh)', 
              maxWidth: '800px',
              maxHeight: '800px'
            }}>
              <Orb
                hoverIntensity={1.7}
                rotateOnHover={true}
                hue={300}
                forceHoverState={false}
              />
            </div>
          </div>
        </div>
        <div className="container mx-auto px-4 text-center z-10 relative">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-medium mb-8 text-balance tracking-wide" style={{ fontStyle: 'oblique 15deg' }}>
              Orb Oracle: 
              <div><span className="text-primary">The Price of Everything</span></div>
            </h1>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="text-lg px-8 bg-white text-black hover:bg-gray-100">
                <Link href="/create">
                  Get Started
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg px-8 bg-transparent border-gray-600 text-gray-400 hover:bg-gray-800">
                <Link href="/explorer">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="min-h-screen flex items-center justify-center py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-medium mb-4 tracking-wide" style={{ fontStyle: 'oblique 15deg' }}>How Does Our Protocol Work?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A decentralized oracle network powered by token-weighted consensus and time-decay mechanisms
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto mb-12">
            <Card className="border-border bg-card">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>1. Token-Weighted Voting</CardTitle>
                <CardDescription>
                  Participants stake ERC20 tokens to gain voting weight. More tokens = more influence on oracle outcomes.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border bg-card">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>2. EWMA Consensus</CardTitle>
                <CardDescription>
                  Exponentially Weighted Moving Average with configurable half-life ensures recent data has more weight than old data.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border bg-card">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Lock className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>3. Quorum & Locking</CardTitle>
                <CardDescription>
                  Minimum participation thresholds and time-locked deposits prevent manipulation and ensure security.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border bg-card">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Coins className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>4. Reward Distribution</CardTitle>
                <CardDescription>
                  Participants are rewarded based on their contribution and accuracy, incentivizing honest reporting.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="border-border bg-card/50">
              <CardContent className="p-8">
                <h3 className="text-2xl font-medium mb-4 tracking-wide" style={{ fontStyle: 'oblique 12deg' }}>The Complete Flow</h3>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    <strong className="text-foreground">Step 1:</strong> Oracle creators deploy contracts with custom parameters (quorum, reward rate, half-life, etc.)
                  </p>
                  <p>
                    <strong className="text-foreground">Step 2:</strong> Data providers stake tokens and submit price/value data to the oracle
                  </p>
                  <p>
                    <strong className="text-foreground">Step 3:</strong> The protocol aggregates submissions using EWMA, weighted by token stake
                  </p>
                  <p>
                    <strong className="text-foreground">Step 4:</strong> Once quorum is reached, the consensus value is finalized on-chain
                  </p>
                  <p>
                    <strong className="text-foreground">Step 5:</strong> Accurate participants receive rewards from the oracle's reward pool
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Better Section */}
      <section className="min-h-screen flex items-center justify-center py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-medium mb-4 tracking-wide" style={{ fontStyle: 'oblique 15deg' }}>Why Is Our Protocol Better?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Comparing OrbOracle to traditional oracle solutions
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    OrbOracle Advantages
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                    <div>
                      <strong>Decentralized Governance:</strong> Token-weighted voting ensures no single point of control
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                    <div>
                      <strong>Time-Decay Mechanism:</strong> EWMA automatically reduces weight of stale data
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                    <div>
                      <strong>Configurable Parameters:</strong> Each oracle can be customized for specific use cases
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                    <div>
                      <strong>Economic Security:</strong> Locking periods and quorum requirements prevent attacks
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                    <div>
                      <strong>Multi-Chain Support:</strong> Deploy on Ethereum, Base, BSC, Scroll, and more
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                    <div>
                      <strong>Permissionless:</strong> Anyone can create an oracle or participate as a data provider
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <XCircle className="h-5 w-5 text-red-500" />
                    Traditional Oracle Limitations
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-2">
                    <XCircle className="h-4 w-4 text-red-500 mt-1 flex-shrink-0" />
                    <div>
                      <strong>Centralized Control:</strong> Single entities or small groups control data feeds
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <XCircle className="h-4 w-4 text-red-500 mt-1 flex-shrink-0" />
                    <div>
                      <strong>Static Data:</strong> No mechanism to reduce weight of outdated information
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <XCircle className="h-4 w-4 text-red-500 mt-1 flex-shrink-0" />
                    <div>
                      <strong>One-Size-Fits-All:</strong> Limited customization options for different use cases
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <XCircle className="h-4 w-4 text-red-500 mt-1 flex-shrink-0" />
                    <div>
                      <strong>Vulnerable to Manipulation:</strong> Lack of economic security mechanisms
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <XCircle className="h-4 w-4 text-red-500 mt-1 flex-shrink-0" />
                    <div>
                      <strong>Chain-Specific:</strong> Often limited to single blockchain networks
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <XCircle className="h-4 w-4 text-red-500 mt-1 flex-shrink-0" />
                    <div>
                      <strong>Permissioned:</strong> Requires approval or whitelisting to participate
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="border-primary/30 bg-card/50">
              <CardContent className="p-8">
                <h3 className="text-2xl font-medium mb-4 tracking-wide" style={{ fontStyle: 'oblique 12deg' }}>Key Differentiators</h3>
                <div className="grid md:grid-cols-3 gap-6">
                  <div>
                    <div className="text-3xl font-medium text-primary mb-2">EWMA</div>
                    <p className="text-sm text-muted-foreground">
                      Our Exponentially Weighted Moving Average automatically handles time-decay, ensuring recent data has more influence than outdated information.
                    </p>
                  </div>
                  <div>
                    <div className="text-3xl font-medium text-primary mb-2">Quorum</div>
                    <p className="text-sm text-muted-foreground">
                      Configurable participation thresholds ensure consensus is reached with sufficient stakeholder engagement.
                    </p>
                  </div>
                  <div>
                    <div className="text-3xl font-medium text-primary mb-2">Flexible</div>
                    <p className="text-sm text-muted-foreground">
                      Every oracle can be customized with its own parameters, making it suitable for any data type or use case.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="h-screen flex items-center justify-center">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-medium mb-6 tracking-wide" style={{ fontStyle: 'oblique 15deg' }}>Ready to build the future?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of developers building the next generation of decentralized applications
            </p>
            <Button asChild size="lg" className="text-lg px-8">
              <Link href="/create">
                Get Started <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
