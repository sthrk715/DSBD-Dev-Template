import { STATUS_STYLES, type StatusType } from '@/lib/design-tokens'

// ── 表示ラベルのマッピング ────────────────────────────────────────
const STATUS_LABELS: Record<StatusType, string> = {
  active:   'アクティブ',
  inactive: '非アクティブ',
  pending:  '保留中',
  error:    'エラー',
  paid:     '支払済',
  unpaid:   '未払',
  sent:     '送信済',
  draft:    '下書き',
}

type StatusBadgeProps = {
  status: StatusType
  /** カスタムラベルを上書きする場合 */
  label?: string
  /** ドット表示の有無 (デフォルト: true) */
  showDot?: boolean
  /** サイズ変形 */
  size?: 'sm' | 'md'
}

export function StatusBadge({
  status,
  label,
  showDot = true,
  size = 'md',
}: StatusBadgeProps) {
  const styles = STATUS_STYLES[status]
  const displayLabel = label ?? STATUS_LABELS[status]

  const sizeClasses = size === 'sm'
    ? 'px-2 py-0.5 text-xs'
    : 'px-2.5 py-1 text-xs'

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 rounded-full font-medium
        ${sizeClasses} ${styles.bg} ${styles.text}
      `}
    >
      {showDot && (
        <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${styles.dot}`} />
      )}
      {displayLabel}
    </span>
  )
}

// ── 複数ステータスの凡例表示 ──────────────────────────────────────
type StatusLegendProps = {
  items: { status: StatusType; count: number; label?: string }[]
}

export function StatusLegend({ items }: StatusLegendProps) {
  return (
    <div className="flex flex-wrap gap-3">
      {items.map(({ status, count, label }) => {
        const styles = STATUS_STYLES[status]
        const displayLabel = label ?? STATUS_LABELS[status]
        return (
          <div key={status} className="flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${styles.dot}`} />
            <span className="text-xs text-gray-600">
              {displayLabel}
              <span className="ml-1 font-semibold text-gray-800">{count}</span>
            </span>
          </div>
        )
      })}
    </div>
  )
}
