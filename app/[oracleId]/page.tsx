import { notFound } from 'next/navigation'
import InteractionClient from './InteractionClient'
import { Suspense } from 'react'
import ParticleBackground from "@/components/ParticleBackground"

import { OracleDetailsSkeleton } from "@/components/OracleDetailsSkeleton"

export async function generateStaticParams() {
  return [{ oracleId: 'o' }]
}

export default function OraclePage() {
  return (
    <div className="min-h-screen bg-background font-sans text-foreground overflow-x-hidden selection:bg-primary/30 selection:text-white relative bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,#8b5cf606,transparent),linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:4rem_4rem]">
      {/* High-End Ambient Particle Backdrop */}
      <ParticleBackground />

      <Suspense fallback={<OracleDetailsSkeleton />}>
        <InteractionClient />
      </Suspense>
    </div>
  )
}
