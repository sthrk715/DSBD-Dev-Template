'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { BarChart } from '@/components/dashboard/charts/BarChart'
import { LineChartComponent } from '@/components/dashboard/charts/LineChart'
import { ChartContainer } from '@/components/dashboard/ChartContainer'
import { DashboardErrorState } from '@/components/dashboard/DashboardErrorState'
import { useChannelsData } from '@/hooks/use-channels-data'
import { fmtYen, fmtYenMan } from '@/lib/format'
import { EC_CHANNELS } from '@/lib/design-tokens'

const channelSeries = EC_CHANNELS.map((ch) => ({
  key: ch.key, label: ch.label, color: ch.color,
}))

export default function ChannelsPage() {
  const { data, isLoading, isError, refetch } = useChannelsData()

  if (isError) {
    return <div className="px-4 py-8 lg:px-6"><DashboardErrorState onRetry={() => refetch()} /></div>
  }

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-5 md:py-5">
      {/* KPIカード */}
      <div className="@xl/main:grid-cols-2 @5xl/main:grid-cols-4 grid grid-cols-1 gap-4 px-4 lg:px-6">
        {isLoading || !data ? (
          Array.from({ length: 4 }, (_, i) => <Card key={i} className="shadow-xs"><CardContent className="p-4"><Skeleton className="h-16 w-full" /></CardContent></Card>)
        ) : (
          data.channelDetailTable.map((ch) => (
            <Card key={ch.channel} className="shadow-xs">
              <CardHeader className="pb-1 pt-4 px-4">
                <CardTitle className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{ch.channel}</CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <p className="text-xl font-bold tabular-nums">{fmtYen(ch.sales)}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {ch.orders.toLocaleString()}件 · 客単価 {fmtYen(ch.avgPrice)} · 前年比 <span className="font-medium text-foreground">{ch.yoyGrowth >= 0 ? '+' : ''}{ch.yoyGrowth}%</span>
                </p>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 px-4 lg:grid-cols-2 lg:px-6">
        <ChartContainer title="チャネル別月次売上比較" description="月次推移（万円）" isLoading={isLoading}>
          {data && <BarChart data={data.monthlySalesComparison} series={channelSeries} xKey="month" yFormatter={fmtYenMan} showLegend height={280} />}
        </ChartContainer>

        <ChartContainer title="売上トレンド" description="当年 vs 前年" isLoading={isLoading}>
          {data && (
            <LineChartComponent
              data={data.dailySalesTrend.map((d) => ({ date: d.date, 当年: d.sales, 前年: d.prevYearSales }))}
              series={[
                { key: '当年', label: '当年', color: '#1A1A1A' },
                { key: '前年', label: '前年', color: '#B3B3B3' },
              ]}
              xKey="date"
              yFormatter={fmtYenMan}
              height={280}
            />
          )}
        </ChartContainer>
      </div>

      {/* チャネル別KPIテーブル */}
      <div className="px-4 lg:px-6">
        <ChartContainer title="チャネル別KPI詳細" isLoading={isLoading} noPadding>
          {data && (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border bg-muted/40">
                    <th className="px-3 py-2 text-left font-medium text-muted-foreground">チャネル</th>
                    <th className="px-3 py-2 text-right font-medium text-muted-foreground">売上</th>
                    <th className="px-3 py-2 text-right font-medium text-muted-foreground">注文数</th>
                    <th className="px-3 py-2 text-right font-medium text-muted-foreground">客単価</th>
                    <th className="px-3 py-2 text-right font-medium text-muted-foreground">前年比</th>
                    <th className="px-3 py-2 text-right font-medium text-muted-foreground">CVR</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {data.channelDetailTable.map((row) => (
                    <tr key={row.channel} className="hover:bg-muted/30 transition-colors">
                      <td className="px-3 py-2 font-medium">{row.channel}</td>
                      <td className="px-3 py-2 text-right tabular-nums">{fmtYen(row.sales)}</td>
                      <td className="px-3 py-2 text-right tabular-nums">{row.orders.toLocaleString()}</td>
                      <td className="px-3 py-2 text-right tabular-nums">{fmtYen(row.avgPrice)}</td>
                      <td className="px-3 py-2 text-right tabular-nums font-medium">{row.yoyGrowth >= 0 ? '+' : ''}{row.yoyGrowth}%</td>
                      <td className="px-3 py-2 text-right tabular-nums">{row.conversionRate}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </ChartContainer>
      </div>
    </div>
  )
}
