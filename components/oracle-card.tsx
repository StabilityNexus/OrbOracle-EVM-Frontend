"use client"

import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { useChainId } from "wagmi"
import { Oracle } from "@/hooks/useOracles"

interface OracleCardProps {
  oracle: Oracle
}

export function OracleCard({ oracle }: OracleCardProps) {
  const chainId = useChainId()
  
  // Construct the proper URL with oracle address and chainId
  const oracleUrl = `/o?chainId=${chainId}&oracle=${oracle.address}`
  
  return (
    <Link href={oracleUrl} className="group block">
      <div className="bg-zinc-950/70 border border-white/10 rounded-3xl p-6 sm:p-7 backdrop-blur-md shadow-2xl transition-all duration-300 hover:border-white/20 hover:-translate-y-1 flex flex-col justify-between space-y-6 h-full">
        <div className="flex items-start justify-between">
          <div className="flex-1 space-y-2">
            <h3 className="text-xl font-medium tracking-tight text-white transition-colors group-hover:text-primary">
              {oracle.name}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed min-h-[40px] line-clamp-2">
              {oracle.description}
            </p>
          </div>
          <ArrowUpRight className="h-4 w-4 text-muted-foreground/40 group-hover:text-primary group-hover:transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
        </div>

        <div className="space-y-3 pt-4 border-t border-white/5 text-[10px] font-mono text-muted-foreground">
          <div className="flex items-center justify-between">
            <span className="uppercase tracking-wider opacity-60">Last Submission</span>
            <span className="text-white font-semibold">{oracle.lastUpdated}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="uppercase tracking-wider opacity-60">Last Activity</span>
            <span className="text-white font-semibold">{oracle.lastTimestamp}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
