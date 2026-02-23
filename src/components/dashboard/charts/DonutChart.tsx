'use client'

import { useMemo } from 'react'
import { EChartWrapper } from '@/components/molecules/echart-wrapper'
import type { EChartsOption } from '@/components/molecules/echart-wrapper'
import { CHART_COLORS } from '@/lib/design-tokens'

export type DonutDataPoint = {
  name: string
  value: number
  color?: string
}

type DonutChartProps = {
  data: DonutDataPoint[]
  centerValue?: string
  centerLabel?: string
  innerRadius?: number
  outerRadius?: number
  height?: number
  formatter?: (value: number) => string
  showLegend?: boolean
  onSegmentClick?: (name: string) => void
}

export function DonutChart({
  data,
  centerValue,
  centerLabel,
  innerRadius = 60,
  outerRadius = 90,
  height = 220,
  showLegend = true,
  onSegmentClick,
}: DonutChartProps) {
  const coloredData = data.map((d, i) => ({
    ...d,
    color: d.color ?? CHART_COLORS[i % CHART_COLORS.length],
  }))
  const total = data.reduce((sum, d) => sum + d.value, 0)

  const option = useMemo<EChartsOption>(() => ({
    tooltip: { trigger: 'item' },
    legend: showLegend ? { bottom: 0, icon: 'circle', itemWidth: 8, itemHeight: 8, textStyle: { fontSize: 12 } } : undefined,
    series: [{
      type: 'pie',
      radius: [`${innerRadius}px`, `${outerRadius}px`],
      center: ['50%', '45%'],
      startAngle: 90,
      padAngle: 2,
      itemStyle: { borderWidth: 0 },
      label: { show: false },
      data: coloredData.map((d) => ({
        name: d.name,
        value: d.value,
        itemStyle: { color: d.color },
      })),
    }],
    graphic: (centerValue || centerLabel) ? [{
      type: 'group',
      left: 'center',
      top: '38%',
      children: [
        ...(centerValue ? [{
          type: 'text' as const,
          style: { text: centerValue, fontSize: 24, fontWeight: 'bold' as const, fill: '#111827', textAlign: 'center' as const },
          left: 'center',
        }] : []),
        ...(centerLabel ? [{
          type: 'text' as const,
          style: { text: centerLabel, fontSize: 12, fill: '#9CA3AF', textAlign: 'center' as const },
          left: 'center',
          top: centerValue ? 30 : 0,
        }] : []),
      ],
    }] : undefined,
  }), [coloredData, centerValue, centerLabel, innerRadius, outerRadius, showLegend])

  const events = useMemo(() => onSegmentClick ? {
    click: (params: unknown) => {
      const p = params as { name?: string }
      if (p.name) {
        onSegmentClick(p.name)
      }
    },
  } : undefined, [onSegmentClick])

  return (
    <div className="flex flex-col gap-4">
      <EChartWrapper option={option} height={height} onEvents={events} />
      {showLegend && (
        <div className="space-y-2">
          {coloredData.map((d) => {
            const pct = total > 0 ? Math.round((d.value / total) * 100) : 0
            return (
              <div key={d.name} className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: d.color }} />
                  <span className="text-xs text-gray-600 truncate">{d.name}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs font-semibold text-gray-800">{d.value.toLocaleString()}</span>
                  <span className="text-xs text-gray-400 w-8 text-right">{pct}%</span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
