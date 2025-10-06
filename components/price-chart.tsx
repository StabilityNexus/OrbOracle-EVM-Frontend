"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  type TooltipProps,
} from "recharts"

export type PriceChartPoint = {
  timestamp: number
  aggregated: number
  latest: number
}

type PriceChartProps = {
  data: PriceChartPoint[]
  loading?: boolean
}

const dateFormatter = new Intl.DateTimeFormat(undefined, {
  year: "numeric",
  month: "short",
  day: "2-digit",
})

const timeFormatter = new Intl.DateTimeFormat(undefined, {
  hour: "2-digit",
  minute: "2-digit",
})

const formatDateLabel = (timestamp: number) => {
  if (!timestamp) {
    return "—"
  }
  return dateFormatter.format(new Date(timestamp * 1000))
}

const formatTimeLabel = (timestamp: number) => {
  if (!timestamp) {
    return "—"
  }
  return timeFormatter.format(new Date(timestamp * 1000))
}

const numberFormatter = new Intl.NumberFormat(undefined, {
  minimumFractionDigits: 2,
  maximumFractionDigits: 6,
})

const formatNumber = (value: number) => {
  if (!Number.isFinite(value)) {
    return "0.00"
  }
  return numberFormatter.format(value)
}

type ChartDatum = {
  timestamp: number
  timeLabel: string
  dateLabel: string
  aggregated: number
  latest: number
}

type ChartTooltipProps = TooltipProps<number, string> & {
  payload?: Array<{ payload: ChartDatum }>
}

const TooltipContent = (props: ChartTooltipProps) => {
  const { active, payload } = props

  if (!active || !payload || payload.length === 0) {
    return null
  }

  const datum = payload[0]?.payload as ChartDatum | undefined
  if (!datum) {
    return null
  }

  return (
    <div className="space-y-3 rounded-xl border border-primary/20 bg-card/90 px-4 py-3 shadow-lg backdrop-blur">
      <div className="space-y-1 text-xs text-muted-foreground">
        <div>Date: <span className="text-foreground/90">{datum.dateLabel}</span></div>
        <div>Time: <span className="text-foreground/90">{datum.timeLabel}</span></div>
      </div>
      <div className="space-y-1 text-xs text-muted-foreground">
        <div className="font-semibold uppercase tracking-wide text-primary">Aggregated</div>
        <div className="text-sm font-medium text-foreground">Value: {formatNumber(datum.aggregated)}</div>
      </div>
      <div className="space-y-1 border-t border-border/60 pt-2 text-xs text-muted-foreground">
        <div className="font-semibold uppercase tracking-wide text-foreground">Latest</div>
        <div className="text-sm font-medium text-foreground">Latest: {formatNumber(datum.latest)}</div>
      </div>
    </div>
  )
}

export function PriceChart({ data, loading = false }: PriceChartProps) {
  const chartData: ChartDatum[] = data.map((point) => {
    const dateLabel = formatDateLabel(point.timestamp)
    const timeLabel = formatTimeLabel(point.timestamp)

    return {
      timestamp: point.timestamp,
      timeLabel,
      dateLabel,
      aggregated: point.aggregated,
      latest: point.latest,
    }
  })

  const showEmptyState = !loading && chartData.length === 0

  return (
    <Card className="border-0 bg-transparent">
      <CardHeader className="text-center pb-6">
        <CardTitle className="text-3xl font-light text-primary">Price History</CardTitle>
        <CardDescription className="text-muted-foreground/80 font-light">
          Latest oracle submissions and aggregated values
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80 flex items-center justify-center">
          {showEmptyState ? (
            <div className="text-center space-y-2 text-muted-foreground/80">
              <p className="text-sm">No price history yet.</p>
              <p className="text-xs">Submit a value or refresh after on-chain activity to see the chart.</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 16, right: 24, left: 0, bottom: 24 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--primary) / 0.1)" />
                <XAxis
                  dataKey="timestamp"
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={11}
                  axisLine={false}
                  tickLine={false}
                  tickMargin={16}
                  tickFormatter={(value) => {
                    const numericValue = typeof value === "number" ? value : Number(value)
                    const dateLabel = formatDateLabel(numericValue)
                    const timeLabel = formatTimeLabel(numericValue)
                    return `${dateLabel}\n${timeLabel}`
                  }}
                />
                <YAxis
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={formatNumber}
                />
                <Tooltip content={<TooltipContent />} />
                <Legend verticalAlign="top" height={36} wrapperStyle={{ paddingBottom: 16 }} />
                <Line
                  type="monotone"
                  dataKey="aggregated"
                  name="Aggregated"
                  stroke="#6366f1"
                  strokeWidth={3}
                  dot={{ r: 2 }}
                  activeDot={{ r: 6, stroke: "#6366f1", strokeWidth: 2, fill: "hsl(var(--background))" }}
                  connectNulls
                />
                <Line
                  type="monotone"
                  dataKey="latest"
                  name="Latest"
                  stroke="#f97316"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ r: 2 }}
                  connectNulls
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
