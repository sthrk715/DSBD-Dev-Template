'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { AreaLineChart } from '@/components/dashboard/charts/AreaLineChart'
import { ChartContainer } from '@/components/dashboard/ChartContainer'
import { DashboardErrorState } from '@/components/dashboard/DashboardErrorState'
import { useAccessData } from '@/hooks/use-access-data'
import { fmtCount, fmtPct } from '@/lib/format'
import type { KpiValue } from '@/lib/data-service/types'

function SimpleKpiCard({ label, kpi, formatter }: { label: string; kpi: KpiValue; formatter: (v: number) => string }) {
  const trend = kpi.changeRate ?? 0
  return (
    <Card className="shadow-xs">
      <CardHeader className="pb-1 pt-4 px-4">
        <CardTitle className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-4">
        <p className="text-xl font-bold tabular-nums">{formatter(kpi.value)}</p>
        <p className="text-xs text-muted-foreground mt-1">
          <span className={`font-medium ${trend >= 0 ? 'text-foreground' : 'text-red-600'}`}>{trend >= 0 ? '+' : ''}{trend.toFixed(1)}%</span>
        </p>
      </CardContent>
    </Card>
  )
}

export default function AccessPage() {
  const { data, isLoading, isError, refetch } = useAccessData()

  if (isError) {
    return <div className="px-4 py-8 lg:px-6"><DashboardErrorState onRetry={() => refetch()} /></div>
  }

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-5 md:py-5">
      <div className="@xl/main:grid-cols-2 @5xl/main:grid-cols-4 grid grid-cols-1 gap-4 px-4 lg:px-6">
        {isLoading || !data ? (
          Array.from({ length: 4 }, (_, i) => <Card key={i} className="shadow-xs"><CardContent className="p-4"><Skeleton className="h-16 w-full" /></CardContent></Card>)
        ) : (
          <>
            <SimpleKpiCard label="総セッション数" kpi={data.kpis.sessions} formatter={fmtCount} />
            <SimpleKpiCard label="ページビュー" kpi={data.kpis.pageViews} formatter={fmtCount} />
            <SimpleKpiCard label="CVR" kpi={data.kpis.cvr} formatter={fmtPct} />
            <SimpleKpiCard label="直帰率" kpi={data.kpis.bounceRate} formatter={fmtPct} />
          </>
        )}
      </div>

      <div className="px-4 lg:px-6">
        <ChartContainer title="セッション数推移（自社EC / GA4）" description="日次セッション数" isLoading={isLoading}>
          {data && (
            <AreaLineChart
              data={data.sessionTrend.map((d) => ({ date: d.date, sessions: d.sessions }))}
              series={[{ key: 'sessions', label: 'セッション数', color: '#1A1A1A' }]}
              xKey="date"
              yFormatter={fmtCount}
              height={260}
            />
          )}
        </ChartContainer>
      </div>

      <div className="grid grid-cols-1 gap-4 px-4 lg:grid-cols-2 lg:px-6">
        <ChartContainer title="チャネル別CVR" description="セッション数と転換率" isLoading={isLoading} noPadding>
          {data && (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border bg-muted/40">
                    <th className="px-3 py-2 text-left font-medium text-muted-foreground">チャネル</th>
                    <th className="px-3 py-2 text-right font-medium text-muted-foreground">セッション</th>
                    <th className="px-3 py-2 text-right font-medium text-muted-foreground">CV数</th>
                    <th className="px-3 py-2 text-right font-medium text-muted-foreground">CVR</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {data.cvrByChannel.map((row) => (
                    <tr key={row.channel} className="hover:bg-muted/30 transition-colors">
                      <td className="px-3 py-2 font-medium">{row.channel}</td>
                      <td className="px-3 py-2 text-right tabular-nums">{row.sessions.toLocaleString()}</td>
                      <td className="px-3 py-2 text-right tabular-nums">{row.conversions.toLocaleString()}</td>
                      <td className="px-3 py-2 text-right tabular-nums font-medium">{row.cvr}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </ChartContainer>

        <ChartContainer title="ランディングページ上位" description="セッション数 / 直帰率 / CVR" isLoading={isLoading} noPadding>
          {data && (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border bg-muted/40">
                    <th className="px-3 py-2 text-left font-medium text-muted-foreground">ページ</th>
                    <th className="px-3 py-2 text-right font-medium text-muted-foreground">セッション</th>
                    <th className="px-3 py-2 text-right font-medium text-muted-foreground">直帰率</th>
                    <th className="px-3 py-2 text-right font-medium text-muted-foreground">CVR</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {data.topLandingPages.map((row) => (
                    <tr key={row.page} className="hover:bg-muted/30 transition-colors">
                      <td className="px-3 py-2 font-medium truncate max-w-[200px]">{row.page}</td>
                      <td className="px-3 py-2 text-right tabular-nums">{row.sessions.toLocaleString()}</td>
                      <td className="px-3 py-2 text-right tabular-nums">{row.bounceRate}%</td>
                      <td className="px-3 py-2 text-right tabular-nums font-medium">{row.cvr}%</td>
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
