"use client"

import CreateOracleIntegrated from "@/components/createOracle"
import dynamic from "next/dynamic"

const ParticleBackground = dynamic(() => import("@/components/ParticleBackground"), { ssr: false })

export default function DeployPage() {
  return (
    <div className="min-h-screen bg-background font-sans text-foreground overflow-x-hidden selection:bg-primary/30 selection:text-white relative bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,#8b5cf606,transparent),linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:4rem_4rem]">
      {/* High-End Ambient Particle Backdrop */}
      <ParticleBackground />

      <div className="container mx-auto px-4 pt-36 pb-24 relative z-10">
        <div className="mb-12 text-center space-y-4">
          <h1 className="text-4xl sm:text-5xl font-medium tracking-tight leading-tight text-white">
            Create Your Own Oracle
          </h1>
          <p className="text-muted-foreground text-sm max-w-xl mx-auto leading-relaxed">
            Deploy a new Base Oracle, with its own data stream, or a Composed Oracle, combining the data streams of existing oracles.
          </p>
        </div>
        
        <CreateOracleIntegrated />
      </div>
    </div>
  )
}
