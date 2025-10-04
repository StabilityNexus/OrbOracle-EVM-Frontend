"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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
    <Link href={oracleUrl} className="group">
      <Card className="border-border/50 bg-card/30 backdrop-blur-sm hover:bg-card/60 hover:border-primary/20 transition-all duration-300 group-hover:scale-[1.02] rounded-2xl">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-xl font-medium group-hover:text-primary transition-colors mb-2">
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
          <div className="flex items-center justify-between mb-4">
            <Badge
              variant="secondary"
              className="font-light bg-primary/10 text-primary border-primary/20"
            >
              {oracle.category}
            </Badge>
            <div className="text-sm font-medium text-foreground">
              {oracle.price}
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Updates {oracle.updateFrequency}</span>
            <span className="font-medium text-primary/80">
              {oracle.accuracy} accuracy
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
