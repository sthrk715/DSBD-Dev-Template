'use client'

import {
  ToggleGroup,
  ToggleGroupItem,
} from '@/components/ui/toggle-group'
import type { PeriodSelectorProps } from '@/types/components'

const PERIODS = [
  { value: 'daily', label: '日次' },
  { value: 'weekly', label: '週次' },
  { value: 'monthly', label: '月次' },
] as const

export function PeriodSelector({
  value,
  onChange,
  disabled = false,
}: PeriodSelectorProps) {
  return (
    <ToggleGroup
      type="single"
      value={value}
      onValueChange={(v) => {
        if (v) {
          onChange(v as 'daily' | 'weekly' | 'monthly')
        }
      }}
      disabled={disabled}
      className="border rounded-md"
    >
      {PERIODS.map((period) => (
        <ToggleGroupItem
          key={period.value}
          value={period.value}
          className="text-xs px-3"
          aria-label={period.label}
        >
          {period.label}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  )
}
