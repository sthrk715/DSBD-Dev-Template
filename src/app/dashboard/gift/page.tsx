'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { BarChart } from '@/components/dashboard/charts/BarChart'
import { AreaLineChart } from '@/components/dashboard/charts/AreaLineChart'
import { DonutChart } from '@/components/dashboard/charts/DonutChart'
import { ChartContainer } from '@/components/dashboard/ChartContainer'
import { DashboardErrorState } from '@/components/dashboard/DashboardErrorState'
import { useGiftsData } from '@/hooks/use-gifts-data'
import { fmtYen, fmtYenMan, fmtPct } from '@/lib/format'
import type { KpiValue } from '@/lib/data-service/types'

const SEASON_LABELS: Record<string, string> = {
  mothers_day: '母の日',
  chugen: 'お中元',
  keiro: '敬老の日',
  seibo: 'お歳暮',
  newyear: 'お正月',
}

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

export default function GiftPage() {
  const { data, isLoading, isError, refetch } = useGiftsData()

  if (isError) {
    return <div className="px-4 py-8 lg:px-6"><DashboardErrorState onRetry={() => refetch()} /></div>
  }

  const donutData = data ? [
    { name: 'eギフト', value: data.eGiftBreakdown.eGift, color: '#1A1A1A' },
    { name: '実物ギフト', value: data.eGiftBreakdown.physical, color: '#999999' },
  ] : []
  const giftTotal = data ? data.eGiftBreakdown.eGift + data.eGiftBreakdown.physical : 0

  return (
    <div className="flex flex-col gap-3 py-3 md:gap-4 md:py-4">
      <div className="@xl/main:grid-cols-3 grid grid-cols-1 gap-3 px-4 lg:px-6">
        {isLoading || !data ? (
          Array.from({ length: 3 }, (_, i) => <Card key={i} className="shadow-xs"><CardContent className="p-3"><Skeleton className="h-10 w-full" /></CardContent></Card>)
        ) : (
          <>
            <SimpleKpiCard label="シーズン累計売上" kpi={data.kpis.seasonTotal} formatter={fmtYen} />
            <SimpleKpiCard label="eギフト比率" kpi={data.kpis.eGiftRatio} formatter={fmtPct} />
            <SimpleKpiCard label="残り日数" kpi={data.kpis.remainingDays} formatter={(v) => `${v}日`} />
          </>
        )}
      </div>

      <div className="px-4 lg:px-6">
        <ChartContainer title="シーズン別売上比較" description="当年 vs 前年（万円）" isLoading={isLoading}>
          {data && (
            <BarChart
              data={data.seasonComparison.map((d) => ({
                season: SEASON_LABELS[d.season] ?? d.season,
                当年: d.currentYear,
                前年: d.prevYear,
              }))}
              series={[
                { key: '当年', label: '当年', color: '#1A1A1A' },
                { key: '前年', label: '前年', color: '#CCCCCC' },
              ]}
              xKey="season"
              yFormatter={fmtYenMan}
              showLegend
              height={280}
            />
          )}
        </ChartContainer>
      </div>

      <div className="grid grid-cols-1 gap-3 px-4 lg:grid-cols-2 lg:px-6">
        <ChartContainer title="シーズン内累積売上推移" description="当年 vs 前年" isLoading={isLoading}>
          {data && (
            <AreaLineChart
              data={data.dailyProgress.map((d) => ({ date: d.date, 当年累積: d.cumulative, 前年累積: d.prevYearCumulative }))}
              series={[
                { key: '当年累積', label: '当年累積', color: '#1A1A1A' },
                { key: '前年累積', label: '前年累積', color: '#B3B3B3' },
              ]}
              xKey="date"
              yFormatter={fmtYenMan}
              showLegend
              height={260}
            />
          )}
        </ChartContainer>

        <ChartContainer title="eギフト vs 実物ギフト" description="ギフト種別売上構成比" isLoading={isLoading}>
          {data && (
            <DonutChart
              data={donutData}
              centerValue={fmtYenMan(giftTotal)}
              centerLabel="ギフト合計"
              height={260}
            />
          )}
        </ChartContainer>
      </div>
    </div>
  )
}
