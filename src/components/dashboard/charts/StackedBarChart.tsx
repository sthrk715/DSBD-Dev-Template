'use client'

import { useMemo } from 'react'
import { EChartWrapper } from '@/components/molecules/echart-wrapper'
import type { EChartsOption } from '@/components/molecules/echart-wrapper'
import { CHART_COLORS } from '@/lib/design-tokens'

export type StackedBarDataPoint = Record<string, string | number>

export type StackedBarSeries = {
  key: string
  label: string
  color?: string
}

type StackedBarChartProps = {
  data: StackedBarDataPoint[]
  series: StackedBarSeries[]
  xKey: string
  height?: number
  layout?: 'horizontal' | 'vertical'
  yFormatter?: (value: number) => string
  showGrid?: boolean
  showLegend?: boolean
  borderRadius?: number
}

export function StackedBarChart({
  data,
  series,
  xKey,
  height = 280,
  yFormatter,
  showGrid = true,
  showLegend = true,
  borderRadius = 4,
}: StackedBarChartProps) {
  const option = useMemo<EChartsOption>(() => ({
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    legend: showLegend ? { bottom: 0, icon: 'rect', itemWidth: 10, textStyle: { fontSize: 12 } } : undefined,
    grid: { top: 8, right: 8, bottom: showLegend ? 40 : 8, left: 8, containLabel: true },
    xAxis: {
      type: 'category',
      data: data.map((d) => d[xKey]),
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { fontSize: 12, color: '#94A3B8' },
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { fontSize: 12, color: '#94A3B8', formatter: yFormatter ? (v: number) => yFormatter(v) : undefined },
      splitLine: showGrid ? { lineStyle: { type: 'dashed', color: '#E2E8F0' } } : { show: false },
    },
    series: series.map((s, i) => ({
      name: s.label,
      type: 'bar' as const,
      stack: 'total',
      data: data.map((d) => d[s.key]),
      itemStyle: {
        color: s.color ?? CHART_COLORS[i % CHART_COLORS.length],
        borderRadius: i === series.length - 1 ? [borderRadius, borderRadius, 0, 0] : undefined,
      },
    })),
  }), [data, series, xKey, yFormatter, showGrid, showLegend, borderRadius])

  return <EChartWrapper option={option} height={height} />
}
