'use client'

import {
  ResponsiveContainer,
  LineChart,
  Line,
  Tooltip,
} from 'recharts'

type SparklinePoint = {
  value: number
  label?: string
}

type SparklineProps = {
  data: SparklinePoint[]
  color?: string
  height?: number
  /** ツールチップの値フォーマッター */
  formatter?: (value: number) => string
}

// Recharts が content に渡す実際の型 (ValueType 非依存)
type TooltipEntry = { value?: number | string | (number | string)[] }
type SparkTooltipProps = { active?: boolean; payload?: TooltipEntry[]; formatter?: (v: number) => string }

// ── シンプルなツールチップ ──────────────────────────────────────
function SparkTooltip({ active, payload, formatter }: SparkTooltipProps) {
  if (!active || !payload?.length) {return null}
  const raw = payload[0]?.value ?? 0
  const value = typeof raw === 'number' ? raw : 0
  return (
    <div className="bg-gray-900 text-white text-xs px-2 py-1 rounded-md shadow-lg">
      {formatter ? formatter(value) : value.toLocaleString()}
    </div>
  )
}

// ── メインコンポーネント ──────────────────────────────────────────
export function Sparkline({
  data,
  color = '#1A1A1A',
  height = 48,
  formatter,
}: SparklineProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 4, right: 4, bottom: 4, left: 4 }}>
        <Line
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 3, fill: color, strokeWidth: 0 }}
        />
        <Tooltip
          content={(props) => (
            <SparkTooltip
              active={props.active}
              payload={props.payload as TooltipEntry[]}
              formatter={formatter}
            />
          )}
          cursor={false}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
