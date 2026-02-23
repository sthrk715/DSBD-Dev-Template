'use client'

import { useMemo } from 'react'
import { EChartWrapper } from '@/components/molecules/echart-wrapper'
import type { EChartsOption } from '@/components/molecules/echart-wrapper'

type CohortHeatmapProps = {
  data: { cohortMonth: string; monthsSinceStart: number; retentionRate: number }[]
  height?: number
  onCellClick?: (cohortMonth: string, monthsSinceStart: number) => void
}

export function CohortHeatmap({ data, height = 400, onCellClick }: CohortHeatmapProps) {
  const cohortMonths = useMemo(() => [...new Set(data.map((d) => d.cohortMonth))].sort(), [data])
  const maxMonths = useMemo(() => Math.max(...data.map((d) => d.monthsSinceStart)), [data])
  const monthLabels = useMemo(() => Array.from({ length: maxMonths + 1 }, (_, i) => i === 0 ? '当月' : `${i}ヶ月後`), [maxMonths])

  const option = useMemo<EChartsOption>(() => ({
    tooltip: {
      position: 'top',
      formatter: ((params: unknown) => {
        const p = params as { value?: [number, number, number] }
        if (!p.value) {
          return ''
        }
        const [monthIdx, cohortIdx, rate] = p.value
        return `${cohortMonths[cohortIdx]} → ${monthLabels[monthIdx]}: ${rate}%`
      }) as unknown as string,
    },
    grid: { top: 30, right: 60, bottom: 30, left: 100 },
    xAxis: {
      type: 'category',
      data: monthLabels,
      position: 'top',
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { fontSize: 11, color: '#64748B' },
      splitArea: { show: true },
    },
    yAxis: {
      type: 'category',
      data: cohortMonths,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { fontSize: 11, color: '#64748B' },
      splitArea: { show: true },
    },
    visualMap: {
      min: 0,
      max: 100,
      calculable: true,
      orient: 'vertical',
      right: 0,
      top: 30,
      itemHeight: 200,
      inRange: {
        color: ['#fef2f2', '#fca5a5', '#ef4444', '#991b1b'],
      },
      textStyle: { fontSize: 11 },
    },
    series: [{
      type: 'heatmap',
      data: data.map((d) => [d.monthsSinceStart, cohortMonths.indexOf(d.cohortMonth), d.retentionRate]),
      label: {
        show: true,
        formatter: ((params: unknown) => {
          const p = params as { value?: [number, number, number] }
          return p.value ? `${p.value[2]}%` : ''
        }) as unknown as string,
        fontSize: 11,
        color: '#1f2937',
      },
      emphasis: {
        itemStyle: { shadowBlur: 10, shadowColor: 'rgba(0, 0, 0, 0.2)' },
      },
    }],
  }), [data, cohortMonths, monthLabels])

  const events = useMemo(() => onCellClick ? {
    click: (params: unknown) => {
      const p = params as { value?: [number, number, number] }
      if (p.value) {
        onCellClick(cohortMonths[p.value[1]], p.value[0])
      }
    },
  } : undefined, [onCellClick, cohortMonths])

  return <EChartWrapper option={option} height={height} onEvents={events} />
}
