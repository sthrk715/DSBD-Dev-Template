'use client'

import {
  CartesianGrid,
  Line,
  LineChart as RechartsLineChart,
  XAxis,
  YAxis,
} from 'recharts'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'

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
  curveType = 'monotone',
  showDots = false,
}: LineChartComponentProps) {
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
      <RechartsLineChart
        data={data}
        margin={{ top: 8, right: 8, bottom: 0, left: -8 }}
      >
        {showGrid && (
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
        )}
        <XAxis
          dataKey={xKey}
          tick={{ fontSize: 12 }}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          tick={{ fontSize: 12 }}
          tickLine={false}
          axisLine={false}
          tickFormatter={yFormatter}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        {series.map((s) => (
          <Line
            key={s.key}
            type={curveType}
            dataKey={s.key}
            name={s.key}
            stroke={`var(--color-${s.key})`}
            strokeWidth={2}
            dot={showDots ? { r: 3, strokeWidth: 0 } : false}
            activeDot={{ r: 4, strokeWidth: 0 }}
          />
        ))}
      </RechartsLineChart>
    </ChartContainer>
  )
}
