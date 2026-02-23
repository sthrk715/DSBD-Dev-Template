'use client'

import {
  Bar,
  BarChart,
  CartesianGrid,
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

export type StackedBarDataPoint = Record<string, string | number>

export type StackedBarSeries = {
  key: string
  label: string
  color?: string
}

type StackedBarChartProps = {
  data: StackedBarDataPoint[]
  series: StackedBarSeries[]
  xKey: string
  height?: number
  layout?: 'horizontal' | 'vertical'
  yFormatter?: (value: number) => string
  showGrid?: boolean
  showLegend?: boolean
  borderRadius?: number
}

export function StackedBarChart({
  data,
  series,
  xKey,
  height = 280,
  layout = 'horizontal',
  yFormatter,
  showGrid = true,
  showLegend = true,
  borderRadius = 4,
}: StackedBarChartProps) {
  const config: ChartConfig = Object.fromEntries(
    series.map((s, i) => [
      s.key,
      {
        label: s.label,
        color: s.color ?? `var(--chart-${(i % 5) + 1})`,
      },
    ])
  )

  const isVertical = layout === 'vertical'

  return (
    <ChartContainer config={config} className="w-full" style={{ height }}>
      <BarChart
        data={data}
        layout={layout}
        margin={{
          top: 8,
          right: 8,
          bottom: 0,
          left: isVertical ? 80 : -8,
        }}
        barCategoryGap="20%"
      >
        {showGrid && (
          <CartesianGrid
            strokeDasharray="3 3"
            horizontal={!isVertical}
            vertical={isVertical}
          />
        )}
        {isVertical ? (
          <>
            <XAxis
              type="number"
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={yFormatter}
            />
            <YAxis
              type="category"
              dataKey={xKey}
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              width={72}
            />
          </>
        ) : (
          <>
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
          </>
        )}
        <ChartTooltip content={<ChartTooltipContent />} />
        {showLegend && (
          <ChartLegend content={<ChartLegendContent />} />
        )}
        {series.map((s, i) => (
          <Bar
            key={s.key}
            dataKey={s.key}
            name={s.key}
            stackId="stack"
            fill={`var(--color-${s.key})`}
            radius={
              i === series.length - 1
                ? [borderRadius, borderRadius, 0, 0]
                : [0, 0, 0, 0]
            }
          />
        ))}
      </BarChart>
    </ChartContainer>
  )
}
