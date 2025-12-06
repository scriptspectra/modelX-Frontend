"use client"

import { useEffect, useState } from "react"
import { TrendingUp } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  ChartConfig,
  ChartContainer,
} from "@/components/ui/chart"

// ---- STATIC FAKE CHART DATA (unchanged) ----
const chartData = [
  { month: "January", desktop: 152, mobile: 95, tablet: 68, tv: 40, wearable: 22 },
  { month: "February", desktop: 221, mobile: 120, tablet: 75, tv: 50, wearable: 30 },
  { month: "March", desktop: 310, mobile: 160, tablet: 90, tv: 55, wearable: 34 },
  { month: "April", desktop: 180, mobile: 105, tablet: 70, tv: 48, wearable: 28 },
  { month: "May", desktop: 265, mobile: 150, tablet: 88, tv: 60, wearable: 35 },
]

// ---- CONFIG ----
const chartConfig = {
  desktop: { label: "Desktop", color: "var(--chart-1)" },
  mobile: { label: "Mobile", color: "var(--chart-2)" },
  tablet: { label: "Tablet", color: "var(--chart-3)" },
  tv: { label: "TV", color: "var(--chart-4)" },
  wearable: { label: "Wearable", color: "var(--chart-5)" },
} satisfies ChartConfig

// =============================================
//              ✨ FINAL COMPONENT
// =============================================
export function ChartAreaGradient() {

  const [topics, setTopics] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadTopics() {
      try {
        const res = await fetch("/api/stability")
        const json = await res.json()
        setTopics(json.top_keywords || [])
      } catch (err) {
        console.error("Failed to fetch trending topics:", err)
      } finally {
        setLoading(false)
      }
    }
    loadTopics()
  }, [])

  return (
    <Card className="bg-slate-400 border-none md:min-w-[300px]">
      <CardHeader>
        <CardTitle className="font-black">Trending</CardTitle>
        <CardDescription className="text-black">
          Showing the top 5 trending topics in Sri Lanka right now
        </CardDescription>
      </CardHeader>

      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{ left: 12, right: 12 }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />

            <defs>
              <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-desktop)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-desktop)" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-mobile)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-mobile)" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillTablet" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-tablet)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-tablet)" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillTV" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-tv)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-tv)" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillWearable" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-wearable)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-wearable)" stopOpacity={0.1} />
              </linearGradient>
            </defs>

            <Area dataKey="desktop" type="natural" fill="url(#fillDesktop)" fillOpacity={0.4} stroke="var(--color-desktop)" stackId="a" />
            <Area dataKey="mobile" type="natural" fill="url(#fillMobile)" fillOpacity={0.4} stroke="var(--color-mobile)" stackId="a" />
            <Area dataKey="tablet" type="natural" fill="url(#fillTablet)" fillOpacity={0.4} stroke="var(--color-tablet)" stackId="a" />
            <Area dataKey="tv" type="natural" fill="url(#fillTV)" fillOpacity={0.4} stroke="var(--color-tv)" stackId="a" />
            <Area dataKey="wearable" type="natural" fill="url(#fillWearable)" fillOpacity={0.4} stroke="var(--color-wearable)" stackId="a" />
          </AreaChart>
        </ChartContainer>
      </CardContent>

      {/* ===== TRENDING TOPICS (TEXT) ===== */}
      <CardFooter>
        <div className="flex flex-col w-full gap-2 text-sm">
          <div className="flex items-center gap-2 font-medium">
            Trending up this week <TrendingUp className="h-4 w-4" />
          </div>

          {/* list of trending topics */}
          {loading ? (
            <p>Loading topics…</p>
          ) : (
            <ul className="list-disc ml-4 text-black font-semibold">
              {topics.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}
