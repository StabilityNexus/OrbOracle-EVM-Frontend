"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { 
  ArrowRight, 
  Shield, 
  Zap, 
  TrendingUp, 
  CheckCircle2, 
  Sliders, 
  FileText, 
  ExternalLink,
  Layers,
  Coins,
  Cpu,
  Boxes,
  Award,
  BookOpen,
  Database,
  Terminal
} from "lucide-react"
import dynamic from "next/dynamic"
import { useState, useEffect, useRef } from "react"

const ParticleBackground = dynamic(() => import("@/components/ParticleBackground"), { ssr: false })
const StructureFlowBackground = dynamic(
  () => import("@/src/shaders/structure-flow/StructureFlowBackground").then((mod) => mod.StructureFlowBackground),
  { ssr: false }
)
const RewardFlowVisualizer = dynamic(() => import("@/components/RewardFlowVisualizer"), { ssr: false })

// Subtle Scroll Reveal Animation Wrapper
function ScrollReveal({
  children,
  className = "",
  delay = 0,
  direction = "up"
}: {
  children: React.ReactNode
  className?: string
  delay?: number
  direction?: "up" | "none"
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(el)
        }
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -40px 0px"
      }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const transformClass = direction === "up" 
    ? (isVisible ? "opacity-100 translate-y-0 filter-none" : "opacity-0 translate-y-8")
    : (isVisible ? "opacity-100" : "opacity-0")

  return (
    <div
      ref={ref}
      style={{
        transitionDelay: `${delay}ms`,
      }}
      className={`transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${transformClass} ${className}`}
    >
      {children}
    </div>
  )
}



export default function HomePage() {
  // Interactive Value Range Simulator State
  const [sampleSize, setSampleSize] = useState<number>(20)
  const basePrice = 2500
  const spreadPercent = (sampleSize * 0.12).toFixed(2)
  const minRange = (basePrice * (1 - Number(spreadPercent) / 100)).toFixed(2)
  const maxRange = (basePrice * (1 + Number(spreadPercent) / 100)).toFixed(2)

  return (
    <div className="min-h-screen bg-background font-sans text-foreground overflow-x-hidden selection:bg-primary/30 selection:text-white relative">
      {/* High-End Ambient Particle Backdrop */}
      <ParticleBackground />

      {/* Hero Wrapper (Full Width) */}
      <div className="relative w-full overflow-visible">
        {/* Full-Screen Immersive Three.js Particle Node Flow Backdrop */}
        <div 
          className="absolute inset-x-0 top-[45dvh] w-full h-[150dvh] z-0 pointer-events-none opacity-80"
          style={{
            maskImage: 'linear-gradient(to bottom, black 0%, black 46%, rgba(0,0,0,0.65) 50%, rgba(0,0,0,0.2) 54%, transparent 58%)',
            WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 46%, rgba(0,0,0,0.65) 50%, rgba(0,0,0,0.2) 54%, transparent 58%)'
          }}
        >
          <StructureFlowBackground speed={0.8} pointSize={0.07} opacity={0.8} maskStart={0} maskSolid={0} />
        </div>

        {/* Hero Section */}
        <section className="relative min-h-[88dvh] sm:min-h-[92dvh] flex items-center justify-center pt-28 sm:pt-36 md:pt-32 pb-8 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto z-10">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto space-y-5 sm:space-y-6">

            {/* H1 Display Typography */}
            <ScrollReveal delay={100}>
              <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-medium tracking-tight leading-[1.1] sm:leading-[1.08] text-balance drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)]">
                <span className="text-primary font-semibold">Decentralized Truth</span> <br className="hidden sm:inline" />
                for the <span className="text-white">Decentralized Web</span>
              </h1>
            </ScrollReveal>

            {/* Subtext */}
            <ScrollReveal delay={200} className="relative">
              <div 
                aria-hidden="true"
                className="absolute -inset-x-6 -inset-y-3 bg-background/90 rounded-2xl blur-xl -z-10 pointer-events-none"
              />
              <p className="relative z-10 text-base sm:text-lg md:text-xl text-zinc-100 font-normal leading-relaxed max-w-[65ch] drop-shadow-[0_2px_12px_rgba(0,0,0,1)] px-2 sm:px-0">
                Deploy, Compose, Operate and Query high-integrity oracles for prices and other data streams across EVM blockchains
              </p>
            </ScrollReveal>

            {/* CTAs */}
            <ScrollReveal delay={300} className="w-full sm:w-auto">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 pt-2 sm:pt-4 w-full">
                <Button 
                  asChild 
                  size="lg" 
                  className="w-full sm:w-auto h-13 sm:h-14 rounded-full pl-6 pr-2 bg-white/10 border border-white/15 backdrop-blur-md text-white hover:bg-white/15 hover:border-white/25 transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.98] group flex items-center justify-between shadow-xl"
                >
                  <Link href="/deploy">
                    <span className="font-medium tracking-wide text-xs sm:text-sm">Deploy Your Own Oracle</span>
                    <span className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:translate-x-1 group-hover:-translate-y-[1px] transition-transform duration-300">
                      <ArrowRight className="h-4 w-4 stroke-[1.5] text-white" />
                    </span>
                  </Link>
                </Button>
                
                <Button 
                  asChild 
                  variant="outline" 
                  size="lg" 
                  className="w-full sm:w-auto h-13 sm:h-14 rounded-full pl-6 pr-2 bg-white/5 border border-white/15 backdrop-blur-md text-white hover:bg-white/10 hover:border-white/25 transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-[0.98] group flex items-center justify-between shadow-xl"
                >
                  <Link href="/use">
                    <span className="font-medium tracking-wide text-xs sm:text-sm">Use an Oracle</span>
                    <span className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/5 flex items-center justify-center group-hover:translate-x-1 group-hover:-translate-y-[1px] transition-transform duration-300">
                      <ArrowRight className="h-4 w-4 stroke-[1.5] text-white" />
                    </span>
                  </Link>
                </Button>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Protocol Horizon Ribbon */}
        <section 
          className="relative z-10 w-full py-10 sm:py-14 border-b border-white/5 bg-black/40 backdrop-blur-2xl mt-[6dvh] sm:mt-[10dvh] md:mt-[12dvh] mb-[6dvh] sm:mb-[10dvh] md:mb-[14dvh] shadow-[0_-25px_50px_rgba(0,0,0,0.85),0_25px_50px_rgba(0,0,0,0.95)]"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 md:gap-12">
              
              <ScrollReveal delay={100}>
                <div className="flex flex-col items-center text-center space-y-1.5 sm:space-y-2 group">
                  <span className="font-mono text-[9px] sm:text-[10px] tracking-[0.25em] text-muted-foreground uppercase">Precision</span>
                  <div className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-white transition-transform duration-300 group-hover:scale-105">
                    18 (WAD)
                  </div>
                  <span className="text-[11px] sm:text-xs text-muted-foreground">Fixed-Point Normalization</span>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={180}>
                <div className="flex flex-col items-center text-center space-y-1.5 sm:space-y-2 group">
                  <span className="font-mono text-[9px] sm:text-[10px] tracking-[0.25em] text-muted-foreground uppercase">Aggregation</span>
                  <div className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-primary transition-transform duration-300 group-hover:scale-105">
                    EWMA
                  </div>
                  <span className="text-[11px] sm:text-xs text-muted-foreground">Exponential Moving Average</span>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={260}>
                <div className="flex flex-col items-center text-center space-y-1.5 sm:space-y-2 group">
                  <span className="font-mono text-[9px] sm:text-[10px] tracking-[0.25em] text-muted-foreground uppercase">Execution</span>
                  <div className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-white transition-transform duration-300 group-hover:scale-105">
                    100%
                  </div>
                  <span className="text-[11px] sm:text-xs text-muted-foreground">On-Chain EVM Bytecode</span>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={340}>
                <div className="flex flex-col items-center text-center space-y-1.5 sm:space-y-2 group">
                  <span className="font-mono text-[9px] sm:text-[10px] tracking-[0.25em] text-muted-foreground uppercase">Scaling</span>
                  <div className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-white transition-transform duration-300 group-hover:scale-105">
                    O(1)
                  </div>
                  <span className="text-[11px] sm:text-xs text-muted-foreground">Constant-Time Updates</span>
                </div>
              </ScrollReveal>

            </div>
          </div>
        </section>
      </div>

      {/* ========================================================= */}
      {/* SECTION 1: HOW IT WORKS (3 Foundation Pillars)           */}
      {/* ========================================================= */}
      <section className="py-16 sm:py-24 md:py-32 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto">
        <ScrollReveal delay={100}>
          <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-20 space-y-3 sm:space-y-4">
            <div className="inline-flex items-center space-x-2">
              <span className="px-3.5 py-1 text-[10px] sm:text-[11px] tracking-[0.2em] font-mono font-medium uppercase rounded-full bg-white/5 border border-white/10 text-primary">
                CORE PROTOCOL // ARCHITECTURE
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-white leading-tight">
              How Orb Works
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl mx-auto px-2 sm:px-0">
              A decentralized, sustainable foundation for temporal data streams on Ethereum and EVM blockchains.
            </p>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          
          {/* Point 1: Immutable On-Chain Data Streams */}
          <ScrollReveal delay={120}>
            <div className="bg-zinc-950/60 border border-white/10 rounded-2xl sm:rounded-3xl p-6 sm:p-8 backdrop-blur-md h-full flex flex-col justify-between space-y-6 hover:border-white/20 transition-all duration-300 shadow-xl">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Layers className="h-5 w-5 text-primary stroke-[1.5]" />
                  <span className="text-[10px] sm:text-[11px] tracking-widest font-mono text-primary uppercase font-semibold">
                    DATA STREAMS
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-medium tracking-tight text-white">
                  Immutable On-Chain Streams
                </h3>
                <p className="text-zinc-300 text-sm leading-relaxed">
                  Every Orb oracle is an on-chain contract that stores, on-chain, a stream of data. Anyone can deploy an Orb oracle. Deployed oracles are immutable, with parameters set at the moment of deployment.
                </p>
              </div>

              <div className="pt-4 border-t border-white/5 font-mono text-[11px] text-muted-foreground space-y-1.5">
                <div className="flex justify-between">
                  <span>Deployment:</span>
                  <span className="text-white font-semibold">Open & Permissionless</span>
                </div>
                <div className="flex justify-between">
                  <span>Contract State:</span>
                  <span className="text-primary font-semibold">100% Immutable</span>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Point 2: Staked Operators & EWMA */}
          <ScrollReveal delay={200}>
            <div className="bg-zinc-950/60 border border-white/10 rounded-2xl sm:rounded-3xl p-6 sm:p-8 backdrop-blur-md h-full flex flex-col justify-between space-y-6 hover:border-white/20 transition-all duration-300 shadow-xl">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Coins className="h-5 w-5 text-primary stroke-[1.5]" />
                  <span className="text-[10px] sm:text-[11px] tracking-widest font-mono text-primary uppercase font-semibold">
                    DECENTRALIZED OPERATION
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-medium tracking-tight text-white">
                  EWMA using Staked Balances
                </h3>
                <p className="text-zinc-300 text-sm leading-relaxed">
                  Every Orb oracle has an associated ERC20 token. Holders who stake this token become operators of that particular oracle and may submit values to the oracle. The oracle calculates a weighted exponential moving average of the submitted values, taking into account the time of the submissions and the staked balances as weights.
                </p>
              </div>

              <div className="pt-4 border-t border-white/5 font-mono text-[11px] text-muted-foreground space-y-1.5">
                <div className="flex justify-between">
                  <span>Operator Role:</span>
                  <span className="text-white font-semibold">Any Tokenholder</span>
                </div>
                <div className="flex justify-between">
                  <span>Weight Scaling:</span>
                  <span className="text-primary font-semibold">Time-Decayed Stake</span>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Point 3: Permissionless Reads & Anti-Free-Riding */}
          <ScrollReveal delay={280}>
            <div className="bg-zinc-950/60 border border-white/10 rounded-2xl sm:rounded-3xl p-6 sm:p-8 backdrop-blur-md h-full flex flex-col justify-between space-y-6 hover:border-white/20 transition-all duration-300 shadow-xl">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-primary stroke-[1.5]" />
                  <span className="text-[10px] sm:text-[11px] tracking-widest font-mono text-primary uppercase font-semibold">
                    ACCESS CONTROL
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-medium tracking-tight text-white">
                  Anti-Free-Riding Governance
                </h3>
                <p className="text-zinc-300 text-sm leading-relaxed">
                  By default, any contract can read data from any Orb oracle. Such contracts are expected to comply with the conditions of use required by the oracle&apos;s operators. The operators may blacklist non-compliant contracts. Blacklisting actions need a minimum quorum and a majority of the operators&apos; stake.
                </p>
              </div>

              <div className="pt-4 border-t border-white/5 font-mono text-[11px] text-muted-foreground space-y-1.5">
                <div className="flex justify-between">
                  <span>Read Access:</span>
                  <span className="text-white font-semibold">Public by Default</span>
                </div>
                <div className="flex justify-between">
                  <span>Blacklist Rule:</span>
                  <span className="text-primary font-semibold">Quorum + Majority Stake</span>
                </div>
              </div>
            </div>
          </ScrollReveal>

        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION 2: KEY CHARACTERISTICS OF ORB                     */}
      {/* ========================================================= */}
      <section className="py-16 sm:py-24 md:py-32 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto border-t border-white/5">
        
        {/* Section Header */}
        <ScrollReveal delay={100}>
          <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-20 space-y-3 sm:space-y-4">
            <div className="inline-flex items-center space-x-2">
              <span className="px-3.5 py-1 text-[10px] sm:text-[11px] tracking-[0.2em] font-mono font-medium uppercase rounded-full bg-white/5 border border-white/10 text-primary">
                KEY CHARACTERISTICS
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-white leading-tight">
              Key Characteristics of Orb
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl mx-auto px-2 sm:px-0">
              Engineered with mathematical rigor to solve the centralization, latency, manipulation, and sustainability limits of existing oracles.
            </p>
          </div>
        </ScrollReveal>

        <div className="space-y-8 sm:space-y-10">

          {/* Advantage 1: Resilience */}
          <ScrollReveal delay={120}>
            <div className="bg-zinc-950/60 border border-white/10 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 backdrop-blur-md shadow-xl hover:border-white/20 transition-all duration-300">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
                
                <div className="lg:col-span-6 space-y-4 sm:space-y-5">
                  <div className="flex items-center space-x-2">
                    <Sliders className="h-5 w-5 text-primary stroke-[1.5]" />
                    <span className="text-xs tracking-widest font-mono text-primary font-semibold">
                      1
                    </span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-medium tracking-tight text-white">
                    Resilience
                  </h3>
                  <p className="text-zinc-300 text-sm sm:text-base leading-relaxed">
                    Rather than forcing high-value DeFi applications to rely on a single fragile price point, Orb Oracle exposes a current value together with dynamic minimum and maximum bounds derived from recent sampled history.
                  </p>
                  <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
                    Exchange rates have natural spreads and volatile fluctuations. Exposing value ranges parameter-free via view calls empowers lending protocols and DEXs to measure market uncertainty directly on-chain, automatically filtering out single-transaction flash-loan spikes and sandwich manipulation without extra calculation.
                  </p>
                </div>

                {/* Interactive Simulator */}
                <div className="lg:col-span-6 flex justify-center w-full">
                  <div className="w-full max-w-[480px] bg-black/50 border border-white/10 rounded-2xl p-5 sm:p-7 font-mono text-xs space-y-5 shadow-xl">
                    <div className="flex items-center justify-between border-b border-white/5 pb-3">
                      <span className="text-white font-semibold uppercase tracking-wider text-[11px]">
                        Value Range Reader
                      </span>
                      <span className="text-[10px] text-primary bg-primary/10 px-2 py-0.5 rounded border border-primary/20">
                        ETH / USD
                      </span>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-muted-foreground">Sample Size:</span>
                        <span className="text-primary font-bold">{sampleSize} samples</span>
                      </div>
                      <input
                        type="range"
                        min={5}
                        max={50}
                        step={1}
                        value={sampleSize}
                        onChange={(e) => setSampleSize(Number(e.target.value))}
                        className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-primary"
                      />
                    </div>

                    <div className="p-3.5 sm:p-4 bg-zinc-900/50 rounded-xl border border-white/5 space-y-3">
                      <div className="flex justify-between items-center text-xs">
                        <div className="text-left">
                          <span className="text-[9px] text-muted-foreground uppercase block">Min Value</span>
                          <span className="font-bold text-white">${minRange}</span>
                        </div>
                        <div className="text-center">
                          <span className="text-[9px] text-muted-foreground uppercase block">Current Value</span>
                          <span className="font-bold text-primary text-sm">${basePrice.toFixed(2)}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-[9px] text-muted-foreground uppercase block">Max Value</span>
                          <span className="font-bold text-white">${maxRange}</span>
                        </div>
                      </div>

                      <div className="relative w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                        <div className="absolute inset-y-0 bg-gradient-to-r from-primary/40 via-primary/80 to-primary w-full" />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-white rounded-full shadow-md border-2 border-black" />
                      </div>

                      <div className="flex justify-between text-[10px] text-muted-foreground pt-1">
                        <span>Uncertainty Spread:</span>
                        <span className="text-primary font-semibold">±{spreadPercent}%</span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </ScrollReveal>

          {/* Advantage 2 & 3: Scalable Decentralization + Speed (2-Column) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            
            {/* Advantage 2: Scalable Decentralization */}
            <ScrollReveal delay={140}>
              <div className="bg-zinc-950/60 border border-white/10 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 backdrop-blur-md h-full flex flex-col justify-between space-y-6 sm:space-y-8 hover:border-white/20 transition-all duration-300 shadow-xl">
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-center space-x-2">
                    <Cpu className="h-5 w-5 text-primary stroke-[1.5]" />
                    <span className="text-xs tracking-widest font-mono text-primary font-semibold">
                      2
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-medium tracking-tight text-white">
                    Scalable Decentralization
                  </h3>
                  <p className="text-zinc-300 text-sm sm:text-base leading-relaxed">
                    Orb has clever mathematical mechanisms to allow constant-time and constant-gas on-chain updates for any arbitrary number of oracle operators. Operators submit values without creating bottlenecks, enabling unbounded decentralization.
                  </p>
                </div>

                <div className="bg-black/50 rounded-xl p-4 sm:p-5 border border-white/5 font-mono text-xs space-y-2.5">
                  <div className="flex justify-between items-center text-[11px] sm:text-xs">
                    <span className="text-zinc-400">Node Capacity</span>
                    <span className="text-white font-semibold">Unbounded (Any Stakeholder)</span>
                  </div>
                  <div className="flex justify-between items-center text-[11px] sm:text-xs">
                    <span className="text-zinc-400">Update Complexity</span>
                    <span className="text-primary font-semibold">Constant O(1) Gas</span>
                  </div>
                  <div className="flex justify-between items-center text-[11px] sm:text-xs">
                    <span className="text-zinc-400">Aggregation Rule</span>
                    <span className="text-white font-semibold">Decayed Weighted Average</span>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Advantage 3: Speed */}
            <ScrollReveal delay={200}>
              <div className="bg-zinc-950/60 border border-white/10 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 backdrop-blur-md h-full flex flex-col justify-between space-y-6 sm:space-y-8 hover:border-white/20 transition-all duration-300 shadow-xl">
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-center space-x-2">
                    <Zap className="h-5 w-5 text-primary stroke-[1.5]" />
                    <span className="text-xs tracking-widest font-mono text-primary font-semibold">
                      3
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-medium tracking-tight text-white">
                    Speed
                  </h3>
                  <p className="text-zinc-300 text-sm sm:text-base leading-relaxed">
                    Fresh submissions immediately dominate the aggregate price with single-block finality. Older submissions smoothly undergo exponential decay based on the oracle&apos;s half-life, and inactive operators&apos; delay asymptotically converges to zero, bounding delay to optimal minimums.
                  </p>
                </div>

                <div className="bg-black/50 rounded-xl p-4 sm:p-5 border border-white/5 font-mono text-xs space-y-2.5">
                  <div className="flex justify-between items-center text-[11px] sm:text-xs">
                    <span className="text-zinc-400">State Latency</span>
                    <span className="text-white font-semibold">Single Block Finality</span>
                  </div>
                  <div className="flex justify-between items-center text-[11px] sm:text-xs">
                    <span className="text-zinc-400">Decay Function</span>
                    <span className="text-primary font-semibold">Continuous Half-Life (h)</span>
                  </div>
                  <div className="flex justify-between items-center text-[11px] sm:text-xs">
                    <span className="text-zinc-400">Inactive Operator Impact</span>
                    <span className="text-white font-semibold">Asymptotically Zero</span>
                  </div>
                </div>
              </div>
            </ScrollReveal>

          </div>

          {/* Advantage 4: Composability (Visual Showcase) */}
          <ScrollReveal delay={160}>
            <div className="bg-zinc-950/60 border border-white/10 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 backdrop-blur-md shadow-xl hover:border-white/20 transition-all duration-300">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
                
                <div className="lg:col-span-6 space-y-5 sm:space-y-6">
                  <div className="flex items-center space-x-2">
                    <Boxes className="h-5 w-5 text-primary stroke-[1.5]" />
                    <span className="text-xs tracking-widest font-mono text-primary font-semibold">
                      4
                    </span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-medium tracking-tight text-white leading-tight">
                    Composability
                  </h3>
                  <p className="text-zinc-300 leading-relaxed text-sm sm:text-base">
                    Multiply or divide any two active oracles directly on-chain to create custom currency pairs, cross-asset rates, or synthetic pricing without storing duplicate state or incurring extra gas delay.
                  </p>
                </div>

                <div className="lg:col-span-6">
                  <div className="bg-black/50 rounded-2xl p-6 sm:p-8 border border-white/10 space-y-6 sm:space-y-8 shadow-xl">
                    
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 relative">
                      
                      {/* Oracle A */}
                      <div className="w-full sm:flex-1 p-4 sm:p-5 rounded-xl bg-zinc-900/80 border border-white/5 flex flex-col justify-between space-y-3 shadow-inner">
                        <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
                          Oracle A
                        </span>
                        <div className="space-y-1">
                          <div className="font-mono text-base sm:text-lg font-semibold text-white tracking-tight">
                            ETH/USD
                          </div>
                          <div className="font-mono text-xs sm:text-sm text-primary font-medium">
                            $3,000
                          </div>
                        </div>
                      </div>

                      {/* Operator Indicator */}
                      <div className="flex flex-col items-center justify-center shrink-0 py-1 sm:py-0">
                        <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-primary/10 border border-primary/25 flex items-center justify-center text-primary font-mono text-lg font-bold shadow-lg">
                          ×
                        </div>
                      </div>

                      {/* Oracle B */}
                      <div className="w-full sm:flex-1 p-4 sm:p-5 rounded-xl bg-zinc-900/80 border border-white/5 flex flex-col justify-between space-y-3 shadow-inner">
                        <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
                          Oracle B
                        </span>
                        <div className="space-y-1">
                          <div className="font-mono text-base sm:text-lg font-semibold text-white tracking-tight">
                            USD/EUR
                          </div>
                          <div className="font-mono text-xs sm:text-sm text-emerald-400 font-medium">
                            0.9 EUR
                          </div>
                        </div>
                      </div>

                    </div>

                    {/* Result Output Card */}
                    <div className="p-4 sm:p-5 rounded-xl bg-zinc-950 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
                      <div className="space-y-1 text-center sm:text-left">
                        <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider block">
                          On-Chain Formula
                        </span>
                        <div className="font-mono text-xs sm:text-sm font-semibold text-white tracking-tight">
                          (ETH/USD) × (USD/EUR) → ETH/EUR
                        </div>
                      </div>
                      
                      <div className="font-mono text-sm sm:text-base font-bold text-primary bg-primary/10 px-5 py-2.5 rounded-xl border border-primary/20 shrink-0 text-center">
                        1 ETH = 2700 EUR
                      </div>
                    </div>

                  </div>
                </div>

              </div>
            </div>
          </ScrollReveal>

          {/* Advantage 5: Economic Sustainability */}
          <ScrollReveal delay={180}>
            <div className="bg-zinc-950/60 border border-white/10 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 backdrop-blur-md shadow-xl hover:border-white/20 transition-all duration-300">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
                
                <div className="lg:col-span-6 space-y-4 sm:space-y-5">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5 text-primary stroke-[1.5]" />
                    <span className="text-xs tracking-widest font-mono text-primary font-semibold">
                      5
                    </span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-medium tracking-tight text-white">
                    Economic Sustainability
                  </h3>
                  <p className="text-zinc-300 text-sm sm:text-base leading-relaxed">
                    Oracle operators are rewarded for submitting values, providing a reliable source of revenue to cover operational costs. The reward pool can be funded with native cryptocurrency at any time.
                  </p>
                  <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
                    The reward formula is mathematically proven (Theorem 4) to preserve its balance, ensuring the reward pool never drains to zero and maintaining permanent operational incentives for operators.
                  </p>
                </div>

                <div className="lg:col-span-6 flex justify-center w-full">
                  <RewardFlowVisualizer />
                </div>

              </div>
            </div>
          </ScrollReveal>

          {/* Advantage 6: Research & Formal Verification */}
          <ScrollReveal delay={200}>
            <div className="bg-zinc-950/60 border border-white/10 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 backdrop-blur-md shadow-xl hover:border-white/20 transition-all duration-300">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
                
                <div className="lg:col-span-7 space-y-4 sm:space-y-5">
                  <div className="flex items-center space-x-2">
                    <Award className="h-5 w-5 text-primary stroke-[1.5]" />
                    <span className="text-xs tracking-widest font-mono text-primary font-semibold">
                      6
                    </span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-medium tracking-tight text-white">
                    Research and Formal Verification
                  </h3>
                  <p className="text-zinc-300 text-sm sm:text-base leading-relaxed">
                    The Orb Oracle Protocol paper (<em>&quot;Orb: Decentralized and Sustainable Oracles&quot;</em>) has been peer-reviewed and accepted for publication at the <strong>Journal of Financial Technology</strong>.
                  </p>
                  <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
                    Unlike conventional smart contracts that depend only on standard unit tests, all four core mathematical theorems of Orb — constant-time O(1) aggregation, inactive operator delay convergence, bounded oracle delay, and reward pool sustainability — have been machine-checked and formally verified in the <strong>Rocq (formerly Coq)</strong> interactive theorem prover.
                  </p>

                  <div className="pt-3 flex flex-wrap items-center gap-3">
                    <Button
                      asChild
                      size="sm"
                      className="rounded-full bg-white text-black hover:bg-zinc-200 font-mono text-xs font-semibold px-5 h-11"
                    >
                      <a href="https://cdn.jsdelivr.net/gh/StabilityNexus/Papers/papers/Orb/v2.pdf" target="_blank" rel="noopener noreferrer">
                        <FileText className="h-4 w-4 mr-2" />
                        <span>Read Paper (PDF)</span>
                        <ExternalLink className="h-3 w-3 ml-2 opacity-60" />
                      </a>
                    </Button>

                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      className="rounded-full bg-white/5 border border-white/15 text-white hover:bg-white/10 hover:border-white/25 font-mono text-xs px-5 h-11"
                    >
                      <a href="https://stabilitynexus.github.io/OrbOracle-Formalization/Oracle.html" target="_blank" rel="noopener noreferrer">
                        <Shield className="h-4 w-4 mr-2 text-primary" />
                        <span>Formal Proofs (Rocq)</span>
                        <ExternalLink className="h-3 w-3 ml-2 opacity-60" />
                      </a>
                    </Button>
                  </div>
                </div>

                {/* Taste-Engineered Editorial Paper Thumbnail */}
                <div className="lg:col-span-5 flex justify-center w-full">
                  <a 
                    href="https://cdn.jsdelivr.net/gh/StabilityNexus/Papers/papers/Orb/v2.pdf" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full max-w-[370px] group block transition-transform duration-500 hover:-translate-y-1.5 focus:outline-none"
                  >
                    {/* Realistic Academic Document Sheet Preview */}
                    <div className="relative rounded-2xl p-6 sm:p-7 bg-[#fdfbf7] text-[#1c1917] shadow-[0_20px_50px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.1)] overflow-hidden transition-all duration-300 group-hover:shadow-[0_25px_60px_rgba(59,130,246,0.25),0_0_0_1px_rgba(59,130,246,0.4)]">
                      
                      {/* Top Journal Ribbon Badge */}
                      <div className="flex items-center justify-between border-b border-stone-200 pb-3 mb-4">
                        <span className="font-mono text-[9px] uppercase tracking-wider text-stone-500 font-bold">
                          Journal of Financial Technology
                        </span>
                        <span className="text-[8.5px] font-mono font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded uppercase tracking-wider">
                          Accepted
                        </span>
                      </div>

                      {/* Paper Document Header Typography */}
                      <div className="space-y-2">
                        <h4 className="font-serif text-base sm:text-lg font-bold tracking-tight text-stone-900 leading-snug">
                          Orb: Decentralized and Sustainable Oracles
                        </h4>
                        
                        <div className="font-serif text-xs text-stone-600 italic">
                          J. Zahnentferner, S. Dengre, L. D’Angelo, L. Quilling
                        </div>
                        
                        <div className="text-[9px] font-mono text-stone-400 uppercase tracking-widest pt-0.5">
                          Stability Nexus · Carnegie Mellon
                        </div>
                      </div>

                      {/* Micro Abstract Snapshot with Fine Print */}
                      <div className="mt-4 pt-3 border-t border-stone-200 text-stone-700 font-serif text-[10.5px] leading-relaxed">
                        <span className="font-sans font-bold text-[9px] uppercase tracking-wider text-stone-900 block mb-1">
                          Abstract Snapshot
                        </span>
                        <p className="line-clamp-3 text-stone-600">
                          Orb Oracles are decentralized in the sense that any oracle token holder can submit values and act as an operator, and sustainable in that operators are rewarded from self-preserving pools...
                        </p>
                      </div>

                      {/* Theorems Verification Footer Stamp */}
                      <div className="mt-4 pt-3 border-t border-stone-200 flex items-center justify-between text-[9.5px] font-mono">
                        <span className="text-stone-500">Proofs: <strong className="text-stone-900 font-bold">Theorems 1–4</strong></span>
                        <span className="inline-flex items-center text-primary font-bold">
                          <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600" />
                          Rocq Verified
                        </span>
                      </div>

                      {/* Hover Overlay Hint */}
                      <div className="absolute inset-x-0 bottom-0 py-2 bg-stone-900/90 text-white font-mono text-[10px] text-center uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-1.5 backdrop-blur-xs">
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>Click to Open Full PDF</span>
                      </div>

                    </div>
                  </a>
                </div>

              </div>
            </div>
          </ScrollReveal>

        </div>
      </section>

      {/* ========================================================= */}
      {/* SECTION 3: PROTOCOL COMPARISON TABLE                     */}
      {/* ========================================================= */}
      <section className="py-16 sm:py-24 md:py-32 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto border-t border-white/5">
        <ScrollReveal delay={100}>
          <div className="text-center max-w-3xl mx-auto mb-14 sm:mb-20 space-y-3 sm:space-y-4">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-white leading-tight">
              Protocol Comparison
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl mx-auto px-2 sm:px-0">
              How Orb compares to other architectural models across decentralization, security, and economic guarantees.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={180}>
          <div className="overflow-x-auto">
            <div className="min-w-[720px] bg-zinc-950/60 border border-white/10 rounded-2xl sm:rounded-3xl p-4 sm:p-6 backdrop-blur-md shadow-xl">
              <table className="w-full text-left font-mono text-xs border-collapse">
                <thead>
                  <tr className="border-b border-white/10 bg-white/[0.02]">
                    <th className="p-4 sm:p-5 text-zinc-400 uppercase text-[10px] sm:text-[11px] tracking-wider w-1/4">
                      Feature / Guarantee
                    </th>
                    <th className="p-4 sm:p-5 text-zinc-400 uppercase text-[10px] sm:text-[11px] tracking-wider w-1/4">
                      Push Oracles
                    </th>
                    <th className="p-4 sm:p-5 text-zinc-400 uppercase text-[10px] sm:text-[11px] tracking-wider w-1/4">
                      Pull Oracles
                    </th>
                    <th className="p-4 sm:p-5 text-primary uppercase text-[10px] sm:text-[11px] tracking-wider font-bold w-1/4 bg-primary/[0.04] rounded-t-xl">
                      Orb Oracles
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-zinc-300">
                  
                  {/* Row 1 */}
                  <tr className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-4 sm:p-5 font-semibold text-white">Execution Layer</td>
                    <td className="p-4 sm:p-5 text-muted-foreground">Off-chain consensus + On-chain push</td>
                    <td className="p-4 sm:p-5 text-muted-foreground">Off-chain signing + User pull</td>
                    <td className="p-4 sm:p-5 text-white font-semibold bg-primary/[0.03]">100% On-Chain EVM</td>
                  </tr>

                  {/* Row 2 */}
                  <tr className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-4 sm:p-5 font-semibold text-white">Operator Scalability</td>
                    <td className="p-4 sm:p-5 text-muted-foreground">Fixed validator quorum</td>
                    <td className="p-4 sm:p-5 text-muted-foreground">Restricted publisher set</td>
                    <td className="p-4 sm:p-5 text-white font-semibold bg-primary/[0.03]">Unbounded O(1) Scaling</td>
                  </tr>

                  {/* Row 3 */}
                  <tr className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-4 sm:p-5 font-semibold text-white">Free-Riding Protection</td>
                    <td className="p-4 sm:p-5 text-muted-foreground">Unprotected (Free-riding risk)</td>
                    <td className="p-4 sm:p-5 text-muted-foreground">Fee per pull transaction</td>
                    <td className="p-4 sm:p-5 text-white font-semibold bg-primary/[0.03]">Stake-Weighted Blacklist</td>
                  </tr>

                  {/* Row 4 */}
                  <tr className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-4 sm:p-5 font-semibold text-white">Value Uncertainty & Ranges</td>
                    <td className="p-4 sm:p-5 text-muted-foreground">Single point estimate only</td>
                    <td className="p-4 sm:p-5 text-muted-foreground">Confidence interval parameter</td>
                    <td className="p-4 sm:p-5 text-white font-semibold bg-primary/[0.03]">Native Min / Max Ranges</td>
                  </tr>

                  {/* Row 5 */}
                  <tr className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-4 sm:p-5 font-semibold text-white">Economic Sustainability</td>
                    <td className="p-4 sm:p-5 text-muted-foreground">Grant & VC subsidized</td>
                    <td className="p-4 sm:p-5 text-muted-foreground">User-paid verification fees</td>
                    <td className="p-4 sm:p-5 text-white font-semibold bg-primary/[0.03]">Self-Preserving Reward Pool</td>
                  </tr>

                  {/* Row 6 */}
                  <tr className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-4 sm:p-5 font-semibold text-white">Latency Arbitrage Risk</td>
                    <td className="p-4 sm:p-5 text-muted-foreground">Heartbeat threshold delay</td>
                    <td className="p-4 sm:p-5 text-muted-foreground">User free-option timestamp risk</td>
                    <td className="p-4 sm:p-5 text-white font-semibold bg-primary/[0.03]">Optimal Bounded Delay</td>
                  </tr>

                  {/* Row 7 */}
                  <tr className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-4 sm:p-5 font-semibold text-white">Mathematical Verification</td>
                    <td className="p-4 sm:p-5 text-muted-foreground">Audits only</td>
                    <td className="p-4 sm:p-5 text-muted-foreground">Audits only</td>
                    <td className="p-4 sm:p-5 text-white font-semibold bg-primary/[0.03]">Formally Verified in Rocq</td>
                  </tr>

                  {/* Row 8 */}
                  <tr className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-4 sm:p-5 font-semibold text-white">On-Chain Composition</td>
                    <td className="p-4 sm:p-5 text-muted-foreground">Custom wrapper contracts</td>
                    <td className="p-4 sm:p-5 text-muted-foreground">Multi-signature pull wrappers</td>
                    <td className="p-4 sm:p-5 text-white font-semibold bg-primary/[0.03] rounded-b-xl">Native Composed Oracles</td>
                  </tr>

                </tbody>
              </table>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* ========================================================= */}
      {/* SECTION 4: CALL TO ACTION                                */}
      {/* ========================================================= */}
      <section className="py-20 sm:py-28 md:py-32 px-4 sm:px-6 md:px-8 max-w-5xl mx-auto relative overflow-hidden">
        <ScrollReveal delay={100}>
          <div className="bg-zinc-950/80 border border-white/10 rounded-3xl p-8 sm:p-14 text-center backdrop-blur-md shadow-2xl flex flex-col items-center space-y-6">
            
            <h2 className="text-3xl sm:text-4xl font-medium tracking-tight text-white">
              Ready to build the future?
            </h2>
            
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed max-w-[50ch] text-center px-2 sm:px-0">
              Connect your wallet, configure your weights, and deploy custom oracles in seconds.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4 w-full pt-2">
              <Button 
                asChild 
                size="lg" 
                className="w-full sm:w-auto h-12 sm:h-13 px-7 rounded-full bg-white text-black hover:bg-zinc-200 transition-all duration-300 font-semibold text-xs sm:text-sm tracking-wide shadow-xl active:scale-[0.98]"
              >
                <Link href="/use" className="flex items-center justify-center gap-2">
                  <Database className="h-4 w-4" />
                  <span>Use Oracles</span>
                </Link>
              </Button>

              <Button 
                asChild 
                size="lg" 
                className="w-full sm:w-auto h-12 sm:h-13 px-7 rounded-full bg-primary/20 text-white border border-primary/40 hover:bg-primary/30 transition-all duration-300 font-semibold text-xs sm:text-sm tracking-wide shadow-xl active:scale-[0.98]"
              >
                <Link href="/deploy" className="flex items-center justify-center gap-2">
                  <Boxes className="h-4 w-4 text-primary" />
                  <span>Deploy Oracle</span>
                </Link>
              </Button>

              <Button 
                asChild 
                size="lg" 
                variant="outline"
                className="w-full sm:w-auto h-12 sm:h-13 px-7 rounded-full border-white/10 bg-white/5 hover:bg-white/10 text-white transition-all duration-300 font-semibold text-xs sm:text-sm tracking-wide active:scale-[0.98]"
              >
                <Link href="/operate" className="flex items-center justify-center gap-2">
                  <Terminal className="h-4 w-4 text-zinc-400" />
                  <span>Operate Poster</span>
                </Link>
              </Button>
            </div>

          </div>
        </ScrollReveal>
      </section>
    </div>
  )
}
