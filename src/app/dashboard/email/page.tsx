'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ComposedChartComponent } from '@/components/dashboard/charts/ComposedChart'
import { BarChart } from '@/components/dashboard/charts/BarChart'
import { fmtYen, fmtCount, fmtPct } from '@/lib/mock-data'

// ── KPI ──────────────────────────────────────────────────────
const EMAIL_KPI = [
  { label: '月間配信数',     value: '125,000',     trend: '+5.2%' },
  { label: '開封率',         value: '24.5%',       trend: '+1.8pt' },
  { label: 'クリック率',     value: '3.8%',        trend: '+0.4pt' },
  { label: '売上貢献額',     value: '¥8,500,000',  trend: '+12.3%' },
]

// ── 配信数 × 開封率 ─────────────────────────────────────────
const DELIVERY_TREND = [
  { week: 'W1',  deliveries: 32000, openRate: 25.2 },
  { week: 'W2',  deliveries: 31500, openRate: 23.8 },
  { week: 'W3',  deliveries: 30800, openRate: 24.1 },
  { week: 'W4',  deliveries: 30700, openRate: 25.4 },
]

// ── キャンペーン別売上貢献 ──────────────────────────────────
const CAMPAIGN_REVENUE = [
  { campaign: '週次NL 2/3',   revenue: 2100 },
  { campaign: '週次NL 2/10',  revenue: 1950 },
  { campaign: 'バレンタイン特集', revenue: 2800 },
  { campaign: '週次NL 2/17',  revenue: 1650 },
]

// ── キャンペーン別パフォーマンス ─────────────────────────────
const CAMPAIGN_TABLE = [
  { name: '週次NL 2/3',       deliveries: 32000, opens: 8064,  clicks: 1216, revenue: 2100000 },
  { name: '週次NL 2/10',      deliveries: 31500, opens: 7497,  clicks: 1197, revenue: 1950000 },
  { name: 'バレンタイン特集',   deliveries: 31000, opens: 8370,  clicks: 1550, revenue: 2800000 },
  { name: '週次NL 2/17',      deliveries: 30500, opens: 7137,  clicks: 1098, revenue: 1650000 },
]

export default function EmailPage() {
  return (
    <div className="flex flex-col gap-4 py-4 md:gap-5 md:py-5">
      {/* KPIカード */}
      <div className="@xl/main:grid-cols-2 @5xl/main:grid-cols-4 grid grid-cols-1 gap-4 px-4 lg:px-6">
        {EMAIL_KPI.map((kpi) => (
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

      <div className="grid grid-cols-1 gap-4 px-4 lg:grid-cols-2 lg:px-6">
        {/* 配信数 × 開封率 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold">配信数 × 開封率</CardTitle>
            <CardDescription>週次推移</CardDescription>
          </CardHeader>
          <CardContent>
            <ComposedChartComponent
              data={DELIVERY_TREND}
              series={[
                { key: 'deliveries', label: '配信数', type: 'bar', yAxisId: 'left', color: '#1A1A1A' },
                { key: 'openRate', label: '開封率', type: 'line', yAxisId: 'right', color: '#666666' },
              ]}
              xKey="week"
              yFormatter={fmtCount}
              yRightFormatter={fmtPct}
              showRightAxis
              height={260}
            />
          </CardContent>
        </Card>

        {/* キャンペーン別売上貢献 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold">キャンペーン別売上貢献</CardTitle>
            <CardDescription>万円</CardDescription>
          </CardHeader>
          <CardContent>
            <BarChart
              data={CAMPAIGN_REVENUE}
              series={[{ key: 'revenue', label: '売上貢献', color: '#1A1A1A' }]}
              xKey="campaign"
              yFormatter={(v: number) => `¥${v.toLocaleString()}万`}
              height={260}
            />
          </CardContent>
        </Card>
      </div>

      {/* キャンペーン別パフォーマンステーブル */}
      <div className="px-4 lg:px-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold">キャンペーン別パフォーマンス</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border bg-muted/40">
                    <th className="px-3 py-2 text-left font-medium text-muted-foreground">キャンペーン</th>
                    <th className="px-3 py-2 text-right font-medium text-muted-foreground">配信数</th>
                    <th className="px-3 py-2 text-right font-medium text-muted-foreground">開封数</th>
                    <th className="px-3 py-2 text-right font-medium text-muted-foreground">クリック数</th>
                    <th className="px-3 py-2 text-right font-medium text-muted-foreground">開封率</th>
                    <th className="px-3 py-2 text-right font-medium text-muted-foreground">売上貢献</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {CAMPAIGN_TABLE.map((row) => (
                    <tr key={row.name} className="hover:bg-muted/30 transition-colors">
                      <td className="px-3 py-2 text-foreground font-medium">{row.name}</td>
                      <td className="px-3 py-2 text-right tabular-nums">{row.deliveries.toLocaleString()}</td>
                      <td className="px-3 py-2 text-right tabular-nums">{row.opens.toLocaleString()}</td>
                      <td className="px-3 py-2 text-right tabular-nums">{row.clicks.toLocaleString()}</td>
                      <td className="px-3 py-2 text-right tabular-nums">{((row.opens / row.deliveries) * 100).toFixed(1)}%</td>
                      <td className="px-3 py-2 text-right tabular-nums font-medium">{fmtYen(row.revenue)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
