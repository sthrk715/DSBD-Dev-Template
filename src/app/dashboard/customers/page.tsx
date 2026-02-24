'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { StackedBarChart } from '@/components/dashboard/charts/StackedBarChart'
import { BarChart } from '@/components/dashboard/charts/BarChart'
import { LineChartComponent } from '@/components/dashboard/charts/LineChart'
import { ChartContainer } from '@/components/dashboard/ChartContainer'
import { DashboardErrorState } from '@/components/dashboard/DashboardErrorState'
import { useCustomersData } from '@/hooks/use-customers-data'
import { fmtYen, fmtYenMan, fmtPct } from '@/lib/format'
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
        <p className="text-xs text-muted-foreground mt-1">
          <span className={`font-medium ${trend >= 0 ? 'text-foreground' : 'text-red-600'}`}>{trend >= 0 ? '+' : ''}{trend.toFixed(1)}%</span>
        </p>
      </CardContent>
    </Card>
  )
}

export default function CustomersPage() {
  const { data, isLoading, isError, refetch } = useCustomersData()

  if (isError) {
    return <div className="px-4 py-8 lg:px-6"><DashboardErrorState onRetry={() => refetch()} /></div>
  }

  return (
    <div className="flex flex-col gap-3 py-3 md:gap-4 md:py-4">
      <div className="@xl/main:grid-cols-3 grid grid-cols-1 gap-3 px-4 lg:px-6">
        {isLoading || !data ? (
          Array.from({ length: 3 }, (_, i) => <Card key={i} className="shadow-xs"><CardContent className="p-3"><Skeleton className="h-10 w-full" /></CardContent></Card>)
        ) : (
          <>
            <SimpleKpiCard label="新規顧客売上" kpi={data.kpis.newCustomers} formatter={fmtYen} />
            <SimpleKpiCard label="リピーター売上" kpi={data.kpis.repeatCustomers} formatter={fmtYen} />
            <SimpleKpiCard label="F2転換率" kpi={data.kpis.f2ConversionRate} formatter={fmtPct} />
          </>
        )}
      </div>

      <div className="px-4 lg:px-6">
        <ChartContainer title="新規 / リピーター月次売上" description="顧客セグメント別売上推移（万円）" isLoading={isLoading}>
          {data && (
            <StackedBarChart
              data={data.newVsRepeatTrend}
              series={[
                { key: 'newCustomers', label: '新規顧客', color: '#1A1A1A' },
                { key: 'repeatCustomers', label: 'リピーター', color: '#999999' },
              ]}
              xKey="month"
              yFormatter={fmtYenMan}
              showLegend
              height={280}
            />
          )}
        </ChartContainer>
      </div>

      <div className="grid grid-cols-1 gap-3 px-4 lg:grid-cols-2 lg:px-6">
        <ChartContainer title="セグメント×チャネル別客単価" description="新規 vs リピーター（円）" isLoading={isLoading}>
          {data && (
            <BarChart
              data={data.aovBySegment.reduce<Record<string, string | number>[]>((acc, d) => {
                let row = acc.find((r) => r.segment === d.segment)
                if (!row) {
                  row = { segment: d.segment }
                  acc.push(row)
                }
                row[d.channel] = d.aov
                return acc
              }, [])}
              series={[
                { key: 'shopify', label: 'Shopify', color: '#1A1A1A' },
                { key: 'amazon', label: 'Amazon', color: '#404040' },
                { key: 'rakuten', label: '楽天', color: '#666666' },
                { key: 'yahoo', label: 'Yahoo!', color: '#8C8C8C' },
              ]}
              xKey="segment"
              yFormatter={fmtYen}
              showLegend
              height={260}
            />
          )}
        </ChartContainer>

        <ChartContainer title="F2転換率推移" description="初回購入 → 2回目購入の転換率（%）" isLoading={isLoading}>
          {data && (
            <LineChartComponent
              data={data.f2ConversionTrend}
              series={[{ key: 'rate', label: 'F2転換率', color: '#1A1A1A' }]}
              xKey="month"
              yFormatter={fmtPct}
              showDots
              height={260}
            />
          )}
        </ChartContainer>
      </div>
    </div>
  )
}
