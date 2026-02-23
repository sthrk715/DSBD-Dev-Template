'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart } from '@/components/dashboard/charts/BarChart'
import { AreaLineChart } from '@/components/dashboard/charts/AreaLineChart'
import { DonutChart } from '@/components/dashboard/charts/DonutChart'
import { fmtYenMan } from '@/lib/mock-data'

// ── KPI ──────────────────────────────────────────────────────
const GIFT_KPI = [
  { label: 'シーズン累計売上', value: '¥77,300,000', trend: '+14.2%' },
  { label: '前年比',           value: '+14.2%',       trend: '前年 ¥67,700,000' },
  { label: 'eギフト比率',      value: '54.3%',        trend: '+8.5pt' },
]

// ── シーズン別売上比較 ───────────────────────────────────────
const SEASON_SALES = [
  { season: '母の日',   当年: 1250, 前年: 1080 },
  { season: 'お中元',   当年: 1820, 前年: 1650 },
  { season: '敬老の日', 当年: 890,  前年: 780 },
  { season: 'お歳暮',   当年: 2210, 前年: 1980 },
  { season: '福箱',     当年: 1560, 前年: 1320 },
]

// ── シーズン内累積推移（お歳暮シーズン例） ──────────────────
const CUMULATIVE_DATA = Array.from({ length: 30 }, (_, i) => ({
  day: `${i + 1}日目`,
  当年: Math.floor(500000 * (1 - Math.exp(-0.08 * (i + 1))) + i * 50000),
  前年: Math.floor(450000 * (1 - Math.exp(-0.07 * (i + 1))) + i * 42000),
}))

// ── eギフト vs 実物ギフト ────────────────────────────────────
const GIFT_TYPE = [
  { name: 'eギフト',   value: 42000000, color: '#1A1A1A' },
  { name: '実物ギフト', value: 35300000, color: '#999999' },
]

export default function GiftPage() {
  const giftTotal = GIFT_TYPE.reduce((s, d) => s + d.value, 0)

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-5 md:py-5">
      {/* KPIカード */}
      <div className="@xl/main:grid-cols-3 grid grid-cols-1 gap-4 px-4 lg:px-6">
        {GIFT_KPI.map((kpi) => (
          <Card key={kpi.label} className="shadow-xs">
            <CardHeader className="pb-1 pt-4 px-4">
              <CardTitle className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{kpi.label}</CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <p className="text-xl font-bold tabular-nums">{kpi.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{kpi.trend}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* シーズン別売上比較 */}
      <div className="px-4 lg:px-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold">シーズン別売上比較</CardTitle>
            <CardDescription>当年 vs 前年（万円）</CardDescription>
          </CardHeader>
          <CardContent>
            <BarChart
              data={SEASON_SALES}
              series={[
                { key: '当年', label: '当年', color: '#1A1A1A' },
                { key: '前年', label: '前年', color: '#CCCCCC' },
              ]}
              xKey="season"
              yFormatter={fmtYenMan}
              showLegend
              height={280}
            />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 px-4 lg:grid-cols-2 lg:px-6">
        {/* シーズン内累積推移 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold">シーズン内累積売上推移</CardTitle>
            <CardDescription>お歳暮シーズン 当年 vs 前年</CardDescription>
          </CardHeader>
          <CardContent>
            <AreaLineChart
              data={CUMULATIVE_DATA}
              series={[
                { key: '当年', label: '当年累積', color: '#1A1A1A' },
                { key: '前年', label: '前年累積', color: '#B3B3B3' },
              ]}
              xKey="day"
              yFormatter={fmtYenMan}
              showLegend
              height={260}
            />
          </CardContent>
        </Card>

        {/* eギフト構成比 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold">eギフト vs 実物ギフト</CardTitle>
            <CardDescription>ギフト種別売上構成比</CardDescription>
          </CardHeader>
          <CardContent>
            <DonutChart
              data={GIFT_TYPE}
              centerValue={`¥${(giftTotal / 100000000).toFixed(1)}億`}
              centerLabel="ギフト合計"
              formatter={fmtYenMan}
              height={260}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
