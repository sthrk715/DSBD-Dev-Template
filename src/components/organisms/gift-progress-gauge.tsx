'use client'

import { useMemo } from 'react'
import { EChartWrapper } from '@/components/molecules/echart-wrapper'
import type { EChartsOption } from '@/components/molecules/echart-wrapper'

type GiftProgressGaugeProps = {
  current: number
  target: number
  label?: string
  height?: number
}

export function GiftProgressGauge({ current, target, label = '達成率', height = 250 }: GiftProgressGaugeProps) {
  const rate = target > 0 ? Math.round((current / target) * 1000) / 10 : 0

  const option = useMemo<EChartsOption>(() => ({
    series: [{
      type: 'gauge',
      startAngle: 200,
      endAngle: -20,
      min: 0,
      max: 100,
      pointer: { show: false },
      progress: {
        show: true,
        overlap: false,
        roundCap: true,
        clip: false,
        itemStyle: {
          color: rate >= 100 ? '#22c55e' : rate >= 70 ? '#3b82f6' : '#f59e0b',
        },
      },
      axisLine: {
        lineStyle: { width: 20, color: [[1, '#e5e7eb']] },
      },
      axisTick: { show: false },
      splitLine: { show: false },
      axisLabel: { show: false },
      detail: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#111827',
        offsetCenter: [0, '-10%'],
        formatter: `${rate}%`,
      },
      title: {
        fontSize: 14,
        color: '#6b7280',
        offsetCenter: [0, '20%'],
      },
      data: [{ value: Math.min(rate, 100), name: label }],
    }],
  }), [rate, label])

  return <EChartWrapper option={option} height={height} />
}
