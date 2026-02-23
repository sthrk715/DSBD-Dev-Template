'use client'

import {
  CartesianGrid,
  Scatter,
  ScatterChart as RechartsScatterChart,
  XAxis,
  YAxis,
  ZAxis,
} from 'recharts'
import {
  ChartContainer,
  ChartTooltip,
  type ChartConfig,
} from '@/components/ui/chart'
export type ScatterDataPoint = Record<string, string | number>

export type ScatterSeries = {
  key: string
  label: string
  color?: string
  data: ScatterDataPoint[]
}

type ScatterChartProps = {
  series: ScatterSeries[]
  xKey: string
  yKey: string
  xLabel?: string
  yLabel?: string
  height?: number
  xFormatter?: (value: number) => string
  yFormatter?: (value: number) => string
  showGrid?: boolean
}

function ScatterTooltipContent({
  active,
  payload,
  xKey,
  yKey,
  xLabel,
  yLabel,
  xFormatter,
  yFormatter,
}: {
  active?: boolean
  payload?: Array<{ payload: ScatterDataPoint; name: string; color: string }>
  xKey: string
  yKey: string
  xLabel?: string
  yLabel?: string
  xFormatter?: (v: number) => string
  yFormatter?: (v: number) => string
}) {
  if (!active || !payload?.length) {
    return null
  }
  const point = payload[0]
  const data = point.payload
  const xVal = data[xKey] as number
  const yVal = data[yKey] as number
  const name = (data['name'] as string) ?? ''

  return (
    <div className="border-border/50 bg-background rounded-lg border px-2.5 py-1.5 text-xs shadow-xl">
      {name && <p className="mb-1 font-medium">{name}</p>}
      <div className="grid gap-0.5">
        <div className="flex items-center justify-between gap-4">
          <span className="text-muted-foreground">
            {xLabel ?? xKey}
          </span>
          <span className="font-mono font-medium tabular-nums">
            {xFormatter ? xFormatter(xVal) : xVal.toLocaleString()}
          </span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="text-muted-foreground">
            {yLabel ?? yKey}
          </span>
          <span className="font-mono font-medium tabular-nums">
            {yFormatter ? yFormatter(yVal) : yVal.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  )
}

export function ScatterChartComponent({
  series,
  xKey,
  yKey,
  xLabel,
  yLabel,
  height = 300,
  xFormatter,
  yFormatter,
  showGrid = true,
}: ScatterChartProps) {
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
      <RechartsScatterChart
        margin={{ top: 8, right: 8, bottom: 0, left: -8 }}
      >
        {showGrid && (
          <CartesianGrid strokeDasharray="3 3" />
        )}
        <XAxis
          type="number"
          dataKey={xKey}
          name={xLabel ?? xKey}
          tick={{ fontSize: 12 }}
          tickLine={false}
          axisLine={false}
          tickFormatter={xFormatter}
        />
        <YAxis
          type="number"
          dataKey={yKey}
          name={yLabel ?? yKey}
          tick={{ fontSize: 12 }}
          tickLine={false}
          axisLine={false}
          tickFormatter={yFormatter}
        />
        <ZAxis range={[40, 40]} />
        <ChartTooltip
          content={
            <ScatterTooltipContent
              xKey={xKey}
              yKey={yKey}
              xLabel={xLabel}
              yLabel={yLabel}
              xFormatter={xFormatter}
              yFormatter={yFormatter}
            />
          }
        />
        {series.map((s) => (
          <Scatter
            key={s.key}
            name={s.key}
            data={s.data}
            fill={`var(--color-${s.key})`}
          />
        ))}
      </RechartsScatterChart>
    </ChartContainer>
  )
}
