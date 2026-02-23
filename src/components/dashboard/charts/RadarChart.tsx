'use client'

import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart as RechartsRadarChart,
} from 'recharts'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from '@/components/ui/chart'

export type RadarDataPoint = Record<string, string | number>

export type RadarSeries = {
  key: string
  label: string
  color?: string
}

type RadarChartComponentProps = {
  data: RadarDataPoint[]
  series: RadarSeries[]
  axisKey: string
  height?: number
  showLegend?: boolean
  fillOpacity?: number
}

export function RadarChartComponent({
  data,
  series,
  axisKey,
  height = 300,
  showLegend = true,
  fillOpacity = 0.2,
}: RadarChartComponentProps) {
  const config: ChartConfig = Object.fromEntries(
    series.map((s, i) => [
      s.key,
      {
        label: s.label,
        color: s.color ?? `var(--chart-${(i % 5) + 1})`,
      },
    ])
  )

  return (
    <ChartContainer config={config} className="w-full" style={{ height }}>
      <RechartsRadarChart data={data}>
        <PolarGrid />
        <PolarAngleAxis
          dataKey={axisKey}
          tick={{ fontSize: 12 }}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        {showLegend && series.length > 1 && (
          <ChartLegend content={<ChartLegendContent />} />
        )}
        {series.map((s) => (
          <Radar
            key={s.key}
            name={s.key}
            dataKey={s.key}
            stroke={`var(--color-${s.key})`}
            fill={`var(--color-${s.key})`}
            fillOpacity={fillOpacity}
            strokeWidth={2}
          />
        ))}
      </RechartsRadarChart>
    </ChartContainer>
  )
}
