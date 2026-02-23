'use client'

import { useMemo } from 'react'
import { EChartWrapper } from '@/components/molecules/echart-wrapper'
import type { EChartsOption } from '@/components/molecules/echart-wrapper'
import { CHART_COLORS } from '@/lib/design-tokens'

export type ChartDataPoint = Record<string, string | number>

export type ChartSeries = {
  key: string
  label: string
  color?: string
  type?: 'area' | 'line'
}

type AreaLineChartProps = {
  data: ChartDataPoint[]
  series: ChartSeries[]
  xKey: string
  height?: number
  yFormatter?: (value: number) => string
  tooltipFormatter?: (value: number, name: string) => [string, string]
  showGrid?: boolean
  showLegend?: boolean
  stacked?: boolean
}

export function AreaLineChart({
  data,
  series,
  xKey,
  height = 280,
  yFormatter,
  showGrid = true,
  showLegend = true,
  stacked = false,
}: AreaLineChartProps) {
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
      splitLine: { show: false },
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { fontSize: 12, color: '#94A3B8', formatter: yFormatter ? (v: number) => yFormatter(v) : undefined },
      splitLine: showGrid ? { lineStyle: { type: 'dashed', color: '#E2E8F0' } } : { show: false },
    },
    series: series.map((s, i) => {
      const color = s.color ?? CHART_COLORS[i % CHART_COLORS.length]
      return {
        name: s.label,
        type: 'line' as const,
        data: data.map((d) => d[s.key]),
        smooth: true,
        symbol: 'none',
        lineStyle: { width: 2.5, color },
        areaStyle: s.type === 'line' ? undefined : {
          color: {
            type: 'linear' as const,
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: `${color}59` },
              { offset: 1, color: `${color}0D` },
            ],
          },
        },
        stack: stacked ? 'total' : undefined,
      }
    }),
  }), [data, series, xKey, yFormatter, showGrid, showLegend, stacked])

  return <EChartWrapper option={option} height={height} />
}
