import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Navigation } from "@/components/navigation"
import { ArrowRight, Database, Shield, Zap } from "lucide-react"
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

      {/* Features Section */}
      <section className="h-screen flex items-center justify-center">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-medium mb-4 tracking-wide" style={{ fontStyle: 'oblique 15deg' }}>Why choose OracleNet?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Enterprise-grade infrastructure for the next generation of decentralized applications
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="border-border bg-card">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Lightning Fast</CardTitle>
                <CardDescription>
                  Sub-second data feeds with 99.9% uptime guarantee for mission-critical applications
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border bg-card">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Secure & Reliable</CardTitle>
                <CardDescription>
                  Multi-signature validation and cryptographic proofs ensure data integrity
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border bg-card">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Database className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Rich Data Sources</CardTitle>
                <CardDescription>
                  Connect to thousands of APIs, IoT devices, and real-world data providers
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* How Orb Oracle Works Section */}
      <section className="h-screen flex items-center justify-center">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-medium mb-4 tracking-wide" style={{ fontStyle: 'oblique 15deg' }}>How Orb Oracle Works</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Orb Oracle securely bridges real-world data to the blockchain through a decentralized process.
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8">
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <span className="text-primary font-bold">1</span>
                </div>
                <h3 className="text-lg font-medium mb-2">Data Fetching</h3>
                <p className="text-sm text-muted-foreground">Off-chain data is collected from reliable sources.</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <span className="text-primary font-bold">2</span>
                </div>
                <h3 className="text-lg font-medium mb-2">Validation</h3>
                <p className="text-sm text-muted-foreground">Decentralized validators verify data integrity.</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <span className="text-primary font-bold">3</span>
                </div>
                <h3 className="text-lg font-medium mb-2">Aggregation</h3>
                <p className="text-sm text-muted-foreground">Validated data is aggregated for consensus.</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <span className="text-primary font-bold">4</span>
                </div>
                <h3 className="text-lg font-medium mb-2">Publishing</h3>
                <p className="text-sm text-muted-foreground">Data is published on-chain for smart contracts.</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <span className="text-primary font-bold">5</span>
                </div>
                <h3 className="text-lg font-medium mb-2">Consumption</h3>
                <p className="text-sm text-muted-foreground">Smart contracts consume the data for automated actions.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Orb Oracle Section */}
      <section className="h-screen flex items-center justify-center">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-medium mb-4 tracking-wide" style={{ fontStyle: 'oblique 15deg' }}>Why Orb Oracle?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Built for the decentralized future with key advantages that set it apart.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle>Decentralization</CardTitle>
                <CardDescription>
                  Eliminates single points of failure with a network of independent validators.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle>Transparency</CardTitle>
                <CardDescription>
                  All data submissions and validations are publicly verifiable on-chain.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle>EVM Compatibility</CardTitle>
                <CardDescription>
                  Seamlessly integrates with Ethereum and all EVM-compatible blockchains.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle>Developer-Friendly</CardTitle>
                <CardDescription>
                  Simple APIs and tools make integration easy for any developer.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle>DeFi Ready</CardTitle>
                <CardDescription>
                  Optimized for decentralized finance applications requiring reliable price feeds.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle>Automation Support</CardTitle>
                <CardDescription>
                  Enables smart contracts to trigger actions based on real-world data automatically.
                </CardDescription>
              </CardHeader>
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
