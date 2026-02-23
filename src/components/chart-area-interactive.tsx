"use client"

import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Line,
  LineChart,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"

// ── Brand Counts History by Region（スタックバー） ─────────────
const regionData = Array.from({ length: 18 }, (_, i) => ({
  month: `Jan`,
  Japan:     Math.floor(150 + i * 15 + Math.random() * 60),
  Thailand:  Math.floor(80  + i * 8  + Math.random() * 40),
  HongKong:  Math.floor(60  + i * 6  + Math.random() * 30),
  Indonesia: Math.floor(40  + i * 4  + Math.random() * 20),
  Vietnam:   Math.floor(20  + i * 3  + Math.random() * 15),
}))

const regionConfig = {
  Japan:     { label: "Japan",          color: "#1A1A1A" },
  Thailand:  { label: "Thailand",       color: "#404040" },
  HongKong:  { label: "HongKong/China", color: "#666666" },
  Indonesia: { label: "Indonesia",      color: "#999999" },
  Vietnam:   { label: "Vietnam",        color: "#CCCCCC" },
} satisfies ChartConfig

// ── Direct vs Agency（ドーナツ） ──────────────────────────────
const donutData = [
  { name: "AnyLog",     value: 40, color: "#1A1A1A" },
  { name: "AnyTag",     value: 20, color: "#404040" },
  { name: "AnyX",       value: 10, color: "#666666" },
  { name: "AnyCreator", value: 10, color: "#999999" },
  { name: "AnyChat",    value: 20, color: "#CCCCCC" },
]

// ── Direct vs Agency（ラインチャート） ────────────────────────
const lineData = [
  { month: "Jan", Digital: 200, Influencer: 180, Mobile: 150, Publisher: 130 },
  { month: "Feb", Digital: 220, Influencer: 160, Mobile: 140, Publisher: 120 },
  { month: "Mar", Digital: 180, Influencer: 140, Mobile: 120, Publisher: 110 },
  { month: "Apr", Digital: 160, Influencer: 130, Mobile: 110, Publisher: 100 },
  { month: "May", Digital: 140, Influencer: 120, Mobile: 100, Publisher:  90 },
  { month: "Jun", Digital: 200, Influencer: 170, Mobile: 150, Publisher: 140 },
  { month: "Jul", Digital: 250, Influencer: 210, Mobile: 190, Publisher: 170 },
  { month: "Agu", Digital: 300, Influencer: 260, Mobile: 230, Publisher: 210 },
  { month: "Sep", Digital: 350, Influencer: 300, Mobile: 270, Publisher: 250 },
  { month: "Oct", Digital: 400, Influencer: 340, Mobile: 310, Publisher: 290 },
  { month: "Nov", Digital: 450, Influencer: 380, Mobile: 350, Publisher: 330 },
  { month: "Dec", Digital: 480, Influencer: 410, Mobile: 380, Publisher: 360 },
]

const lineConfig = {
  Digital:    { label: "Digital Marketplace",  color: "#1A1A1A" },
  Influencer: { label: "Influencer Marketing", color: "#404040" },
  Mobile:     { label: "Mobile Marketing",     color: "#999999" },
  Publisher:  { label: "Publisher Growth",     color: "#CCCCCC" },
} satisfies ChartConfig

// ── SGA History / Operating Profit（バー） ────────────────────
const sgaData = Array.from({ length: 18 }, (_, i) => ({
  month: `M${i + 1}`,
  value: Math.floor(100 + Math.random() * 350),
}))

const opData = [
  { month: "M1",  value:  1500000 },
  { month: "M2",  value:  2000000 },
  { month: "M3",  value:   800000 },
  { month: "M4",  value:  -500000 },
  { month: "M5",  value: -1000000 },
  { month: "M6",  value:   500000 },
  { month: "M7",  value:  1200000 },
  { month: "M8",  value:  1800000 },
  { month: "M9",  value:  2200000 },
  { month: "M10", value:  1600000 },
  { month: "M11", value:   900000 },
  { month: "M12", value:  1100000 },
]

const simpleBarConfig = {
  value: { label: "Value", color: "var(--chart-1)" },
} satisfies ChartConfig

// ── ラッパーカード ─────────────────────────────────────────────
function ChartCard({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <Card>
      <CardHeader className="pb-2 pt-4 px-4">
        <CardTitle className="text-sm font-semibold text-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent className="px-2 pb-4">{children}</CardContent>
    </Card>
  )
}

// ── メインコンポーネント ──────────────────────────────────────
export function ChartAreaInteractive() {
  return (
    <div className="space-y-4">
      {/* Brand Counts History by Region (フル幅 × 1) */}
      <ChartCard title="Brand Counts History by Region">
        <ChartContainer config={regionConfig} className="h-[220px] w-full">
          <BarChart data={regionData} barCategoryGap="20%">
            <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="3 3" />
            <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
            <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} width={32} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            {(Object.keys(regionConfig) as (keyof typeof regionConfig)[]).map((key) => (
              <Bar key={key} dataKey={key} stackId="a" fill={regionConfig[key].color} radius={key === "Vietnam" ? [3, 3, 0, 0] : [0, 0, 0, 0]} />
            ))}
          </BarChart>
        </ChartContainer>
      </ChartCard>

      {/* Direct vs Agency (ドーナツ + ライン) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ChartCard title="Direct vs Agency">
          <div className="flex items-center gap-4">
            <ResponsiveContainer width={160} height={160}>
              <PieChart>
                <Pie data={donutData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value" stroke="none">
                  {donutData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <ChartTooltip formatter={(value, name) => [`${value}%`, name]} />
              </PieChart>
            </ResponsiveContainer>
            <ul className="space-y-1.5 text-xs text-muted-foreground">
              {donutData.map((d) => (
                <li key={d.name} className="flex items-center gap-2">
                  <span className="inline-block w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: d.color }} />
                  {d.name} · {d.value}%
                </li>
              ))}
            </ul>
          </div>
        </ChartCard>

        <ChartCard title="Direct vs Agency">
          <ChartContainer config={lineConfig} className="h-[160px] w-full">
            <LineChart data={lineData}>
              <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="3 3" />
              <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} />
              <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} width={28} />
              <ChartTooltip content={<ChartTooltipContent />} />
              {(Object.keys(lineConfig) as (keyof typeof lineConfig)[]).map((key) => (
                <Line key={key} type="monotone" dataKey={key} stroke={lineConfig[key].color} strokeWidth={1.5} dot={false} />
              ))}
            </LineChart>
          </ChartContainer>
        </ChartCard>
      </div>

      {/* SGA History + Operating Profit */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ChartCard title="SGA History">
          <ChartContainer config={simpleBarConfig} className="h-[200px] w-full">
            <BarChart data={sgaData} barCategoryGap="30%">
              <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="3 3" />
              <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} />
              <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} width={28} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="value" fill="var(--chart-1)" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ChartContainer>
        </ChartCard>

        <ChartCard title="Operating Profit History">
          <ChartContainer config={simpleBarConfig} className="h-[200px] w-full">
            <BarChart data={opData} barCategoryGap="30%">
              <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="3 3" />
              <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} />
              <YAxis tickLine={false} axisLine={false} tickFormatter={(v) => v >= 1000000 ? `${(v/1000000).toFixed(0)}M` : v >= 1000 ? `${(v/1000).toFixed(0)}K` : String(v)} tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} width={36} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="value" radius={[3, 3, 0, 0]}>
                {opData.map((entry, i) => (
                  <Cell key={i} fill={entry.value >= 0 ? "var(--chart-1)" : "var(--destructive)"} />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>
        </ChartCard>
      </div>
    </div>
  )
}
