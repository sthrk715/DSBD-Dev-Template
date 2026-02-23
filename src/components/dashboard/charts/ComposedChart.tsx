'use client'

import { useMemo } from 'react'
import { EChartWrapper } from '@/components/molecules/echart-wrapper'
import type { EChartsOption } from '@/components/molecules/echart-wrapper'
import { CHART_COLORS } from '@/lib/design-tokens'

export type ComposedDataPoint = Record<string, string | number>

export type ComposedSeries = {
  key: string
  label: string
  type: 'bar' | 'line'
  color?: string
  yAxisId?: 'left' | 'right'
}

type ComposedChartProps = {
  data: ComposedDataPoint[]
  series: ComposedSeries[]
  xKey: string
  height?: number
  yFormatter?: (value: number) => string
  yRightFormatter?: (value: number) => string
  showGrid?: boolean
  showLegend?: boolean
  showRightAxis?: boolean
  barRadius?: number
}

export function ComposedChartComponent({
  data,
  series,
  xKey,
  height = 300,
  yFormatter,
  yRightFormatter,
  showGrid = true,
  showLegend = true,
  showRightAxis = false,
  barRadius = 4,
}: ComposedChartProps) {
  const hasRightAxis = showRightAxis || series.some((s) => s.yAxisId === 'right')

  const option = useMemo<EChartsOption>(() => ({
    tooltip: { trigger: 'axis', axisPointer: { type: 'cross' } },
    legend: showLegend ? { bottom: 0, icon: 'circle', itemWidth: 8, textStyle: { fontSize: 12 } } : undefined,
    grid: { top: 8, right: hasRightAxis ? 60 : 8, bottom: showLegend ? 40 : 8, left: 8, containLabel: true },
    xAxis: {
      type: 'category',
      data: data.map((d) => d[xKey]),
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { fontSize: 12, color: '#94A3B8' },
    },
    yAxis: [
      {
        type: 'value',
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { fontSize: 12, color: '#94A3B8', formatter: yFormatter ? (v: number) => yFormatter(v) : undefined },
        splitLine: showGrid ? { lineStyle: { type: 'dashed', color: '#E2E8F0' } } : { show: false },
      },
      ...(hasRightAxis ? [{
        type: 'value' as const,
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { fontSize: 12, color: '#94A3B8', formatter: (yRightFormatter ?? yFormatter) ? (v: number) => (yRightFormatter ?? yFormatter)!(v) : undefined },
        splitLine: { show: false },
      }] : []),
    ],
    series: series.map((s, i) => {
      const color = s.color ?? CHART_COLORS[i % CHART_COLORS.length]
      const yAxisIndex = s.yAxisId === 'right' ? 1 : 0
      if (s.type === 'bar') {
        return {
          name: s.label,
          type: 'bar' as const,
          yAxisIndex,
          data: data.map((d) => d[s.key]),
          itemStyle: { color, borderRadius: [barRadius, barRadius, 0, 0] },
          barMaxWidth: 32,
        }
      }
      return {
        name: s.label,
        type: 'line' as const,
        yAxisIndex,
        data: data.map((d) => d[s.key]),
        smooth: true,
        symbol: 'none',
        lineStyle: { width: 2, color },
        itemStyle: { color },
      }
    }),
  }), [data, series, xKey, yFormatter, yRightFormatter, showGrid, showLegend, hasRightAxis, barRadius])

  return <EChartWrapper option={option} height={height} />
}
