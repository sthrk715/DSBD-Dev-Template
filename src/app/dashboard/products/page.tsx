'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { StackedBarChart } from '@/components/dashboard/charts/StackedBarChart'
import { DonutChart } from '@/components/dashboard/charts/DonutChart'
import { ChartContainer } from '@/components/dashboard/ChartContainer'
import { DashboardErrorState } from '@/components/dashboard/DashboardErrorState'
import { useProductsData } from '@/hooks/use-products-data'
import { fmtYen, fmtYenMan, fmtCount } from '@/lib/format'

export default function ProductsPage() {
  const { data, isLoading, isError, refetch } = useProductsData()

  if (isError) {
    return <div className="px-4 py-8 lg:px-6"><DashboardErrorState onRetry={() => refetch()} /></div>
  }

  const donutData = (data?.categoryBreakdown ?? []).map((d, i) => {
    const colors = ['#1A1A1A', '#404040', '#666666', '#8C8C8C', '#CCCCCC']
    return { name: d.category, value: d.sales, color: colors[i % colors.length] }
  })
  const catTotal = donutData.reduce((s, d) => s + d.value, 0)

  const stackSeries = data
    ? [...new Set(data.categoryMonthlySales.flatMap((m) => Object.keys(m).filter((k) => k !== 'month')))]
    : []
  const stackColors = ['#1A1A1A', '#404040', '#666666', '#8C8C8C', '#CCCCCC']

  return (
    <div className="flex flex-col gap-3 py-3 md:gap-4 md:py-4">
      <div className="@xl/main:grid-cols-2 grid grid-cols-1 gap-3 px-4 lg:px-6">
        {isLoading || !data ? (
          Array.from({ length: 2 }, (_, i) => <Card key={i} className="shadow-xs"><CardContent className="p-3"><Skeleton className="h-10 w-full" /></CardContent></Card>)
        ) : (
          <>
            <Card className="shadow-xs">
              <CardHeader className="pb-0.5 pt-2 px-3">
                <CardTitle className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">トップカテゴリ売上</CardTitle>
              </CardHeader>
              <CardContent className="px-3 pb-3">
                <p className="text-lg font-bold tabular-nums">{fmtYen(data.kpis.topCategory.value)}</p>
              </CardContent>
            </Card>
            <Card className="shadow-xs">
              <CardHeader className="pb-0.5 pt-2 px-3">
                <CardTitle className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">カテゴリ数</CardTitle>
              </CardHeader>
              <CardContent className="px-3 pb-3">
                <p className="text-lg font-bold tabular-nums">{fmtCount(data.kpis.categoryCount.value)}</p>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      <div className="grid grid-cols-1 gap-3 px-4 lg:grid-cols-2 lg:px-6">
        <ChartContainer title="カテゴリ別月次売上構成" description="万円" isLoading={isLoading}>
          {data && (
            <StackedBarChart
              data={data.categoryMonthlySales}
              series={stackSeries.map((key, i) => ({ key, label: key, color: stackColors[i % stackColors.length] }))}
              xKey="month"
              yFormatter={fmtYenMan}
              showLegend
              height={300}
            />
          )}
        </ChartContainer>

        <ChartContainer title="カテゴリ売上構成比" description="全チャネル合計" isLoading={isLoading}>
          {data && (
            <DonutChart
              data={donutData}
              centerValue={fmtYenMan(catTotal)}
              centerLabel="合計"
              height={300}
            />
          )}
        </ChartContainer>
      </div>

      <div className="px-4 lg:px-6">
        <ChartContainer title="注力商品売上ランキング" isLoading={isLoading} noPadding>
          {data && (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border bg-muted/40">
                    <th className="px-3 py-2 text-center font-medium text-muted-foreground w-10">#</th>
                    <th className="px-3 py-2 text-left font-medium text-muted-foreground">商品名</th>
                    <th className="px-3 py-2 text-left font-medium text-muted-foreground">カテゴリ</th>
                    <th className="px-3 py-2 text-right font-medium text-muted-foreground">売上</th>
                    <th className="px-3 py-2 text-right font-medium text-muted-foreground">販売数</th>
                    <th className="px-3 py-2 text-right font-medium text-muted-foreground">平均単価</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {data.productRankingTable.map((row) => (
                    <tr key={row.rank} className="hover:bg-muted/30 transition-colors">
                      <td className="px-3 py-2 text-center tabular-nums font-medium text-muted-foreground">{row.rank}</td>
                      <td className="px-3 py-2 text-foreground">{row.name}</td>
                      <td className="px-3 py-2 text-muted-foreground">{row.category}</td>
                      <td className="px-3 py-2 text-right tabular-nums font-medium">{fmtYen(row.sales)}</td>
                      <td className="px-3 py-2 text-right tabular-nums text-muted-foreground">{row.quantity.toLocaleString()}</td>
                      <td className="px-3 py-2 text-right tabular-nums">{fmtYen(row.avgPrice)}</td>
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
