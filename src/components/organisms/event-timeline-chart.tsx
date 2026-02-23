'use client'

import { useMemo } from 'react'
import { EChartWrapper } from '@/components/molecules/echart-wrapper'
import type { EChartsOption } from '@/components/molecules/echart-wrapper'
import type { EventItem } from '@/lib/data-service/types'

type EventTimelineChartProps = {
  data: { date: string; current: number; comparison: number }[]
  movingAverage?: { date: string; value: number }[]
  events?: EventItem[]
  height?: number
  yFormatter?: (value: number) => string
  currentLabel?: string
  comparisonLabel?: string
}

export function EventTimelineChart({
  data,
  movingAverage,
  events = [],
  height = 350,
  yFormatter,
  currentLabel = '当期',
  comparisonLabel = '比較期間',
}: EventTimelineChartProps) {
  const option = useMemo<EChartsOption>(() => {
    const promotionEvents = events.filter((e) => e.type === 'promotion')
    const pointEvents = events.filter((e) => e.startDate === e.endDate)

    return {
      tooltip: { trigger: 'axis' },
      legend: { bottom: 0, icon: 'circle', itemWidth: 8, textStyle: { fontSize: 12 } },
      grid: { top: 30, right: 8, bottom: 60, left: 8, containLabel: true },
      dataZoom: [{
        type: 'slider',
        bottom: 28,
        height: 20,
        borderColor: '#e5e7eb',
        fillerColor: 'rgba(59, 130, 246, 0.1)',
      }],
      xAxis: {
        type: 'category',
        data: data.map((d) => d.date),
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { fontSize: 11, color: '#94A3B8' },
      },
      yAxis: {
        type: 'value',
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { fontSize: 12, color: '#94A3B8', formatter: yFormatter ? (v: number) => yFormatter(v) : undefined },
        splitLine: { lineStyle: { type: 'dashed', color: '#E2E8F0' } },
      },
      series: [
        {
          name: currentLabel,
          type: 'line',
          data: data.map((d) => d.current),
          smooth: true,
          symbol: 'none',
          lineStyle: { width: 2.5, color: '#3b82f6' },
          itemStyle: { color: '#3b82f6' },
          markArea: promotionEvents.length > 0 ? {
            silent: true,
            itemStyle: { color: 'rgba(59, 130, 246, 0.06)' },
            data: promotionEvents.map((e) => [
              { xAxis: e.startDate, name: e.name },
              { xAxis: e.endDate },
            ]),
          } : undefined,
          markLine: pointEvents.length > 0 ? {
            silent: true,
            symbol: 'none',
            lineStyle: { type: 'dashed', color: '#9ca3af' },
            label: { show: true, position: 'insideEndTop', fontSize: 10, color: '#6b7280' },
            data: pointEvents.map((e) => ({ xAxis: e.startDate, name: e.name })),
          } : undefined,
        },
        {
          name: comparisonLabel,
          type: 'line',
          data: data.map((d) => d.comparison),
          smooth: true,
          symbol: 'none',
          lineStyle: { width: 2, color: '#94a3b8', type: 'dashed' },
          itemStyle: { color: '#94a3b8' },
        },
        ...(movingAverage && movingAverage.length > 0 ? [{
          name: '移動平均',
          type: 'line' as const,
          data: movingAverage.map((d) => d.value),
          smooth: true,
          symbol: 'none' as const,
          lineStyle: { width: 1.5, color: '#f59e0b', type: 'dotted' as const },
          itemStyle: { color: '#f59e0b' },
        }] : []),
      ],
    }
  }, [data, movingAverage, events, yFormatter, currentLabel, comparisonLabel])

  return <EChartWrapper option={option} height={height} />
}
