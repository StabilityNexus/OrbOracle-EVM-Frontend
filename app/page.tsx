'use client'

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Navigation } from "@/components/navigation"
import { ArrowRight, Database, Shield, Zap, CheckCircle2, TrendingUp, Users, Network, Sparkles } from "lucide-react"
import Orb from "@/components/Orb"
import { useEffect, useState, useRef } from "react"

export default function HomePage() {
  const [mounted, setMounted] = useState(false)
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set())
  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({})

  useEffect(() => {
    setMounted(true)

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => new Set(prev).add(entry.target.id))
          }
        })
      },
      { threshold: 0.1 }
    )

    Object.values(sectionRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref)
    })

    return () => observer.disconnect()
  }, [])

  const setSectionRef = (id: string) => (el: HTMLElement | null) => {
    sectionRefs.current[id] = el
  }

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
        <div className={`container mx-auto px-4 text-center z-10 relative transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6 animate-pulse">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm text-primary">Decentralized Price Discovery</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-medium mb-6 text-balance tracking-wide" style={{ fontStyle: 'oblique 15deg' }}>
              Orb Oracle: 
              <div className="bg-gradient-to-r from-primary via-purple-400 to-primary bg-clip-text text-transparent animate-gradient">
                The Price of Everything
              </div>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              Decentralized price feeds powered by community consensus. Create, trade, and discover oracles for any asset in the world.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="text-lg px-8 bg-white text-black hover:bg-gray-100 hover:scale-105 transition-transform duration-200 group">
                <Link href="/create">
                  Create an Oracle
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg px-8 bg-transparent border-gray-600 text-gray-400 hover:bg-gray-800 hover:scale-105 transition-transform duration-200">
                <Link href="/explorer">Explore Oracles</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section 
        id="how-it-works" 
        ref={setSectionRef('how-it-works')}
        className="min-h-screen flex items-center justify-center py-20"
      >
        <div className="container mx-auto px-4">
          <div className={`text-center mb-16 transition-all duration-1000 ${visibleSections.has('how-it-works') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-3xl md:text-4xl font-medium mb-4 tracking-wide" style={{ fontStyle: 'oblique 15deg' }}>How Does Orb Oracle Work?</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              A revolutionary bonding curve mechanism that enables anyone to create and trade price oracles with built-in liquidity
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto mb-16">
            <Card 
              className="border-border bg-card/50 backdrop-blur transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-primary/20 cursor-pointer group"
              onMouseEnter={() => setHoveredCard(0)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <CardHeader>
                <div className={`w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 transition-all duration-300 ${hoveredCard === 0 ? 'bg-primary/20 scale-110 rotate-12' : ''}`}>
                  <TrendingUp className={`h-6 w-6 text-primary transition-all duration-300 ${hoveredCard === 0 ? 'scale-125' : ''}`} />
                </div>
                <CardTitle className="text-2xl group-hover:text-primary transition-colors">1. Create an Oracle</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Anyone can create an oracle for any asset. The oracle starts with a bonding curve that determines its price based on supply and demand. Initial creation requires minimal capital, making it accessible to everyone.
                </CardDescription>
              </CardContent>
            </Card>

            <Card 
              className="border-border bg-card/50 backdrop-blur transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-primary/20 cursor-pointer group"
              onMouseEnter={() => setHoveredCard(1)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <CardHeader>
                <div className={`w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 transition-all duration-300 ${hoveredCard === 1 ? 'bg-primary/20 scale-110 rotate-12' : ''}`}>
                  <Users className={`h-6 w-6 text-primary transition-all duration-300 ${hoveredCard === 1 ? 'scale-125' : ''}`} />
                </div>
                <CardTitle className="text-2xl group-hover:text-primary transition-colors">2. Trade & Build Liquidity</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  As users buy and sell oracle shares, the bonding curve automatically provides liquidity. No need for external liquidity providers—the protocol handles it algorithmically, ensuring seamless trading at all times.
                </CardDescription>
              </CardContent>
            </Card>

            <Card 
              className="border-border bg-card/50 backdrop-blur transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-primary/20 cursor-pointer group"
              onMouseEnter={() => setHoveredCard(2)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <CardHeader>
                <div className={`w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 transition-all duration-300 ${hoveredCard === 2 ? 'bg-primary/20 scale-110 rotate-12' : ''}`}>
                  <Network className={`h-6 w-6 text-primary transition-all duration-300 ${hoveredCard === 2 ? 'scale-125' : ''}`} />
                </div>
                <CardTitle className="text-2xl group-hover:text-primary transition-colors">3. Consensus Pricing</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  The oracle price is determined by market participants through trading activity. This creates a decentralized consensus mechanism where the collective wisdom of traders establishes fair market value.
                </CardDescription>
              </CardContent>
            </Card>

            <Card 
              className="border-border bg-card/50 backdrop-blur transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-primary/20 cursor-pointer group"
              onMouseEnter={() => setHoveredCard(3)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <CardHeader>
                <div className={`w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 transition-all duration-300 ${hoveredCard === 3 ? 'bg-primary/20 scale-110 rotate-12' : ''}`}>
                  <CheckCircle2 className={`h-6 w-6 text-primary transition-all duration-300 ${hoveredCard === 3 ? 'scale-125' : ''}`} />
                </div>
                <CardTitle className="text-2xl group-hover:text-primary transition-colors">4. Use Anywhere</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Once established, oracle prices can be integrated into any DeFi protocol, smart contract, or dApp. The on-chain data is tamper-proof, always available, and reflects real-time market consensus.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Better Section */}
      <section 
        id="why-better" 
        ref={setSectionRef('why-better')}
        className="min-h-screen flex items-center justify-center py-20"
      >
        <div className="container mx-auto px-4">
          <div className={`text-center mb-16 transition-all duration-1000 ${visibleSections.has('why-better') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-3xl md:text-4xl font-medium mb-4 tracking-wide" style={{ fontStyle: 'oblique 15deg' }}>Why Choose Orb Oracle?</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Traditional oracles have limitations. We've built a better solution from the ground up.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              { icon: Zap, title: "Permissionless Creation", desc: "Unlike centralized oracles that require approval, anyone can create an oracle for any asset instantly. No gatekeepers, no waiting, no barriers to entry.", id: 10 },
              { icon: Shield, title: "Built-in Liquidity", desc: "Bonding curves eliminate the need for external market makers. Liquidity is always available, prices are algorithmically determined, and trading is instant.", id: 11 },
              { icon: Database, title: "Market-Driven Truth", desc: "Instead of relying on centralized data sources, prices emerge from market consensus. If the crowd believes it has value, it does—pure decentralization.", id: 12 },
              { icon: TrendingUp, title: "Incentive Aligned", desc: "Oracle creators earn fees from trading activity. The more useful and accurate the oracle, the more trading volume it generates, creating perfect incentive alignment.", id: 13 },
              { icon: Network, title: "Truly Decentralized", desc: "No single point of failure, no admin keys, no centralized control. The protocol is fully on-chain and governed by code, not corporations.", id: 14 },
              { icon: CheckCircle2, title: "Instant Integration", desc: "Simple smart contract interfaces make it easy to integrate oracle data into any dApp. Get started in minutes with our developer-friendly APIs.", id: 15 }
            ].map((item, idx) => (
              <Card 
                key={item.id}
                className="border-border bg-card transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-primary/20 hover:border-primary/50 cursor-pointer group"
                onMouseEnter={() => setHoveredCard(item.id)}
                onMouseLeave={() => setHoveredCard(null)}
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <CardHeader>
                  <div className={`w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 transition-all duration-300 ${hoveredCard === item.id ? 'bg-primary/20 scale-110 rotate-12' : ''}`}>
                    <item.icon className={`h-6 w-6 text-primary transition-all duration-300 ${hoveredCard === item.id ? 'scale-125' : ''}`} />
                  </div>
                  <CardTitle className="group-hover:text-primary transition-colors">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    {item.desc}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="h-screen flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Sparkles className="h-4 w-4 text-primary animate-pulse" />
              <span className="text-sm text-primary">Start Earning Today</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-medium mb-6 tracking-wide" style={{ fontStyle: 'oblique 15deg' }}>Ready to Create Your Oracle?</h2>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Join the future of decentralized price discovery. Create an oracle for any asset and start earning from trading fees today.
            </p>
            <Button asChild size="lg" className="text-lg px-8 hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-primary/50 group">
              <Link href="/create">
                Get Started <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-2 transition-transform" />
              </Link>
            </Button>
            <div className="mt-8 flex items-center justify-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <span>No Fees to Create</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <span>Instant Deployment</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <span>Earn Trading Fees</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
