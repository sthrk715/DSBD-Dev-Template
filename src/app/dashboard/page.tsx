'use client'

import { useExecutiveData } from '@/hooks/use-executive-data'
import { ChartContainer } from '@/components/dashboard/ChartContainer'
import { AreaLineChart } from '@/components/dashboard/charts/AreaLineChart'
import { DonutChart } from '@/components/dashboard/charts/DonutChart'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { fmtYen, fmtYenMan, fmtPct, fmtCount } from '@/lib/format'
import { EC_CHANNELS } from '@/lib/design-tokens'
import type { ExecutiveData } from '@/lib/data-service/types'

// ── KPIカード ─────────────────────────────────────────────────────

type KpiCardSimpleProps = {
  title: string
  value: string
  changeRate?: number
  changeLabel?: string
  loading?: boolean
}

function KpiCardSimple({ title, value, changeRate, changeLabel, loading }: KpiCardSimpleProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader className="pb-1 pt-3 px-3">
          <Skeleton className="h-3 w-24" />
        </CardHeader>
        <CardContent className="px-3 pb-3 space-y-1">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-3 w-20" />
        </CardContent>
      </Card>
    )
  }

  const isUp = changeRate !== undefined && changeRate > 0
  const isDown = changeRate !== undefined && changeRate < 0
  const rateCls = isUp ? 'text-green-600' : isDown ? 'text-red-600' : 'text-gray-500'
  const arrow = isUp ? '↑' : isDown ? '↓' : '→'

  return (
    <Card>
      <CardHeader className="pb-0.5 pt-3 px-3">
        <CardTitle className="text-xs font-medium text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent className="px-3 pb-3 space-y-0.5">
        <p className="text-lg font-bold text-gray-900">{value}</p>
        {changeRate !== undefined && (
          <p className={`text-sm font-medium ${rateCls}`}>
            {arrow} {changeRate >= 0 ? '+' : ''}{fmtPct(changeRate)}
            {changeLabel && <span className="ml-1 text-xs text-gray-400">{changeLabel}</span>}
          </p>
        )}
      </CardContent>
    </Card>
  )
}

// ── チャネルKPIテーブル ────────────────────────────────────────────

function ChannelKpiTable({ data }: { data: ExecutiveData['channelKpiTable'] }) {
  const channelLabel = (key: string) =>
    EC_CHANNELS.find((c) => c.key === key)?.label ?? key

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-xs text-muted-foreground">
            <th className="pb-2 text-left font-medium">チャネル</th>
            <th className="pb-2 text-right font-medium">売上</th>
            <th className="pb-2 text-right font-medium">注文数</th>
            <th className="pb-2 text-right font-medium">平均単価</th>
            <th className="pb-2 text-right font-medium">前年比</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => {
            const isUp = row.yoyGrowth >= 0
            return (
              <tr key={row.channel} className="border-b last:border-0">
                <td className="py-2 font-medium">{channelLabel(row.channel)}</td>
                <td className="py-2 text-right">{fmtYenMan(row.sales)}</td>
                <td className="py-2 text-right">{fmtCount(row.orders)}</td>
                <td className="py-2 text-right">{fmtYen(row.avgPrice)}</td>
                <td className={`py-2 text-right font-medium ${isUp ? 'text-green-600' : 'text-red-600'}`}>
                  {row.yoyGrowth >= 0 ? '+' : ''}{fmtPct(row.yoyGrowth)}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

// ── メインページ ──────────────────────────────────────────────────

export default function Page() {
  const { data, isLoading, isError, refetch } = useExecutiveData()
  const kpis = data?.kpis

  const salesSeries = [
    { key: 'sales',         label: '今期',  type: 'area' as const },
    { key: 'prevYearSales', label: '前年',  type: 'line' as const },
  ]

  const donutData = (data?.channelBreakdown ?? []).map((c) => ({
    name: EC_CHANNELS.find((e) => e.key === c.channel)?.label ?? c.channel,
    value: c.sales,
    color: EC_CHANNELS.find((e) => e.key === c.channel)?.color,
  }))

  const totalSalesValue = kpis?.totalSales.value ?? 0

  return (
    <div className="space-y-4 px-4 py-3 lg:px-6">
      {/* KPI カード */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <KpiCardSimple
          title="全チャネル売上（税抜）"
          value={isLoading ? '-' : fmtYen(kpis?.totalSales.value ?? 0)}
          changeRate={kpis?.totalSales.changeRate}
          changeLabel="前年比"
          loading={isLoading}
        />
        <KpiCardSimple
          title="目標達成率"
          value={isLoading ? '-' : fmtPct(kpis?.targetAchievement.value ?? 0)}
          changeLabel={kpis?.targetAchievement.target ? `目標 ${fmtYenMan(kpis.targetAchievement.target)}` : undefined}
          loading={isLoading}
        />
        <KpiCardSimple
          title="前年比成長率"
          value={isLoading ? '-' : `${(kpis?.yoyGrowth.value ?? 0) >= 0 ? '+' : ''}${fmtPct(kpis?.yoyGrowth.value ?? 0)}`}
          changeRate={kpis?.yoyGrowth.value}
          loading={isLoading}
        />
        <KpiCardSimple
          title="注文件数"
          value={isLoading ? '-' : fmtCount(kpis?.orderCount.value ?? 0)}
          changeRate={kpis?.orderCount.changeRate}
          changeLabel="前年比"
          loading={isLoading}
        />
      </div>

      {/* 日次売上トレンド */}
      <ChartContainer
        title="日次売上トレンド"
        description="今期 vs 前年同期"
        isLoading={isLoading}
        isError={isError}
        onRetry={refetch}
      >
        <AreaLineChart
          data={data?.dailySalesTrend ?? []}
          series={salesSeries}
          xKey="date"
          height={280}
          yFormatter={fmtYenMan}
        />
      </ChartContainer>

      {/* チャネル分析 */}
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
        <ChartContainer
          title="チャネル構成比"
          isLoading={isLoading}
          isError={isError}
          onRetry={refetch}
        >
          <DonutChart
            data={donutData}
            centerValue={isLoading ? '' : fmtYenMan(totalSalesValue)}
            centerLabel="合計売上"
            height={220}
          />
        </ChartContainer>

        <div className="lg:col-span-2">
          <ChartContainer
            title="チャネル別 KPI"
            isLoading={isLoading}
            isError={isError}
            onRetry={refetch}
          >
            {data && <ChannelKpiTable data={data.channelKpiTable} />}
          </ChartContainer>
        </div>
      </div>
    </div>
  )
}
