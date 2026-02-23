'use client'

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts'
import { CHART_COLORS } from '@/lib/design-tokens'

// Recharts が content に渡す型 (ValueType 非依存)
type TooltipEntry = { value?: number | string | (number | string)[]; name?: string | number; color?: string }
type CustomTooltipProps = {
  active?: boolean
  payload?: TooltipEntry[]
  label?: string | number
  formatter?: (value: number, name: string) => [string, string]
}

export type ChartDataPoint = Record<string, string | number>

export type ChartSeries = {
  key: string
  label: string
  color?: string
  type?: 'area' | 'line'
}

type AreaLineChartProps = {
  data: ChartDataPoint[]
  series: ChartSeries[]
  xKey: string
  height?: number
  /** Y軸の値フォーマッター */
  yFormatter?: (value: number) => string
  /** ツールチップの値フォーマッター */
  tooltipFormatter?: (value: number, name: string) => [string, string]
  showGrid?: boolean
  showLegend?: boolean
  /** 積み上げ表示 */
  stacked?: boolean
}

// ── カスタムツールチップ ──────────────────────────────────────────
function CustomTooltip({ active, payload, label, formatter }: CustomTooltipProps) {
  if (!active || !payload?.length) {return null}
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-3 text-sm">
      <p className="font-medium text-gray-700 mb-2">{label}</p>
      {payload.map((entry) => {
        const formattedValue = formatter
          ? formatter(entry.value as number, entry.name as string)[0]
          : (entry.value as number).toLocaleString()
        return (
          <div key={entry.name} className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full" style={{ background: entry.color }} />
            <span className="text-gray-500">{entry.name}:</span>
            <span className="font-semibold text-gray-800">{formattedValue}</span>
          </div>
        )
      })}
    </div>
  )
}

// ── メインコンポーネント ──────────────────────────────────────────
export function AreaLineChart({
  data,
  series,
  xKey,
  height = 280,
  yFormatter,
  tooltipFormatter,
  showGrid = true,
  showLegend = true,
  stacked = false,
}: AreaLineChartProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -8 }}>
        <defs>
          {series.map((s, i) => {
            const color = s.color ?? CHART_COLORS[i % CHART_COLORS.length]
            return (
              <linearGradient key={s.key} id={`grad-${s.key}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={0.35} />
                <stop offset="100%" stopColor={color} stopOpacity={0.05} />
              </linearGradient>
            )
          })}
        </defs>

        {showGrid && (
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#E2E8F0"
            vertical={false}
          />
        )}

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

        <Tooltip
          content={(props) => (
            <CustomTooltip
              active={props.active}
              payload={props.payload as TooltipEntry[]}
              label={props.label}
              formatter={tooltipFormatter}
            />
          )}
        />

        {showLegend && (
          <Legend
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: 12, paddingTop: 16 }}
          />
        )}

        {series.map((s, i) => {
          const color = s.color ?? CHART_COLORS[i % CHART_COLORS.length]
          return (
            <Area
              key={s.key}
              type="monotone"
              dataKey={s.key}
              name={s.label}
              stroke={color}
              strokeWidth={2.5}
              fill={`url(#grad-${s.key})`}
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0 }}
              {...(stacked ? { stackId: 'stack' } : {})}
            />
          )
        })}
      </AreaChart>
    </ResponsiveContainer>
  )
}
