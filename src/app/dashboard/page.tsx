'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { ComposedChartComponent } from '@/components/dashboard/charts/ComposedChart'
import { DonutChart } from '@/components/dashboard/charts/DonutChart'
import { ChartContainer } from '@/components/dashboard/ChartContainer'
import { DashboardErrorState } from '@/components/dashboard/DashboardErrorState'
import { useExecutiveData } from '@/hooks/use-executive-data'
import { fmtYen, fmtYenMan } from '@/lib/format'
import { EC_CHANNELS } from '@/lib/design-tokens'
import type { KpiValue } from '@/lib/data-service/types'

function KpiSkeleton() {
  return (
    <Card className="shadow-xs">
      <CardContent className="px-4 py-4 space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-4 w-20" />
      </CardContent>
    </Card>
  )
}

function ExecKpiCard({ title, kpi, formatter }: { title: string; kpi: KpiValue; formatter?: (v: number) => string }) {
  const fmt = formatter ?? ((v: number) => v.toLocaleString())
  const trend = kpi.changeRate ?? 0
  return (
    <Card className="shadow-xs">
      <CardHeader className="pb-1 pt-4 px-4">
        <CardTitle className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-4">
        <p className="text-xl font-bold tabular-nums">{fmt(kpi.value)}</p>
        <p className="text-xs text-muted-foreground mt-1">
          前年 {fmt(kpi.previousValue ?? 0)} · <span className={`font-medium ${trend >= 0 ? 'text-foreground' : 'text-red-600'}`}>{trend >= 0 ? '+' : ''}{trend.toFixed(1)}%</span>
        </p>
      </CardContent>
    </Card>
  )
}

export default function Page() {
  const { data, isLoading, isError, refetch } = useExecutiveData()

  if (isError) {
    return (
      <div className="px-4 py-8 lg:px-6">
        <DashboardErrorState onRetry={() => refetch()} />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-5 md:py-5">
      {/* KPIカード */}
      <div className="@xl/main:grid-cols-2 @5xl/main:grid-cols-4 grid grid-cols-1 gap-4 px-4 lg:px-6">
        {isLoading || !data ? (
          <>
            <KpiSkeleton /><KpiSkeleton /><KpiSkeleton /><KpiSkeleton />
          </>
        ) : (
          <>
            <ExecKpiCard title="合計売上（4チャネル）" kpi={data.kpis.totalSales} formatter={fmtYen} />
            <ExecKpiCard title="目標達成率" kpi={data.kpis.targetAchievement} formatter={(v) => `${v.toFixed(1)}%`} />
            <ExecKpiCard title="前年同月比" kpi={data.kpis.yoyGrowth} formatter={(v) => `${v >= 0 ? '+' : ''}${v.toFixed(1)}%`} />
            <ExecKpiCard title="注文件数" kpi={data.kpis.orderCount} formatter={(v) => `${v.toLocaleString()}件`} />
          </>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 px-4 lg:grid-cols-2 lg:px-6">
        {/* 日次売上推移 */}
        <ChartContainer
          title="日次売上推移"
          description="当年日次売上（棒）+ 前年同日（線）"
          isLoading={isLoading}
          isError={isError}
          onRetry={() => refetch()}
          className="lg:col-span-2"
        >
          {data && (
            <ComposedChartComponent
              data={data.dailySalesTrend.map((d) => ({ date: d.date, 当年: d.sales, 前年: d.prevYearSales }))}
              series={[
                { key: '当年', label: '当年売上', type: 'bar', yAxisId: 'left', color: '#1A1A1A' },
                { key: '前年', label: '前年同日', type: 'line', yAxisId: 'left', color: '#B3B3B3' },
              ]}
              xKey="date"
              yFormatter={fmtYenMan}
              height={280}
            />
          )}
        </ChartContainer>

        {/* チャネル別売上構成比 */}
        <ChartContainer
          title="チャネル別売上構成比"
          description="4チャネルの売上比率"
          isLoading={isLoading}
          isError={isError}
        >
          {data && (() => {
            const total = data.channelBreakdown.reduce((s, d) => s + d.sales, 0)
            return (
              <DonutChart
                data={data.channelBreakdown.map((d, i) => ({
                  name: d.channel,
                  value: d.sales,
                  color: EC_CHANNELS[i]?.color,
                }))}
                centerValue={`¥${(total / 100000000).toFixed(1)}億`}
                centerLabel="合計売上"
                height={240}
              />
            )
          })()}
        </ChartContainer>

        {/* チャネル別KPIテーブル */}
        <ChartContainer
          title="チャネル別KPI"
          description="売上・注文・客単価・前年比"
          isLoading={isLoading}
          isError={isError}
          noPadding
        >
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
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {data.channelKpiTable.map((row) => (
                    <tr key={row.channel} className="hover:bg-muted/30 transition-colors">
                      <td className="px-3 py-2 font-medium">{row.channel}</td>
                      <td className="px-3 py-2 text-right tabular-nums">{fmtYen(row.sales)}</td>
                      <td className="px-3 py-2 text-right tabular-nums">{row.orders.toLocaleString()}</td>
                      <td className="px-3 py-2 text-right tabular-nums">{fmtYen(row.avgPrice)}</td>
                      <td className="px-3 py-2 text-right tabular-nums font-medium">{row.yoyGrowth >= 0 ? '+' : ''}{row.yoyGrowth}%</td>
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
