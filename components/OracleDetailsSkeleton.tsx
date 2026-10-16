"use client";

import { ArrowLeft } from "lucide-react";

export function OracleDetailsSkeleton() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white relative overflow-x-hidden font-sans">
      {/* Cosmic Blueprint Radar Grid Backdrop */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-40">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_100%_200px,#8b5cf60c,transparent)]" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 pt-28 pb-20 relative z-10">
        <div className="max-w-6xl mx-auto space-y-8">
          
          {/* Header */}
          <div className="space-y-6">
            {/* Top Line: Back to Explorer (Left) & Active Status (Right) */}
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center text-xs font-mono tracking-widest text-zinc-500 uppercase">
                <ArrowLeft className="h-3.5 w-3.5 mr-2 opacity-50" />
                <span className="h-3 w-28 rounded bg-white/10 animate-pulse inline-block" />
              </div>

              <div className="h-6 w-20 rounded-full bg-emerald-500/10 border border-emerald-500/20 animate-pulse" />
            </div>

            {/* Below that Line: Centered Name & Description with breathing space */}
            <div className="text-center pt-2 sm:pt-4 pb-4 sm:pb-6 space-y-3">
              <div className="h-9 sm:h-11 w-64 sm:w-80 mx-auto rounded-2xl bg-white/10 animate-pulse" />
              <div className="h-4 w-44 sm:w-60 mx-auto rounded-lg bg-white/5 animate-pulse" />
            </div>
          </div>

          {/* Addresses 2-Column Grid */}
          <div className="grid gap-4 md:grid-cols-2 pt-2">
            <div className="bg-zinc-950/70 border border-white/10 rounded-3xl p-5 text-left backdrop-blur-md shadow-xl space-y-3">
              <div className="h-3 w-36 rounded bg-white/10 animate-pulse" />
              <div className="h-12 w-full rounded-xl bg-black/40 border border-white/5 animate-pulse flex items-center justify-between px-4">
                <div className="h-3.5 w-3/4 rounded bg-white/10" />
                <div className="h-4 w-4 rounded bg-white/10" />
              </div>
            </div>

            <div className="bg-zinc-950/70 border border-white/10 rounded-3xl p-5 text-left backdrop-blur-md shadow-xl space-y-3">
              <div className="h-3 w-36 rounded bg-white/10 animate-pulse" />
              <div className="h-12 w-full rounded-xl bg-black/40 border border-white/5 animate-pulse flex items-center justify-between px-4">
                <div className="h-3.5 w-3/4 rounded bg-white/10" />
                <div className="h-4 w-4 rounded bg-white/10" />
              </div>
            </div>
          </div>

          {/* Chart Card Skeleton */}
          <div className="bg-zinc-950/70 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-md shadow-2xl space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-white/5 pb-4">
              <div className="space-y-2">
                <div className="h-4 w-44 rounded bg-white/10 animate-pulse" />
                <div className="h-7 w-32 rounded bg-white/10 animate-pulse" />
              </div>
              <div className="flex items-center gap-2">
                <div className="h-7 w-24 rounded-full bg-white/5 border border-white/10 animate-pulse" />
                <div className="h-7 w-24 rounded-full bg-white/5 border border-white/10 animate-pulse" />
              </div>
            </div>

            {/* Chart Area Box */}
            <div className="h-64 sm:h-80 w-full rounded-2xl bg-black/40 border border-white/5 animate-pulse flex flex-col items-center justify-center gap-3">
              <div className="w-8 h-8 rounded-full border-2 border-white/10 border-t-primary animate-spin" />
              <span className="font-mono text-[11px] uppercase tracking-widest text-zinc-500">
                Loading Oracle Telemetry…
              </span>
            </div>
          </div>

          {/* Interaction Form Skeleton Grid */}
          <div className="grid gap-6 md:grid-cols-2">
            <div className="bg-zinc-950/70 border border-white/10 rounded-3xl p-6 backdrop-blur-md shadow-xl space-y-4">
              <div className="h-4 w-36 rounded bg-white/10 animate-pulse" />
              <div className="h-24 w-full rounded-2xl bg-black/30 border border-white/5 animate-pulse" />
              <div className="h-10 w-full rounded-xl bg-white/5 border border-white/10 animate-pulse" />
            </div>

            <div className="bg-zinc-950/70 border border-white/10 rounded-3xl p-6 backdrop-blur-md shadow-xl space-y-4">
              <div className="h-4 w-36 rounded bg-white/10 animate-pulse" />
              <div className="h-24 w-full rounded-2xl bg-black/30 border border-white/5 animate-pulse" />
              <div className="h-10 w-full rounded-xl bg-white/5 border border-white/10 animate-pulse" />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
