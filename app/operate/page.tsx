"use client"

import React, { useState } from "react"
import Link from "next/link"
import { Navigation } from "@/components/navigation"
import ParticleBackground from "@/components/ParticleBackground"
import { Button } from "@/components/ui/button"
import { 
  Terminal, 
  Copy, 
  Check, 
  ArrowRight, 
  ExternalLink, 
  Coins, 
  ShieldCheck, 
  Activity, 
  Cpu, 
  Clock, 
  Layers, 
  Sliders, 
  Code2,
  CheckCircle2
} from "lucide-react"

export default function OperatePage() {
  const [copiedSection, setCopiedSection] = useState<string | null>(null)

  const copyToClipboard = async (text: string, sectionId: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedSection(sectionId)
      setTimeout(() => setCopiedSection(null), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const envSample = `# Network & Operator Wallet
RPC_URL=https://your-rpc-endpoint.example.com
PRIVATE_KEY=0xYOUR_OPERATOR_PRIVATE_KEY
ORACLE_ADDRESS=0xTARGET_BASE_ORACLE_ADDRESS

# Data Sources Configuration (Customizable to any trusted sources)
SOURCE_A_URL=https://api.source-a.org/data
SOURCE_B_URL=https://api.source-b.org/data
SOURCE_C_URL=https://api.source-c.org/data

# Execution Parameters
UPDATE_INTERVAL_MS=60000
MIN_STAKE_REQUIRED=10`

  return (
    <div className="min-h-screen bg-background font-sans text-foreground overflow-x-hidden selection:bg-primary/30 selection:text-white relative bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,#8b5cf606,transparent),linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:4rem_4rem]">
      {/* High-End Ambient Particle Backdrop */}
      <ParticleBackground />

      <Navigation />

      <div className="container mx-auto px-4 sm:px-6 pt-36 pb-24 relative z-10 max-w-6xl">
        
        {/* Header Hero */}
        <div className="mb-16 text-center space-y-4">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-medium tracking-tight leading-tight text-white">
            Operate a Base Oracle
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Run an automated reporter agent using the <span className="text-white font-medium">OrbOracle Poster</span>. Fetch multi-source market rates, compute normalized medians, and submit verified on-chain observations to earn continuous reporter rewards.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-4">
            <Button
              asChild
              className="h-11 sm:h-12 px-6 rounded-full bg-white text-black hover:bg-zinc-200 font-mono text-xs font-semibold tracking-wider transition-all duration-300 shadow-md"
            >
              <Link href="https://github.com/StabilityNexus/OrbOracle-Poster" target="_blank" rel="noopener noreferrer">
                <span>View Poster on GitHub</span>
                <ExternalLink className="ml-2 h-3.5 w-3.5" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="h-11 sm:h-12 px-6 rounded-full border-white/10 bg-white/5 hover:bg-white/10 text-white font-mono text-xs tracking-wider transition-all duration-300"
            >
              <Link href="/use">
                <span>Find Oracles to Operate</span>
                <ArrowRight className="ml-2 h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        </div>

        {/* 3 Key Operational Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          
          {/* Pillar 1 */}
          <div className="bg-zinc-950/70 border border-white/10 rounded-3xl p-6 sm:p-7 backdrop-blur-md shadow-2xl flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                <Activity className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-mono tracking-widest text-primary uppercase font-bold">
                01 // Multi-Source Aggregation
              </span>
              <h3 className="text-lg font-medium text-white">
                Cross-Source Resilience
              </h3>
              <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed">
                The oracle operator can modify the oracle poster to fetch data from a variety of sources that he/she trusts (Source A, Source B, Source C, etc.), computing an 18-decimal normalized median or aggregate before submitting.
              </p>
            </div>
            <div className="pt-2 border-t border-white/5 flex items-center gap-2 font-mono text-[11px] text-muted-foreground">
              <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
              <span>Standardized 18-decimal WAD format</span>
            </div>
          </div>

          {/* Pillar 2 */}
          <div className="bg-zinc-950/70 border border-white/10 rounded-3xl p-6 sm:p-7 backdrop-blur-md shadow-2xl flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                <Coins className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-mono tracking-widest text-primary uppercase font-bold">
                02 // Reporter Rewards
              </span>
              <h3 className="text-lg font-medium text-white">
                Automated Reward Yield
              </h3>
              <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed">
                Every confirmed submission claims a proportional share of the oracle reward reserve. Operators can configure gas limits and update intervals to optimize operational expenses.
              </p>
            </div>
            <div className="pt-2 border-t border-white/5 flex items-center gap-2 font-mono text-[11px] text-muted-foreground">
              <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
              <span>Configured reward percentage per cycle</span>
            </div>
          </div>

          {/* Pillar 3 */}
          <div className="bg-zinc-950/70 border border-white/10 rounded-3xl p-6 sm:p-7 backdrop-blur-md shadow-2xl flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <Clock className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-mono tracking-widest text-blue-400 uppercase font-bold">
                03 // Time-Decay Weight
              </span>
              <h3 className="text-lg font-medium text-white">
                Continuous Weight Dominance
              </h3>
              <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed">
                The weight of a previously submitted value decays continuously based on the configured half-life. Continuous reporting refreshes submitted value weight, maintaining responsive and accurate on-chain consensus.
              </p>
            </div>
            <div className="pt-2 border-t border-white/5 flex items-center gap-2 font-mono text-[11px] text-muted-foreground">
              <CheckCircle2 className="h-3.5 w-3.5 text-blue-400" />
              <span>Decay rate defined by Half-Life parameter</span>
            </div>
          </div>

        </div>

        {/* Prerequisites Checklist */}
        <div className="bg-zinc-950/70 border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-md mb-16 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
            <div>
              <span className="text-[10px] font-mono tracking-widest text-primary uppercase font-bold">
                CHECKLIST
              </span>
              <h2 className="text-xl sm:text-2xl font-medium text-white mt-1">
                Operator Prerequisites
              </h2>
            </div>
            <span className="text-xs font-mono text-zinc-400 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full self-start sm:self-auto">
              3 REQUIRED ITEMS
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            <div className="space-y-2 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
              <div className="flex items-center gap-2 font-mono text-xs text-white font-semibold">
                <span className="w-5 h-5 rounded-full bg-primary/20 text-primary flex items-center justify-center text-[10px]">1</span>
                Staked Weight Token
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed">
                Deposit the required <code className="text-white bg-white/10 px-1.5 py-0.5 rounded text-[11px]">weightToken</code> in the Base Oracle via the <Link href="/use" className="text-primary hover:underline">Oracle detail page</Link> using the <code className="text-white bg-white/10 px-1.5 py-0.5 rounded text-[11px]">depositTokens()</code> function.
              </p>
            </div>

            <div className="space-y-2 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
              <div className="flex items-center gap-2 font-mono text-xs text-white font-semibold">
                <span className="w-5 h-5 rounded-full bg-primary/20 text-primary flex items-center justify-center text-[10px]">2</span>
                Native Gas Balance (ETH)
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed">
                Ensure the operator wallet has native gas tokens (ETH on Mainnet/Sepolia or respective L2) to execute recurring on-chain transactions.
              </p>
            </div>

            <div className="space-y-2 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
              <div className="flex items-center gap-2 font-mono text-xs text-white font-semibold">
                <span className="w-5 h-5 rounded-full bg-primary/20 text-primary flex items-center justify-center text-[10px]">3</span>
                EVM RPC Endpoint
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed">
                Obtain an active EVM JSON-RPC URL matching the chain ID where the target oracle is deployed.
              </p>
            </div>
          </div>
        </div>

        {/* Step-by-Step Setup Guide */}
        <div className="space-y-8 mb-16">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="text-[10px] font-mono tracking-widest text-primary uppercase font-bold">
              DEPLOYMENT // RUNBOOK
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-medium tracking-tight text-white">
              Poster Setup Runbook
            </h2>
            <p className="text-muted-foreground text-xs sm:text-sm">
              Follow these simple steps to configure and launch your automated operator bot.
            </p>
          </div>

          <div className="space-y-6">
            
            {/* Step 1: Clone Repository */}
            <div className="bg-zinc-950/70 border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-xl bg-white/10 text-white font-mono text-xs font-bold flex items-center justify-center border border-white/10">
                    01
                  </span>
                  <h3 className="text-base sm:text-lg font-medium text-white">
                    Clone the Poster Repository & Install Dependencies
                  </h3>
                </div>
                <button
                  onClick={() => copyToClipboard("git clone https://github.com/StabilityNexus/OrbOracle-Poster.git\ncd OrbOracle-Poster\nnpm install", "step1")}
                  className="text-xs font-mono text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors"
                >
                  {copiedSection === "step1" ? <Check className="h-3.5 w-3.5 text-green-400" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copiedSection === "step1" ? "Copied" : "Copy"}</span>
                </button>
              </div>

              <div className="bg-zinc-950 border border-white/10 rounded-xl p-4 font-mono text-xs text-zinc-200 overflow-x-auto">
                <div className="text-zinc-500 mb-1"># Clone repository</div>
                <div className="text-white">git clone https://github.com/StabilityNexus/OrbOracle-Poster.git</div>
                <div className="text-white mt-1">cd OrbOracle-Poster</div>
                <div className="text-zinc-500 mt-3 mb-1"># Install Node.js packages</div>
                <div className="text-white">npm install</div>
              </div>
            </div>

            {/* Step 2: Environment Setup */}
            <div className="bg-zinc-950/70 border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-xl bg-white/10 text-white font-mono text-xs font-bold flex items-center justify-center border border-white/10">
                    02
                  </span>
                  <h3 className="text-base sm:text-lg font-medium text-white">
                    Configure Environment Variables (<code className="text-primary font-mono text-sm">.env</code>)
                  </h3>
                </div>
                <button
                  onClick={() => copyToClipboard(envSample, "step2")}
                  className="text-xs font-mono text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors"
                >
                  {copiedSection === "step2" ? <Check className="h-3.5 w-3.5 text-green-400" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copiedSection === "step2" ? "Copied" : "Copy .env"}</span>
                </button>
              </div>

              <p className="text-xs text-zinc-300 leading-relaxed">
                Create a <code className="text-white bg-white/10 px-1.5 py-0.5 rounded text-[11px]">.env</code> file in the project root by copying <code className="text-white bg-white/10 px-1.5 py-0.5 rounded text-[11px]">.env.example</code>:
              </p>

              <div className="bg-zinc-950 border border-white/10 rounded-xl p-4 font-mono text-xs text-zinc-200 overflow-x-auto">
                <pre className="text-zinc-300">{envSample}</pre>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                  <span className="font-mono text-primary font-bold">ORACLE_ADDRESS</span>
                  <p className="text-zinc-400 text-[11px]">Contract address of the Base Oracle you are reporting to.</p>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                  <span className="font-mono text-primary font-bold">UPDATE_INTERVAL_MS</span>
                  <p className="text-zinc-400 text-[11px]">Frequency in milliseconds (e.g. 60000 for 1-minute cycles).</p>
                </div>
              </div>
            </div>

            {/* Step 3: Launch Bot */}
            <div className="bg-zinc-950/70 border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md space-y-4">
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-xl bg-white/10 text-white font-mono text-xs font-bold flex items-center justify-center border border-white/10">
                  03
                </span>
                <h3 className="text-base sm:text-lg font-medium text-white">
                  Start the Operator Worker
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <span className="font-mono text-xs text-zinc-400 uppercase tracking-wider">Direct Node Execution:</span>
                  <div className="flex items-center justify-between bg-zinc-950 border border-white/10 rounded-xl px-4 py-3 font-mono text-xs text-white">
                    <span>npm start</span>
                    <button
                      onClick={() => copyToClipboard("npm start", "npm-start")}
                      className="text-xs font-mono text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors"
                    >
                      {copiedSection === "npm-start" ? <Check className="h-3.5 w-3.5 text-green-400" /> : <Copy className="h-3.5 w-3.5" />}
                      <span>{copiedSection === "npm-start" ? "Copied" : "Copy"}</span>
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <span className="font-mono text-xs text-zinc-400 uppercase tracking-wider">Docker Compose (Daemon):</span>
                  <div className="flex items-center justify-between bg-zinc-950 border border-white/10 rounded-xl px-4 py-3 font-mono text-xs text-white">
                    <span>docker compose up -d</span>
                    <button
                      onClick={() => copyToClipboard("docker compose up -d", "docker-compose")}
                      className="text-xs font-mono text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors"
                    >
                      {copiedSection === "docker-compose" ? <Check className="h-3.5 w-3.5 text-green-400" /> : <Copy className="h-3.5 w-3.5" />}
                      <span>{copiedSection === "docker-compose" ? "Copied" : "Copy"}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Live Terminal Log Showcase */}
        <div className="bg-zinc-950/80 border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md mb-16 space-y-4">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
              </div>
              <span className="text-xs font-mono text-zinc-400 ml-2">operator-worker.log</span>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
              ACTIVE CYCLE
            </span>
          </div>

          <div className="font-mono text-xs space-y-1.5 text-zinc-300 py-2 leading-relaxed overflow-x-auto">
            <div className="text-zinc-500">Starting Orb Oracle Poster worker...</div>
            <div className="text-zinc-400">Oracle Address: <span className="text-white">0x742d35Cc6634C0532925a3b844Bc454e4438f44e</span></div>
            <div className="text-zinc-400">Interval: <span className="text-primary">60 seconds</span></div>
            <div className="text-zinc-600 pt-2">--- Starting submission cycle at 2026-09-27T02:00:00.000Z ---</div>
            <div className="text-emerald-400">[Stake Verifier] Current stake: 250.0 Tokens</div>
            <div className="text-zinc-400">[Smart Trigger] Conditions optimal for submission. Network Gas Price: 14.2 gwei</div>
            <div className="text-sky-400">[Data Source] Source A: 0.4285</div>
            <div className="text-sky-400">[Data Source] Source B: 0.4281</div>
            <div className="text-sky-400">[Data Source] Source C: 0.4283</div>
            <div className="text-purple-400">[Aggregation] Calculated and Normalized Median Value.</div>
            <div className="text-yellow-400">[Tx Builder] Submitting normalized value: 428300000000000000</div>
            <div className="text-yellow-400">[Tx Builder] Transaction submitted. Hash: 0x9f8b...3e12</div>
            <div className="text-green-400">[Tx Success] Block Number: 7129482, Gas Used: 43280</div>
            <div className="text-zinc-600">--- Cycle Complete ---</div>
          </div>
        </div>

      </div>
    </div>
  )
}
