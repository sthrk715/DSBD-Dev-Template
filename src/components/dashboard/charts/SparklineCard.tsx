'use client'

import { useMemo } from 'react'
import { EChartWrapper } from '@/components/molecules/echart-wrapper'
import type { EChartsOption } from '@/components/molecules/echart-wrapper'

type SparklinePoint = {
  value: number
  label?: string
}

type SparklineProps = {
  data: SparklinePoint[]
  color?: string
  height?: number
  formatter?: (value: number) => string
}

export function Sparkline({
  data,
  color = '#1A1A1A',
  height = 48,
}: SparklineProps) {
  const option = useMemo<EChartsOption>(() => ({
    grid: { top: 4, right: 4, bottom: 4, left: 4 },
    xAxis: { type: 'category', show: false, data: data.map((_, i) => i) },
    yAxis: { type: 'value', show: false },
    series: [{
      type: 'line',
      data: data.map((d) => d.value),
      smooth: true,
      symbol: 'none',
      lineStyle: { width: 2, color },
      areaStyle: {
        color: {
          type: 'linear' as const,
          x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [
            { offset: 0, color: `${color}33` },
            { offset: 1, color: `${color}05` },
          ],
        },
      },
    }],
    tooltip: { trigger: 'axis', axisPointer: { type: 'none' } },
  }), [data, color])

  return <EChartWrapper option={option} height={height} />
}
