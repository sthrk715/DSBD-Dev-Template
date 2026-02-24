'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { ComposedChartComponent } from '@/components/dashboard/charts/ComposedChart'
import { ChartContainer } from '@/components/dashboard/ChartContainer'
import { DashboardErrorState } from '@/components/dashboard/DashboardErrorState'
import { useEmailData } from '@/hooks/use-email-data'
import { fmtYen, fmtPct, fmtCount } from '@/lib/format'
import type { KpiValue } from '@/lib/data-service/types'

function SimpleKpiCard({ label, kpi, formatter }: { label: string; kpi: KpiValue; formatter: (v: number) => string }) {
  const trend = kpi.changeRate ?? 0
  return (
    <Card className="shadow-xs">
      <CardHeader className="pb-0.5 pt-2 px-3">
        <CardTitle className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</CardTitle>
      </CardHeader>
      <CardContent className="px-3 pb-3">
        <p className="text-lg font-bold tabular-nums">{formatter(kpi.value)}</p>
        {kpi.changeRate !== undefined && (
          <p className="text-xs text-muted-foreground mt-1">
            <span className={`font-medium ${trend >= 0 ? 'text-foreground' : 'text-red-600'}`}>{trend >= 0 ? '+' : ''}{trend.toFixed(1)}%</span>
          </p>
        )}
      </CardContent>
    </Card>
  )
}

export default function EmailPage() {
  const { data, isLoading, isError, refetch } = useEmailData()

  if (isError) {
    return <div className="px-4 py-8 lg:px-6"><DashboardErrorState onRetry={() => refetch()} /></div>
  }

  return (
    <div className="flex flex-col gap-3 py-3 md:gap-4 md:py-4">
      <div className="@xl/main:grid-cols-2 @5xl/main:grid-cols-4 grid grid-cols-1 gap-3 px-4 lg:px-6">
        {isLoading || !data ? (
          Array.from({ length: 4 }, (_, i) => <Card key={i} className="shadow-xs"><CardContent className="p-3"><Skeleton className="h-10 w-full" /></CardContent></Card>)
        ) : (
          <>
            <SimpleKpiCard label="月間配信数" kpi={data.kpis.sentCount} formatter={fmtCount} />
            <SimpleKpiCard label="開封率" kpi={data.kpis.openRate} formatter={fmtPct} />
            <SimpleKpiCard label="クリック率" kpi={data.kpis.clickRate} formatter={fmtPct} />
            <SimpleKpiCard label="メール単価売上" kpi={data.kpis.revenuePerEmail} formatter={fmtYen} />
          </>
        )}
      </div>

      <div className="px-4 lg:px-6">
        <ChartContainer title="開封率・クリック率推移" description="月次推移" isLoading={isLoading}>
          {data && (
            <ComposedChartComponent
              data={data.openRateTrend}
              series={[
                { key: 'openRate', label: '開封率', type: 'bar', yAxisId: 'left', color: '#1A1A1A' },
                { key: 'clickRate', label: 'クリック率', type: 'line', yAxisId: 'left', color: '#666666' },
              ]}
              xKey="month"
              yFormatter={fmtPct}
              showLegend
              height={280}
            />
          )}
        </ChartContainer>
      </div>

      <div className="px-4 lg:px-6">
        <ChartContainer title="キャンペーン別パフォーマンス" isLoading={isLoading} noPadding>
          {data && (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border bg-muted/40">
                    <th className="px-3 py-2 text-left font-medium text-muted-foreground">キャンペーン</th>
                    <th className="px-3 py-2 text-right font-medium text-muted-foreground">配信数</th>
                    <th className="px-3 py-2 text-right font-medium text-muted-foreground">開封数</th>
                    <th className="px-3 py-2 text-right font-medium text-muted-foreground">クリック数</th>
                    <th className="px-3 py-2 text-right font-medium text-muted-foreground">開封率</th>
                    <th className="px-3 py-2 text-right font-medium text-muted-foreground">クリック率</th>
                    <th className="px-3 py-2 text-right font-medium text-muted-foreground">売上貢献</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {data.campaignPerformance.map((row) => (
                    <tr key={row.campaign} className="hover:bg-muted/30 transition-colors">
                      <td className="px-3 py-2 text-foreground font-medium">{row.campaign}</td>
                      <td className="px-3 py-2 text-right tabular-nums">{row.sent.toLocaleString()}</td>
                      <td className="px-3 py-2 text-right tabular-nums">{row.opened.toLocaleString()}</td>
                      <td className="px-3 py-2 text-right tabular-nums">{row.clicked.toLocaleString()}</td>
                      <td className="px-3 py-2 text-right tabular-nums">{fmtPct(row.openRate)}</td>
                      <td className="px-3 py-2 text-right tabular-nums">{fmtPct(row.clickRate)}</td>
                      <td className="px-3 py-2 text-right tabular-nums font-medium">{fmtYen(row.revenue)}</td>
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
