'use client'

import { FilterSelect } from '@/components/molecules/filter-select'

const GIFT_SEASONS = [
  { value: '', label: 'すべてのシーズン' },
  { value: 'mother', label: '母の日' },
  { value: 'father', label: '父の日' },
  { value: 'obon', label: 'お盆' },
  { value: 'winter', label: 'お歳暮' },
  { value: 'valentine', label: 'バレンタイン' },
  { value: 'white_day', label: 'ホワイトデー' },
]

type SeasonSelectorProps = {
  value: string
  onChange: (season: string) => void
  disabled?: boolean
}

export function SeasonSelector({ value, onChange, disabled }: SeasonSelectorProps) {
  return (
    <FilterSelect
      label="シーズン"
      options={GIFT_SEASONS}
      value={value}
      onChange={onChange}
      placeholder="すべて"
      disabled={disabled}
      size="sm"
    />
  )
}
