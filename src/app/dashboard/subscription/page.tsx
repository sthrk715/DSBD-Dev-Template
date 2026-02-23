'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { AreaLineChart } from '@/components/dashboard/charts/AreaLineChart'
import { LineChartComponent } from '@/components/dashboard/charts/LineChart'
import { CohortHeatmap } from '@/components/organisms/cohort-heatmap'
import { ChartContainer } from '@/components/dashboard/ChartContainer'
import { DashboardErrorState } from '@/components/dashboard/DashboardErrorState'
import { useSubscriptionData } from '@/hooks/use-subscription-data'
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

export default function SubscriptionPage() {
  const { data, isLoading, isError, refetch } = useSubscriptionData()

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
          <>
            <SimpleKpiCard label="アクティブ契約数" kpi={data.kpis.activeContracts} formatter={fmtCount} />
            <SimpleKpiCard label="当月新規契約" kpi={data.kpis.newContracts} formatter={fmtCount} />
            <SimpleKpiCard label="月次解約率" kpi={data.kpis.churnRate} formatter={fmtPct} />
            <SimpleKpiCard label="スキップ率" kpi={data.kpis.skipRate} formatter={fmtPct} />
          </>
        )}
      </div>

      {/* 契約者数推移 */}
      <div className="px-4 lg:px-6">
        <ChartContainer title="契約者数推移" description="アクティブ / 一時停止 / 解約" isLoading={isLoading}>
          {data && (
            <AreaLineChart
              data={data.contractTrend}
              series={[
                { key: 'active', label: 'アクティブ', color: '#1A1A1A' },
                { key: 'paused', label: '一時停止', color: '#999999' },
                { key: 'churned', label: '解約', color: '#CCCCCC' },
              ]}
              xKey="month"
              yFormatter={fmtCount}
              stacked
              showLegend
              height={300}
            />
          )}
        </ChartContainer>
      </div>

      <div className="grid grid-cols-1 gap-4 px-4 lg:grid-cols-2 lg:px-6">
        {/* コホート分析 */}
        <ChartContainer title="サブスクコホート分析" description="月次コホート別残存率" isLoading={isLoading}>
          {data && <CohortHeatmap data={data.cohortHeatmap} height={300} />}
        </ChartContainer>

        {/* 月次解約率 */}
        <ChartContainer title="月次解約率推移" description="月別チャーンレート（%）" isLoading={isLoading}>
          {data && (
            <LineChartComponent
              data={data.monthlyChurnTrend}
              series={[{ key: 'churnRate', label: '解約率', color: '#1A1A1A' }]}
              xKey="month"
              yFormatter={fmtPct}
              showDots
              height={240}
            />
          )}
        </ChartContainer>
      </div>
    </div>
  )
}
