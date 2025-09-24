"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const mockPriceData = [
  { time: "00:00", price: 2245.67 },
  { time: "04:00", price: 2251.23 },
  { time: "08:00", price: 2248.91 },
  { time: "12:00", price: 2256.45 },
  { time: "16:00", price: 2252.78 },
  { time: "20:00", price: 2259.12 },
  { time: "24:00", price: 2261.89 },
]

export function PriceChart() {
  return (
    <Card className="border-0 bg-transparent">
      <CardHeader className="text-center pb-6">
        <CardTitle className="text-3xl font-light text-primary">Price History</CardTitle>
        <CardDescription className="text-muted-foreground/80 font-light">24-hour price movements</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mockPriceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--primary) / 0.1)" />
              <XAxis 
                dataKey="time" 
                stroke="hsl(var(--muted-foreground))" 
                fontSize={12} 
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))" 
                fontSize={12} 
                domain={["dataMin - 10", "dataMax + 10"]} 
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card) / 0.9)",
                  border: "1px solid hsl(var(--primary) / 0.2)",
                  borderRadius: "12px",
                  color: "hsl(var(--foreground))",
                  backdropFilter: "blur(8px)",
                }}
              />
              <Line 
                type="monotone" 
                dataKey="price" 
                stroke="hsl(var(--primary))" 
                strokeWidth={3} 
                dot={false}
                activeDot={{ r: 6, stroke: "hsl(var(--primary))", strokeWidth: 2, fill: "hsl(var(--background))" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
