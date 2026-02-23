'use client'

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from 'recharts'
import { CHART_COLORS } from '@/lib/design-tokens'

type TooltipEntry = {
  value?: number | string | (number | string)[]
  name?: string | number
  payload?: { fill?: string; color?: string }
}
type DonutTooltipProps = { active?: boolean; payload?: TooltipEntry[]; formatter?: (v: number) => string }

export type DonutDataPoint = {
  name: string
  value: number
  color?: string
}

type DonutChartProps = {
  data: DonutDataPoint[]
  /** 中央に表示するメイン値 */
  centerValue?: string
  /** 中央に表示するサブラベル */
  centerLabel?: string
  innerRadius?: number
  outerRadius?: number
  height?: number
  /** ツールチップの値フォーマッター */
  formatter?: (value: number) => string
  showLegend?: boolean
}

// ── カスタムツールチップ ──────────────────────────────────────────
function CustomTooltip({ active, payload, formatter }: DonutTooltipProps) {
  if (!active || !payload?.length) {return null}
  const entry = payload[0]
  if (!entry) {return null}
  const raw = entry.value ?? 0
  const value = typeof raw === 'number' ? raw : 0
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-3 text-sm">
      <div className="flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full" style={{ background: entry.payload?.fill }} />
        <span className="text-gray-500">{entry.name}:</span>
        <span className="font-semibold text-gray-800">
          {formatter ? formatter(value) : value.toLocaleString()}
        </span>
      </div>
    </div>
  )
}

// ── 凡例アイテム ──────────────────────────────────────────────────
function LegendItem({ name, value, color, total }: DonutDataPoint & { total: number }) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-2 min-w-0">
        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: color }} />
        <span className="text-xs text-gray-600 truncate">{name}</span>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <span className="text-xs font-semibold text-gray-800">{value.toLocaleString()}</span>
        <span className="text-xs text-gray-400 w-8 text-right">{pct}%</span>
      </div>
    </div>
  )
}

// ── メインコンポーネント ──────────────────────────────────────────
export function DonutChart({
  data,
  centerValue,
  centerLabel,
  innerRadius = 60,
  outerRadius = 90,
  height = 220,
  formatter,
  showLegend = true,
}: DonutChartProps) {
  const coloredData = data.map((d, i) => ({
    ...d,
    color: d.color ?? CHART_COLORS[i % CHART_COLORS.length],
  }))
  const total = data.reduce((sum, d) => sum + d.value, 0)

  return (
    <div className="flex flex-col gap-4">
      <div className="relative" style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={coloredData}
              cx="50%"
              cy="50%"
              innerRadius={innerRadius}
              outerRadius={outerRadius}
              startAngle={90}
              endAngle={-270}
              paddingAngle={2}
              dataKey="value"
              strokeWidth={0}
            >
              {coloredData.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              content={(props) => (
                <CustomTooltip
                  active={props.active}
                  payload={props.payload as TooltipEntry[]}
                  formatter={formatter}
                />
              )}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* 中央テキスト */}
        {(centerValue ?? centerLabel) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            {centerValue && (
              <p className="text-2xl font-bold text-gray-900 leading-none">{centerValue}</p>
            )}
            {centerLabel && (
              <p className="text-xs text-gray-400 mt-1">{centerLabel}</p>
            )}
          </div>
        )}
      </div>

      {/* 凡例 */}
      {showLegend && (
        <div className="space-y-2">
          {coloredData.map((d) => (
            <LegendItem key={d.name} {...d} total={total} />
          ))}
        </div>
      )}
    </div>
  )
}
