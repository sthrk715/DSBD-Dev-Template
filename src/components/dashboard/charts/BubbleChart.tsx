'use client'

import {
  CartesianGrid,
  Scatter,
  ScatterChart,
  XAxis,
  YAxis,
  ZAxis,
} from 'recharts'
import {
  ChartContainer,
  ChartTooltip,
  type ChartConfig,
} from '@/components/ui/chart'

export type BubbleDataPoint = Record<string, string | number>

export type BubbleSeries = {
  key: string
  label: string
  color?: string
  data: BubbleDataPoint[]
}

type BubbleChartProps = {
  series: BubbleSeries[]
  xKey: string
  yKey: string
  zKey: string
  xLabel?: string
  yLabel?: string
  zLabel?: string
  height?: number
  xFormatter?: (value: number) => string
  yFormatter?: (value: number) => string
  zFormatter?: (value: number) => string
  bubbleRange?: [number, number]
  showGrid?: boolean
}

function BubbleTooltipContent({
  active,
  payload,
  xKey,
  yKey,
  zKey,
  xLabel,
  yLabel,
  zLabel,
  xFormatter,
  yFormatter,
  zFormatter,
}: {
  active?: boolean
  payload?: Array<{ payload: BubbleDataPoint }>
  xKey: string
  yKey: string
  zKey: string
  xLabel?: string
  yLabel?: string
  zLabel?: string
  xFormatter?: (v: number) => string
  yFormatter?: (v: number) => string
  zFormatter?: (v: number) => string
}) {
  if (!active || !payload?.length) {
    return null
  }
  const data = payload[0].payload
  const name = (data['name'] as string) ?? ''

  const rows: [string, number, ((v: number) => string) | undefined][] = [
    [xLabel ?? xKey, data[xKey] as number, xFormatter],
    [yLabel ?? yKey, data[yKey] as number, yFormatter],
    [zLabel ?? zKey, data[zKey] as number, zFormatter],
  ]

  return (
    <div className="border-border/50 bg-background rounded-lg border px-2.5 py-1.5 text-xs shadow-xl">
      {name && <p className="mb-1 font-medium">{name}</p>}
      <div className="grid gap-0.5">
        {rows.map(([label, val, fmt]) => (
          <div
            key={label}
            className="flex items-center justify-between gap-4"
          >
            <span className="text-muted-foreground">{label}</span>
            <span className="font-mono font-medium tabular-nums">
              {fmt ? fmt(val) : val.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function BubbleChartComponent({
  series,
  xKey,
  yKey,
  zKey,
  xLabel,
  yLabel,
  zLabel,
  height = 300,
  xFormatter,
  yFormatter,
  zFormatter,
  bubbleRange = [40, 400],
  showGrid = true,
}: BubbleChartProps) {
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
      <ScatterChart
        margin={{ top: 8, right: 8, bottom: 0, left: -8 }}
      >
        {showGrid && <CartesianGrid strokeDasharray="3 3" />}
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
        <ZAxis
          type="number"
          dataKey={zKey}
          range={bubbleRange}
          name={zLabel ?? zKey}
        />
        <ChartTooltip
          content={
            <BubbleTooltipContent
              xKey={xKey}
              yKey={yKey}
              zKey={zKey}
              xLabel={xLabel}
              yLabel={yLabel}
              zLabel={zLabel}
              xFormatter={xFormatter}
              yFormatter={yFormatter}
              zFormatter={zFormatter}
            />
          }
        />
        {series.map((s) => (
          <Scatter
            key={s.key}
            name={s.key}
            data={s.data}
            fill={`var(--color-${s.key})`}
            fillOpacity={0.6}
            stroke={`var(--color-${s.key})`}
            strokeWidth={1}
          />
        ))}
      </ScatterChart>
    </ChartContainer>
  )
}
