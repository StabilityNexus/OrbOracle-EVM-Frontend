import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Navigation } from "@/components/navigation"
import { ArrowRight, Database, Shield, Zap } from "lucide-react"
import Orb from "@/components/Orb"

export default function HomePage() {
  return (
    <div
      className="min-h-screen bg-background font-[oblique] tracking-wide"
      style={{ fontStyle: "oblique" }}
    >
      <Navigation />

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div
            style={{
              width: "100vw",
              height: "100vh",
              position: "absolute",
              top: "0",
              left: "0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: "min(90vw, 90vh)",
                height: "min(90vw, 90vh)",
                maxWidth: "800px",
                maxHeight: "800px",
              }}
            >
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
            <h1
              className="text-3xl sm:text-4xl md:text-5xl font-medium mb-6 sm:mb-8 text-balance tracking-wide px-4"
              style={{ fontStyle: "oblique" }}
            >
              Orb Oracle:
              <div>
                <span className="text-primary">The Price of Everything</span>
              </div>
            </h1>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
              <Button
                asChild
                size="lg"
                className="text-lg px-8 bg-white text-black hover:bg-gray-100"
              >
                <Link href="/create">Get Started</Link>
              </Button>

              <Button
                asChild
                variant="outline"
                size="lg"
                className="text-lg px-8 bg-transparent border-gray-600 text-gray-400 hover:bg-gray-800"
              >
                <Link href="/explorer">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="h-screen flex items-center justify-center">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 sm:mb-16 px-4">
            <h2
              className="text-2xl sm:text-3xl md:text-4xl font-medium mb-4 tracking-wide"
              style={{ fontStyle: "oblique" }}
            >
              Why choose OrbOracle?
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
              Enterprise-grade infrastructure for the next generation of decentralized applications
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto px-4">
            <Card className="border-border bg-card">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Lightning Fast</CardTitle>
                <CardDescription>
                  Sub-second data feeds with reliable performance for mission-critical applications.
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
                  Decentralized validation and cryptographic guarantees ensure data integrity.
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
                  Aggregates verified off-chain data sources for seamless on-chain access.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Protocol Overview Section */}
      <section className="h-screen flex items-center justify-center">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 px-4">
            <div className="space-y-3">
              <h3 className="text-xl font-semibold">What OrbOracle Is</h3>
              <p className="text-sm text-muted-foreground">
                OrbOracle is a decentralized oracle network that delivers accurate and verifiable
                off-chain data to smart contracts without relying on centralized providers.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-xl font-semibold">How It Works</h3>
              <p className="text-sm text-muted-foreground">
                Data is sourced from multiple providers, validated through decentralized mechanisms,
                and securely published on-chain for transparent smart contract usage.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-xl font-semibold">Why It’s Better</h3>
              <p className="text-sm text-muted-foreground">
                By prioritizing transparency, cryptographic verification, and low latency, OrbOracle
                enables developers to build trust-minimized decentralized applications.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="h-screen flex items-center justify-center">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto px-4">
            <h2
              className="text-2xl sm:text-3xl md:text-4xl font-medium mb-4 sm:mb-6 tracking-wide"
              style={{ fontStyle: "oblique" }}
            >
              Ready to build the future?
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground mb-6 sm:mb-8">
              Join developers building the next generation of decentralized applications.
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
