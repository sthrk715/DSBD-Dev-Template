'use client'

import { TrendUpIcon, TrendDownIcon } from '@/components/icons'

// ── 円形プログレス ────────────────────────────────────────────
function CircularProgress({
  pct,
  size = 44,
  color = '#1A1A1A',
}: {
  pct: number
  size?: number
  color?: string
}) {
  const r = (size - 4) / 2
  const circ = 2 * Math.PI * r
  const offset = circ * (1 - Math.min(Math.max(pct, 0), 1))

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="shrink-0 -rotate-90">
      {/* 背景トラック */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="#E5E7EB"
        strokeWidth={3}
      />
      {/* プログレス */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={3}
        strokeDasharray={circ}
        strokeDashoffset={offset}
        strokeLinecap="round"
      />
    </svg>
  )
}

// ── トレンドバッジ ─────────────────────────────────────────────
function TrendBadge({ rate }: { rate: number }) {
  const isUp = rate >= 0
  const Icon = isUp ? TrendUpIcon : TrendDownIcon
  const cls = isUp
    ? 'text-neutral-800 bg-neutral-100'
    : 'text-neutral-500 bg-neutral-50'

  return (
    <span className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-xs font-semibold ${cls}`}>
      <Icon size={10} />
      {Math.abs(rate).toFixed(0)}%
    </span>
  )
}

// ── スケルトン ────────────────────────────────────────────────
function KpiCardSkeleton() {
  return (
    <div className="card p-4 space-y-3">
      <div className="skeleton w-24 h-4 rounded" />
      <div className="skeleton w-32 h-5 rounded" />
      <div className="flex items-center justify-between">
        <div className="skeleton w-28 h-4 rounded" />
        <div className="skeleton w-8 h-8 rounded-full" />
      </div>
      <div className="flex items-center justify-between">
        <div className="skeleton w-24 h-4 rounded" />
        <div className="skeleton w-8 h-8 rounded-full" />
      </div>
    </div>
  )
}

// ── Props ─────────────────────────────────────────────────────
export type KpiCardProps = {
  /** カードタイトル (例: "Revenue") */
  title: string
  /** 目標値 */
  target: number | string
  /** 実績値 */
  active: number | string
  /** アクティブ達成率 (0〜1) */
  activePct: number
  /** アクティブトレンド % */
  activeTrend?: number
  /** ベースライン値 */
  baseline: number | string
  /** ベースライン達成率 (0〜1) */
  baselinePct: number
  /** 値フォーマッター */
  formatter?: (v: number) => string
  /** ローディング */
  loading?: boolean
  /** アクセントカラー */
  color?: string
}

// ── メインコンポーネント ──────────────────────────────────────
export function KpiCard({
  title,
  target,
  active,
  activePct,
  activeTrend,
  baseline,
  baselinePct,
  formatter,
  loading = false,
  color = '#1A1A1A',
}: KpiCardProps) {
  if (loading) {return <KpiCardSkeleton />}

  const fmt = (v: number | string) =>
    typeof v === 'number' && formatter ? formatter(v) : String(v)

  return (
    <div className="card p-4 space-y-2.5 card-hover animate-slide-up">
      {/* タイトル */}
      <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">{title}</p>

      {/* Target */}
      <div>
        <p className="text-xs text-gray-400 mb-0.5">Target</p>
        <p className="text-lg font-bold text-gray-900 leading-tight">{fmt(target)}</p>
      </div>

      {/* Active */}
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0">
          <p className="text-xs text-gray-400 mb-0.5">Active</p>
          <div className="flex items-center gap-1.5 flex-wrap">
            <p className="text-base font-semibold text-gray-800 truncate">{fmt(active)}</p>
            {activeTrend !== undefined && <TrendBadge rate={activeTrend} />}
          </div>
        </div>
        <CircularProgress pct={activePct} color={color} size={44} />
      </div>

      {/* Baseline */}
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0">
          <p className="text-xs text-gray-400 mb-0.5">Baseline</p>
          <p className="text-base font-semibold text-gray-800 truncate">{fmt(baseline)}</p>
        </div>
        <CircularProgress pct={baselinePct} color="#8C8C8C" size={44} />
      </div>
    </div>
  )
}
