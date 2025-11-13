import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Navigation } from "@/components/navigation";
import { ArrowRight, Database, Shield, Zap } from "lucide-react";
import Orb from "@/components/Orb";

// StepArrow component
const StepArrow = () => (
  <div className="hidden md:block absolute right-[-80px] top-[34px]">
    <svg width="150" height="24" viewBox="0 0 150 24" fill="none">
      <path
        d="M0 12 H140 L130 4 M140 12 L130 20"
        stroke="rgb(147,197,253)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </div>
);

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background font-[oblique] tracking-wide" style={{ fontStyle: "oblique 12deg" }}>
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
              <Orb hoverIntensity={1.7} rotateOnHover={true} hue={300} forceHoverState={false} />
            </div>
          </div>
        </div>
        <div className="container mx-auto px-4 text-center z-10 relative">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-medium mb-8 text-balance tracking-wide" style={{ fontStyle: "oblique 15deg" }}>
              Orb Oracle:
              <div>
                <span className="text-primary">The Price of Everything</span>
              </div>
            </h1>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="text-lg px-8 bg-white text-black hover:bg-gray-100">
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
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-medium mb-4 tracking-wide" style={{ fontStyle: "oblique 15deg" }}>
              Why choose OracleNet?
            </h2>
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

      {/* How Orb Oracle Works */}
      <section className="py-28 bg-background text-center">
        <div className="container mx-auto px-8 max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-medium mb-20 tracking-wide" style={{ fontStyle: "oblique 15deg" }}>
            How Orb Oracle Works?
          </h2>

          <div className="relative flex flex-col md:flex-row items-center justify-between text-center md:text-left">
            {/* Step 1 */}
            <div className="flex-1 flex flex-col items-center px-6 relative">
              <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center text-black font-semibold text-lg shadow-md mb-6">
                1
              </div>
              <h3 className="text-xl font-semibold text-primary mb-3">Multi-Source Aggregation</h3>
              <p className="text-muted-foreground leading-relaxed max-w-xs md:max-w-sm mb-8">
                Orb Oracle pulls live prices from top exchanges, filters out bad data, and delivers a clean, reliable market value.
              </p>
              <StepArrow />
            </div>

            {/* Step 2 */}
            <div className="flex-1 flex flex-col items-center px-6 relative">
              <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center text-black font-semibold text-lg shadow-md mb-6">
                2
              </div>
              <h3 className="text-xl font-semibold text-primary mb-3">Validation & Signing</h3>
              <p className="text-muted-foreground leading-relaxed max-w-xs md:max-w-sm mb-8">
                Independent nodes verify each update and sign it with cryptography to ensure accuracy and security.
              </p>
              <StepArrow />
            </div>

            {/* Step 3 */}
            <div className="flex-1 flex flex-col items-center px-6 relative">
              <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center text-black font-semibold text-lg shadow-md mb-6">
                3
              </div>
              <h3 className="text-xl font-semibold text-primary mb-3">On-Chain Publishing</h3>
              <p className="text-muted-foreground leading-relaxed max-w-xs md:max-w-sm">
                The verified data is posted on-chain so smart contracts can access it instantly — no middlemen needed.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="h-screen flex items-center justify-center">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-medium mb-6 tracking-wide" style={{ fontStyle: "oblique 15deg" }}>
              Ready to build the future?
            </h2>
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
  );
}
