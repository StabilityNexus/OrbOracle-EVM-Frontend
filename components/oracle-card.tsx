"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
      <Card className="border border-primary/15 bg-card/40 backdrop-blur-sm rounded-2xl transition-all duration-300 hover:border-primary/40 hover:bg-card/60 hover:shadow-lg group-hover:-translate-y-1">
        <CardHeader className="pb-4 transition-colors duration-300 group-hover:text-primary">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-xl font-medium transition-colors mb-2">
                {oracle.name}
              </CardTitle>
              <CardDescription className="text-sm text-muted-foreground/80 leading-relaxed">
                {oracle.description}
              </CardDescription>
            </div>
            <ArrowUpRight className="h-5 w-5 text-muted-foreground/40 group-hover:text-primary group-hover:transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
          </div>
        </CardHeader>

        <CardContent className="pt-0">

          <div className="space-y-3 text-xs text-muted-foreground">
            <div className="flex items-center justify-between">
              <span className="uppercase tracking-wide text-muted-foreground/70">Last Submission</span>
              <span className="text-foreground/90 font-medium">{oracle.lastSubmissionTime}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="uppercase tracking-wide text-muted-foreground/70">Last Activity</span>
              <span className="text-foreground/90 font-medium">{oracle.lastTimestamp}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
