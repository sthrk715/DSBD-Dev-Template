/**
 * @deprecated このコンポーネントは非推奨です。
 * 代わりに src/components/organisms/filter-bar.tsx を使用してください。
 * Zustand Store + URL同期対応の新FilterBarに移行済み。
 */
'use client'

import { useState } from 'react'
import { CalendarIcon, FilterIcon, CloseIcon } from '@/components/icons'

// ── 型定義 ────────────────────────────────────────────────────────
export type DateRangeOption = {
  label: string
  value: string
}

export type SelectOption = {
  label: string
  value: string
}

export type FilterBarProps = {
  /** 日付範囲オプション */
  dateRangeOptions?: DateRangeOption[]
  selectedDateRange?: string
  onDateRangeChange?: (value: string) => void
  /** ドロップダウンフィルター */
  filters?: {
    key: string
    label: string
    options: SelectOption[]
    value: string
    onChange: (value: string) => void
  }[]
  /** タブ切替 */
  tabs?: { label: string; value: string }[]
  activeTab?: string
  onTabChange?: (value: string) => void
  /** クリアボタン表示 */
  onClear?: () => void
}

const DEFAULT_DATE_RANGES: DateRangeOption[] = [
  { label: '今日',  value: 'today'   },
  { label: '7日間', value: '7d'      },
  { label: '30日',  value: '30d'     },
  { label: '3ヶ月', value: '90d'     },
  { label: '1年',   value: '1y'      },
  { label: 'カスタム', value: 'custom' },
]

// ── 日付範囲セレクター ────────────────────────────────────────────
function DateRangeSelector({
  options,
  selected,
  onChange,
}: {
  options: DateRangeOption[]
  selected: string
  onChange: (v: string) => void
}) {
  return (
    <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`
            px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-150
            ${selected === opt.value
              ? 'bg-white text-primary-600 shadow-sm'
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }
          `}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}

// ── ドロップダウンフィルター ──────────────────────────────────────
function DropdownFilter({
  label,
  options,
  value,
  onChange,
}: {
  label: string
  options: SelectOption[]
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="select-field min-w-28"
        aria-label={label}
      >
        <option value="">{label}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  )
}

// ── タブ切替 ──────────────────────────────────────────────────────
function TabSwitcher({
  tabs,
  activeTab,
  onChange,
}: {
  tabs: { label: string; value: string }[]
  activeTab: string
  onChange: (v: string) => void
}) {
  return (
    <div className="flex items-center border-b border-gray-200">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onChange(tab.value)}
          className={`
            px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors duration-150
            ${activeTab === tab.value
              ? 'border-primary-500 text-primary-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }
          `}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}

// ── メインコンポーネント ──────────────────────────────────────────
export function FilterBar({
  dateRangeOptions = DEFAULT_DATE_RANGES,
  selectedDateRange = '30d',
  onDateRangeChange,
  filters = [],
  tabs,
  activeTab = '',
  onTabChange,
  onClear,
}: FilterBarProps) {
  const [localDate, setLocalDate] = useState(selectedDateRange)

  const handleDateChange = (v: string) => {
    setLocalDate(v)
    onDateRangeChange?.(v)
  }

  const hasActiveFilters = filters.some((f) => f.value !== '')

  return (
    <div className="flex flex-col gap-3">
      {tabs && onTabChange && (
        <TabSwitcher tabs={tabs} activeTab={activeTab} onChange={onTabChange} />
      )}

      <div className="flex flex-wrap items-center gap-3">
        {/* 日付範囲 */}
        <div className="flex items-center gap-2">
          <CalendarIcon size={16} className="text-gray-400 shrink-0" />
          <DateRangeSelector
            options={dateRangeOptions}
            selected={localDate}
            onChange={handleDateChange}
          />
        </div>

        {/* 区切り線 */}
        {filters.length > 0 && (
          <div className="w-px h-6 bg-gray-200" />
        )}

        {/* ドロップダウンフィルター */}
        {filters.length > 0 && (
          <div className="flex items-center gap-2">
            <FilterIcon size={14} className="text-gray-400 shrink-0" />
            {filters.map((f) => (
              <DropdownFilter
                key={f.key}
                label={f.label}
                options={f.options}
                value={f.value}
                onChange={f.onChange}
              />
            ))}
          </div>
        )}

        {/* クリアボタン */}
        {hasActiveFilters && onClear && (
          <button
            onClick={onClear}
            className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 transition-colors"
          >
            <CloseIcon size={12} />
            クリア
          </button>
        )}
      </div>
    </div>
  )
}
