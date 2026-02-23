'use client'

import {
  Bar,
  CartesianGrid,
  ComposedChart as RechartsComposedChart,
  Line,
  XAxis,
  YAxis,
} from 'recharts'
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'

export type ComposedDataPoint = Record<string, string | number>

export type ComposedSeries = {
  key: string
  label: string
  type: 'bar' | 'line'
  color?: string
  /** line 用: 右Y軸を使用するか */
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
  const config: ChartConfig = Object.fromEntries(
    series.map((s, i) => [
      s.key,
      {
        label: s.label,
        color: s.color ?? `var(--chart-${(i % 5) + 1})`,
      },
    ])
  )

  const hasRightAxis =
    showRightAxis || series.some((s) => s.yAxisId === 'right')

  return (
    <ChartContainer config={config} className="w-full" style={{ height }}>
      <RechartsComposedChart
        data={data}
        margin={{ top: 8, right: hasRightAxis ? 8 : 8, bottom: 0, left: -8 }}
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
          yAxisId="left"
          tick={{ fontSize: 12 }}
          tickLine={false}
          axisLine={false}
          tickFormatter={yFormatter}
        />
        {hasRightAxis && (
          <YAxis
            yAxisId="right"
            orientation="right"
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={false}
            tickFormatter={yRightFormatter ?? yFormatter}
          />
        )}
        <ChartTooltip content={<ChartTooltipContent />} />
        {showLegend && (
          <ChartLegend content={<ChartLegendContent />} />
        )}
        {series.map((s) => {
          const axisId = s.yAxisId ?? 'left'
          if (s.type === 'bar') {
            return (
              <Bar
                key={s.key}
                dataKey={s.key}
                name={s.key}
                yAxisId={axisId}
                fill={`var(--color-${s.key})`}
                radius={[barRadius, barRadius, 0, 0]}
                barSize={32}
              />
            )
          }
          return (
            <Line
              key={s.key}
              type="monotone"
              dataKey={s.key}
              name={s.key}
              yAxisId={axisId}
              stroke={`var(--color-${s.key})`}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0 }}
            />
          )
        })}
      </RechartsComposedChart>
    </ChartContainer>
  )
}
