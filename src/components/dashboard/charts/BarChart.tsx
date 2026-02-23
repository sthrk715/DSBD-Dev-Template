'use client'

import {
  ResponsiveContainer,
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
} from 'recharts'
import { CHART_COLORS } from '@/lib/design-tokens'

type TooltipEntry = { value?: number | string | (number | string)[]; name?: string | number; fill?: string; color?: string }
type BarTooltipProps = {
  active?: boolean
  payload?: TooltipEntry[]
  label?: string | number
  formatter?: (v: number, n: string) => [string, string]
}

export type BarDataPoint = Record<string, string | number>

export type BarSeries = {
  key: string
  label: string
  color?: string
}

type BarChartProps = {
  data: BarDataPoint[]
  series: BarSeries[]
  xKey: string
  height?: number
  layout?: 'vertical' | 'horizontal'
  /** 各バーの色をデータごとに変える (series が1つの場合に有効) */
  colorByBar?: boolean
  yFormatter?: (value: number) => string
  tooltipFormatter?: (value: number, name: string) => [string, string]
  showGrid?: boolean
  showLegend?: boolean
  borderRadius?: number
}

// ── カスタムツールチップ ──────────────────────────────────────────
function CustomTooltip({ active, payload, label, formatter }: BarTooltipProps) {
  if (!active || !payload?.length) {return null}
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-3 text-sm">
      <p className="font-medium text-gray-700 mb-2">{label}</p>
      {payload.map((entry) => {
        const val = entry.value as number
        const [fmtVal] = formatter ? formatter(val, entry.name as string) : [val.toLocaleString(), '']
        return (
          <div key={entry.name} className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-sm" style={{ background: entry.fill ?? entry.color }} />
            <span className="text-gray-500">{entry.name}:</span>
            <span className="font-semibold text-gray-800">{fmtVal}</span>
          </div>
        )
      })}
    </div>
  )
}

// ── メインコンポーネント ──────────────────────────────────────────
export function BarChart({
  data,
  series,
  xKey,
  height = 260,
  layout = 'horizontal',
  colorByBar = false,
  yFormatter,
  tooltipFormatter,
  showGrid = true,
  showLegend = false,
  borderRadius = 6,
}: BarChartProps) {
  const isVertical = layout === 'vertical'

  return (
    <ResponsiveContainer width="100%" height={height}>
      <RechartsBarChart
        data={data}
        layout={layout}
        margin={{ top: 8, right: 8, bottom: 0, left: isVertical ? 80 : -8 }}
        barCategoryGap="30%"
      >
        {showGrid && (
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#E2E8F0"
            horizontal={!isVertical}
            vertical={isVertical}
          />
        )}

        {isVertical ? (
          <>
            <XAxis
              type="number"
              tick={{ fontSize: 12, fill: '#94A3B8' }}
              tickLine={false}
              axisLine={false}
              tickFormatter={yFormatter}
            />
            <YAxis
              type="category"
              dataKey={xKey}
              tick={{ fontSize: 12, fill: '#64748B' }}
              tickLine={false}
              axisLine={false}
              width={72}
            />
          </>
        ) : (
          <>
            <XAxis
              dataKey={xKey}
              tick={{ fontSize: 12, fill: '#94A3B8' }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tick={{ fontSize: 12, fill: '#94A3B8' }}
              tickLine={false}
              axisLine={false}
              tickFormatter={yFormatter}
            />
          </>
        )}

        <Tooltip
          content={(props) => (
            <CustomTooltip
              active={props.active}
              payload={props.payload as TooltipEntry[]}
              label={props.label}
              formatter={tooltipFormatter}
            />
          )}
          cursor={{ fill: 'rgba(99,102,241,0.05)' }}
        />

        {showLegend && (
          <Legend
            iconType="square"
            iconSize={10}
            wrapperStyle={{ fontSize: 12, paddingTop: 16 }}
          />
        )}

        {series.map((s, si) => {
          const baseColor = s.color ?? CHART_COLORS[si % CHART_COLORS.length]
          return (
            <Bar
              key={s.key}
              dataKey={s.key}
              name={s.label}
              fill={baseColor}
              radius={borderRadius}
            >
              {colorByBar && series.length === 1 &&
                data.map((_, di) => (
                  <Cell
                    key={`cell-${di}`}
                    fill={CHART_COLORS[di % CHART_COLORS.length]}
                  />
                ))
              }
            </Bar>
          )
        })}
      </RechartsBarChart>
    </ResponsiveContainer>
  )
}
