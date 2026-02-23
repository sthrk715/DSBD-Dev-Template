'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ComposedChartComponent } from '@/components/dashboard/charts/ComposedChart'
import { DonutChart } from '@/components/dashboard/charts/DonutChart'
import { EC_CHANNELS } from '@/lib/design-tokens'
import { fmtYenMan, fmtYen } from '@/lib/mock-data'

// ── 日次売上推移（当年棒 + 前年線） ──────────────────────────
const DAILY_SALES = Array.from({ length: 28 }, (_, i) => ({
  date: `2/${i + 1}`,
  当年: Math.floor(1800000 + Math.random() * 800000 + i * 20000),
  前年: Math.floor(1600000 + Math.random() * 600000 + i * 15000),
}))

// ── チャネル別売上構成 ───────────────────────────────────────
const CHANNEL_COMPOSITION = EC_CHANNELS.map((ch, i) => ({
  name: ch.label,
  value: [32000000, 18500000, 14200000, 7640000][i],
  color: ch.color,
}))

// ── チャネル別KPIテーブルデータ ──────────────────────────────
const CHANNEL_KPI = [
  { channel: 'Shopify自社EC',     sales: 32000000, orders: 4200, aov: 7619, yoy: 15.2 },
  { channel: 'Amazon',             sales: 18500000, orders: 3100, aov: 5968, yoy: 8.7 },
  { channel: '楽天市場',            sales: 14200000, orders: 2800, aov: 5071, yoy: 11.3 },
  { channel: 'Yahoo!ショッピング',  sales: 7640000,  orders: 1547, aov: 4940, yoy: 5.1 },
]

export function ChartShowcase() {
  const total = CHANNEL_COMPOSITION.reduce((s, d) => s + d.value, 0)

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      {/* 日次売上推移 */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-sm font-semibold">日次売上推移</CardTitle>
          <CardDescription>当年日次売上（棒）+ 前年同日（線）</CardDescription>
        </CardHeader>
        <CardContent>
          <ComposedChartComponent
            data={DAILY_SALES}
            series={[
              { key: '当年', label: '当年売上', type: 'bar', yAxisId: 'left', color: '#1A1A1A' },
              { key: '前年', label: '前年同日', type: 'line', yAxisId: 'left', color: '#B3B3B3' },
            ]}
            xKey="date"
            yFormatter={fmtYenMan}
            height={280}
          />
        </CardContent>
      </Card>

      {/* チャネル別売上構成比 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold">チャネル別売上構成比</CardTitle>
          <CardDescription>4チャネルの売上比率</CardDescription>
        </CardHeader>
        <CardContent>
          <DonutChart
            data={CHANNEL_COMPOSITION}
            centerValue={`¥${(total / 100000000).toFixed(1)}億`}
            centerLabel="合計売上"
            formatter={fmtYenMan}
            height={240}
          />
        </CardContent>
      </Card>

      {/* チャネル別KPIテーブル */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold">チャネル別KPI</CardTitle>
          <CardDescription>売上・注文・客単価・前年比</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th className="px-3 py-2 text-left font-medium text-muted-foreground">チャネル</th>
                  <th className="px-3 py-2 text-right font-medium text-muted-foreground">売上</th>
                  <th className="px-3 py-2 text-right font-medium text-muted-foreground">注文数</th>
                  <th className="px-3 py-2 text-right font-medium text-muted-foreground">客単価</th>
                  <th className="px-3 py-2 text-right font-medium text-muted-foreground">前年比</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {CHANNEL_KPI.map((row) => (
                  <tr key={row.channel} className="hover:bg-muted/30 transition-colors">
                    <td className="px-3 py-2 text-foreground font-medium">{row.channel}</td>
                    <td className="px-3 py-2 text-right tabular-nums">{fmtYen(row.sales)}</td>
                    <td className="px-3 py-2 text-right tabular-nums">{row.orders.toLocaleString()}</td>
                    <td className="px-3 py-2 text-right tabular-nums">{fmtYen(row.aov)}</td>
                    <td className={`px-3 py-2 text-right tabular-nums font-medium ${row.yoy >= 0 ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {row.yoy >= 0 ? '+' : ''}{row.yoy}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
