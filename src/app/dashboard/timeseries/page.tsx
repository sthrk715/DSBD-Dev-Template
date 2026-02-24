'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { LineChartComponent } from '@/components/dashboard/charts/LineChart'
import { AreaLineChart } from '@/components/dashboard/charts/AreaLineChart'
import { ComposedChartComponent } from '@/components/dashboard/charts/ComposedChart'
import { ChartContainer } from '@/components/dashboard/ChartContainer'
import { DashboardErrorState } from '@/components/dashboard/DashboardErrorState'
import { useTimeseriesData } from '@/hooks/use-timeseries-data'
import { fmtYen, fmtYenMan } from '@/lib/format'

export default function TimeseriesPage() {
  const { data, isLoading, isError, refetch } = useTimeseriesData()

  if (isError) {
    return <div className="px-4 py-8 lg:px-6"><DashboardErrorState onRetry={() => refetch()} /></div>
  }

  // 移動平均データをシリーズデータにマージ
  const composedData = (data?.series ?? []).map((d) => {
    const ma = data?.movingAverage.find((m) => m.date === d.date)
    return { date: d.date, 日次売上: d.current, 移動平均: ma?.value ?? 0 }
  })

  return (
    <div className="flex flex-col gap-3 py-3 md:gap-4 md:py-4">
      {/* MTD/YTD KPI */}
      <div className="@xl/main:grid-cols-2 grid grid-cols-1 gap-3 px-4 lg:px-6">
        {isLoading || !data ? (
          Array.from({ length: 2 }, (_, i) => <Card key={i} className="shadow-xs"><CardContent className="p-3"><Skeleton className="h-10 w-full" /></CardContent></Card>)
        ) : (
          <>
            <Card className="shadow-xs">
              <CardHeader className="pb-0.5 pt-2 px-3">
                <CardTitle className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">MTD売上</CardTitle>
              </CardHeader>
              <CardContent className="px-3 pb-3">
                <p className="text-lg font-bold tabular-nums">{fmtYen(data.mtdSales)}</p>
              </CardContent>
            </Card>
            <Card className="shadow-xs">
              <CardHeader className="pb-0.5 pt-2 px-3">
                <CardTitle className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">YTD売上</CardTitle>
              </CardHeader>
              <CardContent className="px-3 pb-3">
                <p className="text-lg font-bold tabular-nums">{fmtYen(data.ytdSales)}</p>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* 当年 vs 前年 */}
      <div className="px-4 lg:px-6">
        <ChartContainer title="年次比較（当年 vs 前年）" description="日次売上推移" isLoading={isLoading}>
          {data && (
            <LineChartComponent
              data={data.series.map((d) => ({ date: d.date, 当年: d.current, 前年: d.comparison }))}
              series={[
                { key: '当年', label: '当年', color: '#1A1A1A' },
                { key: '前年', label: '前年', color: '#CCCCCC' },
              ]}
              xKey="date"
              yFormatter={fmtYenMan}
              height={300}
            />
          )}
        </ChartContainer>
      </div>

      <div className="grid grid-cols-1 gap-3 px-4 lg:grid-cols-2 lg:px-6">
        {/* 累積推移 */}
        <ChartContainer title="MTD累積売上" description="月初来累計" isLoading={isLoading}>
          {data && (() => {
            let cumCurrent = 0
            let cumComparison = 0
            const cumData = data.series.map((d) => {
              cumCurrent += d.current
              cumComparison += d.comparison
              return { date: d.date, 実績累計: cumCurrent, 前年累計: cumComparison }
            })
            return (
              <AreaLineChart
                data={cumData}
                series={[
                  { key: '実績累計', label: '実績累計', color: '#1A1A1A' },
                  { key: '前年累計', label: '前年累計', color: '#B3B3B3' },
                ]}
                xKey="date"
                yFormatter={fmtYenMan}
                showLegend
                height={260}
              />
            )
          })()}
        </ChartContainer>

        {/* 移動平均 */}
        <ChartContainer title="売上 + 移動平均" description="日次売上と移動平均線" isLoading={isLoading}>
          {data && (
            <ComposedChartComponent
              data={composedData}
              series={[
                { key: '日次売上', label: '日次売上', type: 'bar', yAxisId: 'left', color: '#E6E6E6' },
                { key: '移動平均', label: '移動平均', type: 'line', yAxisId: 'left', color: '#1A1A1A' },
              ]}
              xKey="date"
              yFormatter={fmtYenMan}
              height={260}
            />
          )}
        </ChartContainer>
      </div>

      {/* イベントカレンダー */}
      <div className="px-4 lg:px-6">
        <ChartContainer title="販促イベントカレンダー" description="期間内のイベント" isLoading={isLoading} noPadding>
          {data && (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border bg-muted/40">
                    <th className="px-3 py-2 text-left font-medium text-muted-foreground">開始日</th>
                    <th className="px-3 py-2 text-left font-medium text-muted-foreground">終了日</th>
                    <th className="px-3 py-2 text-left font-medium text-muted-foreground">イベント</th>
                    <th className="px-3 py-2 text-left font-medium text-muted-foreground">種別</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {data.events.map((ev) => (
                    <tr key={ev.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-3 py-2 tabular-nums font-medium">{ev.startDate}</td>
                      <td className="px-3 py-2 tabular-nums">{ev.endDate}</td>
                      <td className="px-3 py-2 text-foreground">{ev.name}</td>
                      <td className="px-3 py-2 text-muted-foreground">{ev.type}</td>
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
