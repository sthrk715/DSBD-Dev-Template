import type { SelectOption } from '@/types/components'
import { EC_CHANNELS } from '@/lib/design-tokens'

/** チャネルフィルタオプション */
export const CHANNEL_OPTIONS: SelectOption[] = EC_CHANNELS.map((ch) => ({
  value: ch.key,
  label: ch.label,
}))

/** チャネル別カラーマップ */
export const CHANNEL_COLOR_MAP: Record<string, string> = Object.fromEntries(
  EC_CHANNELS.map((ch) => [ch.key, ch.color])
)

// ── 共通フォーマッタ ──────────────────────────────────────────
export const fmtYen = (v: number) => `¥${v.toLocaleString()}`
export const fmtYenK = (v: number) => `¥${(v / 1000).toFixed(0)}k`
export const fmtYenMan = (v: number) => `¥${(v / 10000).toFixed(0)}万`
export const fmtPct = (v: number) => `${v.toFixed(1)}%`
export const fmtCount = (v: number) => v.toLocaleString()
