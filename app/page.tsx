'use client'

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Navigation } from "@/components/navigation"
import { ArrowRight, Database, Shield, Zap, CheckCircle2, TrendingUp, Users, Network, Sparkles, Rocket, DollarSign, BarChart3, Code, Lock, Globe } from "lucide-react"
import Orb from "@/components/Orb"
import { useEffect, useState, useRef } from "react"

export default function HomePage() {
  const [mounted, setMounted] = useState(false)
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set())
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [scrollProgress, setScrollProgress] = useState(0)
  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({})

  useEffect(() => {
    setMounted(true)

    // Mouse tracking for parallax effects
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    // Scroll progress tracking
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = (window.scrollY / totalHeight) * 100
      setScrollProgress(progress)
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('scroll', handleScroll)

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

    return () => {
      observer.disconnect()
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const setSectionRef = (id: string) => (el: HTMLElement | null) => {
    sectionRefs.current[id] = el
  }

  // Parallax offset calculation
  const parallaxOffset = {
    x: (mousePosition.x - window.innerWidth / 2) / 50,
    y: (mousePosition.y - window.innerHeight / 2) / 50
  }

  return (
    <div className="min-h-screen bg-background font-[oblique] tracking-wide relative" style={{ fontStyle: 'oblique 12deg' }}>
      {/* Scroll Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-transparent z-50">
        <div 
          className="h-full bg-gradient-to-r from-primary via-purple-400 to-primary transition-all duration-300"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Animated Background Grid */}
      <div className="fixed inset-0 z-0 opacity-20 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(to right, rgba(168, 85, 247, 0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(168, 85, 247, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          transform: `translate(${parallaxOffset.x}px, ${parallaxOffset.y}px)`
        }} />
      </div>

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
              maxHeight: '800px',
              transform: `translate(${parallaxOffset.x * 2}px, ${parallaxOffset.y * 2}px)`
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
        
        {/* Floating particles effect */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-primary/30 rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 4}s`
              }}
            />
          ))}
        </div>

        <div className={`container mx-auto px-4 text-center z-10 relative transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6 animate-pulse">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm text-primary font-semibold">Decentralized Price Discovery</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-balance tracking-wide" style={{ fontStyle: 'oblique 15deg' }}>
              Orb Oracle: 
              <div className="bg-gradient-to-r from-primary via-purple-400 to-pink-400 bg-clip-text text-transparent animate-gradient">
                The Price of Everything
              </div>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              Decentralized price feeds powered by community consensus. Create, trade, and discover oracles for any asset in the world.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button asChild size="lg" className="text-lg px-8 bg-white text-black hover:bg-gray-100 hover:scale-105 transition-transform duration-200 group shadow-xl shadow-primary/20">
                <Link href="/create">
                  Create an Oracle
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg px-8 bg-transparent border-gray-600 text-gray-400 hover:bg-gray-800 hover:scale-105 transition-transform duration-200 hover:border-primary">
                <Link href="/explorer">Explore Oracles</Link>
              </Button>
            </div>

            {/* Live Stats (Animated Counters) */}
            <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto mt-12">
              <div className="bg-card/30 backdrop-blur border border-primary/20 rounded-lg p-4 hover:bg-card/50 transition-all duration-300 hover:scale-105">
                <Rocket className="h-6 w-6 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold text-primary">∞</div>
                <div className="text-xs text-muted-foreground">Permissionless</div>
              </div>
              <div className="bg-card/30 backdrop-blur border border-primary/20 rounded-lg p-4 hover:bg-card/50 transition-all duration-300 hover:scale-105">
                <DollarSign className="h-6 w-6 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold text-primary">0%</div>
                <div className="text-xs text-muted-foreground">Creation Fee</div>
              </div>
              <div className="bg-card/30 backdrop-blur border border-primary/20 rounded-lg p-4 hover:bg-card/50 transition-all duration-300 hover:scale-105">
                <BarChart3 className="h-6 w-6 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold text-primary">100%</div>
                <div className="text-xs text-muted-foreground">On-Chain</div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 animate-bounce">
          <div className="w-6 h-10 border-2 border-primary/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-primary rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section 
        id="how-it-works" 
        ref={setSectionRef('how-it-works')}
        className="min-h-screen flex items-center justify-center py-20 relative z-10"
      >
        <div className="container mx-auto px-4">
          <div className={`text-center mb-16 transition-all duration-1000 ${visibleSections.has('how-it-works') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="inline-block px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
              <span className="text-sm text-primary font-semibold">MECHANISM</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-wide" style={{ fontStyle: 'oblique 15deg' }}>How Does Orb Oracle Work?</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              A revolutionary bonding curve mechanism that enables anyone to create and trade price oracles with built-in liquidity
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto mb-16">
            {[
              { 
                icon: TrendingUp, 
                title: "1. Create an Oracle", 
                desc: "Anyone can create an oracle for any asset. The oracle starts with a bonding curve that determines its price based on supply and demand. Initial creation requires minimal capital, making it accessible to everyone.",
                color: "from-purple-500 to-pink-500"
              },
              { 
                icon: Users, 
                title: "2. Trade & Build Liquidity", 
                desc: "As users buy and sell oracle shares, the bonding curve automatically provides liquidity. No need for external liquidity providers—the protocol handles it algorithmically, ensuring seamless trading at all times.",
                color: "from-blue-500 to-purple-500"
              },
              { 
                icon: Network, 
                title: "3. Consensus Pricing", 
                desc: "The oracle price is determined by market participants through trading activity. This creates a decentralized consensus mechanism where the collective wisdom of traders establishes fair market value.",
                color: "from-pink-500 to-red-500"
              },
              { 
                icon: CheckCircle2, 
                title: "4. Use Anywhere", 
                desc: "Once established, oracle prices can be integrated into any DeFi protocol, smart contract, or dApp. The on-chain data is tamper-proof, always available, and reflects real-time market consensus.",
                color: "from-green-500 to-blue-500"
              }
            ].map((item, idx) => (
              <Card 
                key={idx}
                className={`border-border bg-card/50 backdrop-blur transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-primary/20 cursor-pointer group relative overflow-hidden ${visibleSections.has('how-it-works') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                style={{ transitionDelay: `${idx * 100}ms` }}
                onMouseEnter={() => setHoveredCard(idx)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                {/* Gradient overlay on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                
                <CardHeader className="relative">
                  <div className={`w-14 h-14 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center mb-4 transition-all duration-300 ${hoveredCard === idx ? 'scale-110 rotate-12' : ''} shadow-lg`}>
                    <item.icon className={`h-7 w-7 text-white transition-all duration-300 ${hoveredCard === idx ? 'scale-125' : ''}`} />
                  </div>
                  <CardTitle className="text-2xl group-hover:text-primary transition-colors">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    {item.desc}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Better Section */}
      <section 
        id="why-better" 
        ref={setSectionRef('why-better')}
        className="min-h-screen flex items-center justify-center py-20 relative z-10"
      >
        <div className="container mx-auto px-4">
          <div className={`text-center mb-16 transition-all duration-1000 ${visibleSections.has('why-better') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="inline-block px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
              <span className="text-sm text-primary font-semibold">ADVANTAGES</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-wide" style={{ fontStyle: 'oblique 15deg' }}>Why Choose Orb Oracle?</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Traditional oracles have limitations. We've built a better solution from the ground up.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              { icon: Zap, title: "Permissionless Creation", desc: "Unlike centralized oracles that require approval, anyone can create an oracle for any asset instantly. No gatekeepers, no waiting, no barriers to entry.", id: 10, gradient: "from-yellow-500 to-orange-500" },
              { icon: Shield, title: "Built-in Liquidity", desc: "Bonding curves eliminate the need for external market makers. Liquidity is always available, prices are algorithmically determined, and trading is instant.", id: 11, gradient: "from-blue-500 to-cyan-500" },
              { icon: Database, title: "Market-Driven Truth", desc: "Instead of relying on centralized data sources, prices emerge from market consensus. If the crowd believes it has value, it does—pure decentralization.", id: 12, gradient: "from-purple-500 to-pink-500" },
              { icon: TrendingUp, title: "Incentive Aligned", desc: "Oracle creators earn fees from trading activity. The more useful and accurate the oracle, the more trading volume it generates, creating perfect incentive alignment.", id: 13, gradient: "from-green-500 to-emerald-500" },
              { icon: Lock, title: "Truly Decentralized", desc: "No single point of failure, no admin keys, no centralized control. The protocol is fully on-chain and governed by code, not corporations.", id: 14, gradient: "from-red-500 to-pink-500" },
              { icon: Code, title: "Instant Integration", desc: "Simple smart contract interfaces make it easy to integrate oracle data into any dApp. Get started in minutes with our developer-friendly APIs.", id: 15, gradient: "from-indigo-500 to-purple-500" }
            ].map((item, idx) => (
              <Card 
                key={item.id}
                className={`border-border bg-card transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-primary/20 hover:border-primary/50 cursor-pointer group relative overflow-hidden ${visibleSections.has('why-better') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                onMouseEnter={() => setHoveredCard(item.id)}
                onMouseLeave={() => setHoveredCard(null)}
                style={{ transitionDelay: `${idx * 100}ms` }}
              >
                {/* Animated gradient background on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-10 transition-all duration-500`} />
                
                <CardHeader className="relative">
                  <div className={`w-12 h-12 bg-gradient-to-br ${item.gradient} rounded-lg flex items-center justify-center mb-4 transition-all duration-300 ${hoveredCard === item.id ? 'scale-110 rotate-12 shadow-lg' : ''}`}>
                    <item.icon className={`h-6 w-6 text-white transition-all duration-300 ${hoveredCard === item.id ? 'scale-125' : ''}`} />
                  </div>
                  <CardTitle className="group-hover:text-primary transition-colors text-lg">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="leading-relaxed">
                    {item.desc}
                  </CardDescription>
                </CardContent>

                {/* Hover indicator */}
                <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${item.gradient} transform origin-left transition-transform duration-500 ${hoveredCard === item.id ? 'scale-x-100' : 'scale-x-0'}`} />
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Comparison Section */}
      <section 
        id="comparison" 
        ref={setSectionRef('comparison')}
        className="min-h-screen flex items-center justify-center py-20 relative z-10"
      >
        <div className="container mx-auto px-4">
          <div className={`text-center mb-16 transition-all duration-1000 ${visibleSections.has('comparison') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="inline-block px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
              <span className="text-sm text-primary font-semibold">COMPARISON</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-wide" style={{ fontStyle: 'oblique 15deg' }}>Orb Oracle vs Traditional Oracles</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              See how we stack up against centralized alternatives
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Orb Oracle Column */}
              <div className="bg-gradient-to-br from-primary/20 to-purple-500/20 backdrop-blur border border-primary/30 rounded-2xl p-8 hover:scale-105 transition-all duration-500 shadow-xl shadow-primary/10">
                <div className="flex items-center gap-3 mb-6">
                  <Globe className="h-8 w-8 text-primary" />
                  <h3 className="text-2xl font-bold">Orb Oracle</h3>
                </div>
                <ul className="space-y-4">
                  {[
                    "✓ Permissionless creation",
                    "✓ Built-in liquidity via bonding curves",
                    "✓ Market-driven consensus",
                    "✓ Zero creation fees",
                    "✓ Earn trading fees",
                    "✓ Fully decentralized",
                    "✓ No admin keys",
                    "✓ Instant deployment"
                  ].map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm">
                      <CheckCircle2 className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Traditional Oracles Column */}
              <div className="bg-card/50 backdrop-blur border border-border rounded-2xl p-8 opacity-70">
                <div className="flex items-center gap-3 mb-6">
                  <Database className="h-8 w-8 text-muted-foreground" />
                  <h3 className="text-2xl font-bold text-muted-foreground">Traditional Oracles</h3>
                </div>
                <ul className="space-y-4">
                  {[
                    "✗ Requires approval/whitelisting",
                    "✗ External liquidity needed",
                    "✗ Centralized data sources",
                    "✗ High setup costs",
                    "✗ No creator incentives",
                    "✗ Centralized control",
                    "✗ Single point of failure",
                    "✗ Slow deployment process"
                  ].map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-muted-foreground">
                      <span className="h-5 w-5 flex-shrink-0 mt-0.5 text-red-400">✗</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden py-20">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent"></div>
        
        {/* Animated orbs in background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '0s' }} />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Sparkles className="h-4 w-4 text-primary animate-pulse" />
              <span className="text-sm text-primary font-semibold">Start Earning Today</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-bold mb-6 tracking-wide" style={{ fontStyle: 'oblique 15deg' }}>Ready to Create Your Oracle?</h2>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed max-w-2xl mx-auto">
              Join the future of decentralized price discovery. Create an oracle for any asset and start earning from trading fees today.
            </p>
            <Button asChild size="lg" className="text-lg px-12 py-6 hover:scale-110 transition-all duration-300 shadow-2xl shadow-primary/50 group bg-gradient-to-r from-primary to-purple-500 hover:from-purple-500 hover:to-primary">
              <Link href="/create">
                Get Started Now <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-2 transition-transform" />
              </Link>
            </Button>
            <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm">
              <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-card/30 backdrop-blur border border-primary/20 hover:bg-card/50 transition-all hover:scale-105">
                <CheckCircle2 className="h-6 w-6 text-primary" />
                <span className="font-semibold">No Fees to Create</span>
                <span className="text-xs text-muted-foreground">Deploy for free</span>
              </div>
              <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-card/30 backdrop-blur border border-primary/20 hover:bg-card/50 transition-all hover:scale-105">
                <Zap className="h-6 w-6 text-primary" />
                <span className="font-semibold">Instant Deployment</span>
                <span className="text-xs text-muted-foreground">Live in seconds</span>
              </div>
              <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-card/30 backdrop-blur border border-primary/20 hover:bg-card/50 transition-all hover:scale-105">
                <DollarSign className="h-6 w-6 text-primary" />
                <span className="font-semibold">Earn Trading Fees</span>
                <span className="text-xs text-muted-foreground">Passive income</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 relative z-10">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2025 Orb Oracle. Decentralized price discovery for everyone.</p>
        </div>
      </footer>
    </div>
  )
}