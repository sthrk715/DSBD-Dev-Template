'use client'

import {
  ToggleGroup,
  ToggleGroupItem,
} from '@/components/ui/toggle-group'

type CompareModeToggleProps = {
  value: 'calendar' | 'same_dow'
  onChange: (mode: 'calendar' | 'same_dow') => void
  disabled?: boolean
}

const MODES = [
  { value: 'calendar', label: '暦日' },
  { value: 'same_dow', label: '同曜日' },
] as const

export function CompareModeToggle({
  value,
  onChange,
  disabled = false,
}: CompareModeToggleProps) {
  return (
    <ToggleGroup
      type="single"
      value={value}
      onValueChange={(v) => {
        if (v) {
          onChange(v as 'calendar' | 'same_dow')
        }
      }}
      disabled={disabled}
      className="border rounded-md"
    >
      {MODES.map((mode) => (
        <ToggleGroupItem
          key={mode.value}
          value={mode.value}
          className="text-xs px-3"
          aria-label={mode.label}
        >
          {mode.label}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  )
}
