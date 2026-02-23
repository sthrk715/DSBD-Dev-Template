'use client'

import { useMemo } from 'react'
import { EChartWrapper } from '@/components/molecules/echart-wrapper'
import type { EChartsOption } from '@/components/molecules/echart-wrapper'
import { CHART_COLORS } from '@/lib/design-tokens'

export type LineDataPoint = Record<string, string | number>

export type LineSeries = {
  key: string
  label: string
  color?: string
}

type LineChartComponentProps = {
  data: LineDataPoint[]
  series: LineSeries[]
  xKey: string
  height?: number
  yFormatter?: (value: number) => string
  showGrid?: boolean
  showLegend?: boolean
  curveType?: 'monotone' | 'linear' | 'step'
  showDots?: boolean
}

export function LineChartComponent({
  data,
  series,
  xKey,
  height = 280,
  yFormatter,
  showGrid = true,
  showLegend = true,
  showDots = false,
}: LineChartComponentProps) {
  const option = useMemo<EChartsOption>(() => ({
    tooltip: { trigger: 'axis' },
    legend: showLegend ? { bottom: 0, icon: 'circle', itemWidth: 8, itemHeight: 8, textStyle: { fontSize: 12 } } : undefined,
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
      type: 'line' as const,
      data: data.map((d) => d[s.key]),
      smooth: true,
      symbol: showDots ? 'circle' : 'none',
      symbolSize: showDots ? 6 : 0,
      lineStyle: { width: 2, color: s.color ?? CHART_COLORS[i % CHART_COLORS.length] },
      itemStyle: { color: s.color ?? CHART_COLORS[i % CHART_COLORS.length] },
    })),
  }), [data, series, xKey, yFormatter, showGrid, showLegend, showDots])

  return <EChartWrapper option={option} height={height} />
}
