'use client'

import { useMemo } from 'react'
import { EChartWrapper } from '@/components/molecules/echart-wrapper'
import type { EChartsOption } from '@/components/molecules/echart-wrapper'
import { CHART_COLORS } from '@/lib/design-tokens'

export type BarDataPoint = Record<string, string | number>

export type BarSeries = {
  key: string
  label: string
  color?: string
}

type BarChartProps = {
  data: BarDataPoint[]
  series: BarSeries[]
  xKey: string
  height?: number
  layout?: 'vertical' | 'horizontal'
  colorByBar?: boolean
  yFormatter?: (value: number) => string
  tooltipFormatter?: (value: number, name: string) => [string, string]
  showGrid?: boolean
  showLegend?: boolean
  borderRadius?: number
}

export function BarChart({
  data,
  series,
  xKey,
  height = 260,
  yFormatter,
  showGrid = true,
  showLegend = false,
  borderRadius = 6,
  colorByBar = false,
}: BarChartProps) {
  const option = useMemo<EChartsOption>(() => ({
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    legend: showLegend ? { bottom: 0, icon: 'rect', itemWidth: 10, itemHeight: 10, textStyle: { fontSize: 12 } } : undefined,
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
      data: colorByBar && series.length === 1
        ? data.map((d, di) => ({ value: d[s.key], itemStyle: { color: CHART_COLORS[di % CHART_COLORS.length] } }))
        : data.map((d) => d[s.key]),
      itemStyle: {
        color: s.color ?? CHART_COLORS[i % CHART_COLORS.length],
        borderRadius: [borderRadius, borderRadius, 0, 0],
      },
      barCategoryGap: '30%',
    })),
  }), [data, series, xKey, yFormatter, showGrid, showLegend, borderRadius, colorByBar])

  return <EChartWrapper option={option} height={height} />
}
