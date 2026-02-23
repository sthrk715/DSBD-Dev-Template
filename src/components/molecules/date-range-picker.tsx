'use client'

import * as React from 'react'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'
import { CalendarIcon } from 'lucide-react'
import type { DateRange } from 'react-day-picker'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import type { DateRangePickerProps } from '@/types/components'

type PresetKey =
  | 'today'
  | 'last7d'
  | 'last30d'
  | 'last90d'
  | 'thisMonth'
  | 'lastMonth'
  | 'thisQuarter'
  | 'custom'

const PRESETS: { key: PresetKey; label: string }[] = [
  { key: 'today', label: '今日' },
  { key: 'last7d', label: '直近7日' },
  { key: 'last30d', label: '直近30日' },
  { key: 'last90d', label: '直近90日' },
  { key: 'thisMonth', label: '今月' },
  { key: 'lastMonth', label: '先月' },
  { key: 'thisQuarter', label: '今四半期' },
  { key: 'custom', label: 'カスタム' },
]

function getPresetRange(key: PresetKey): { from: Date; to: Date } | null {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  switch (key) {
    case 'today':
      return { from: today, to: today }
    case 'last7d':
      return { from: new Date(today.getTime() - 7 * 86400000), to: today }
    case 'last30d':
      return { from: new Date(today.getTime() - 30 * 86400000), to: today }
    case 'last90d':
      return { from: new Date(today.getTime() - 90 * 86400000), to: today }
    case 'thisMonth':
      return { from: new Date(today.getFullYear(), today.getMonth(), 1), to: today }
    case 'lastMonth': {
      const first = new Date(today.getFullYear(), today.getMonth() - 1, 1)
      const last = new Date(today.getFullYear(), today.getMonth(), 0)
      return { from: first, to: last }
    }
    case 'thisQuarter': {
      const q = Math.floor(today.getMonth() / 3) * 3
      return { from: new Date(today.getFullYear(), q, 1), to: today }
    }
    default:
      return null
  }
}

export function DateRangePicker({
  label,
  value,
  onChange,
  showPresets = true,
  minDate,
  maxDate,
  disabled = false,
}: DateRangePickerProps) {
  const [open, setOpen] = React.useState(false)
  const [selectedPreset, setSelectedPreset] = React.useState<PresetKey>('last30d')

  const onPresetSelect = React.useCallback(
    (key: PresetKey) => {
      setSelectedPreset(key)
      const range = getPresetRange(key)
      if (range) {
        onChange(range)
        setOpen(false)
      }
    },
    [onChange]
  )

  const onCalendarSelect = React.useCallback(
    (range: DateRange | undefined) => {
      if (range?.from && range?.to) {
        setSelectedPreset('custom')
        onChange({ from: range.from, to: range.to })
      }
    },
    [onChange]
  )

  const displayText = React.useMemo(() => {
    if (!value.from || !value.to) {
      return '期間を選択'
    }
    return `${format(value.from, 'yyyy/MM/dd', { locale: ja })} - ${format(value.to, 'yyyy/MM/dd', { locale: ja })}`
  }, [value])

  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-muted-foreground">
        {label}
      </label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            disabled={disabled}
            className={cn(
              'w-full justify-start text-left font-normal',
              !value.from && 'text-muted-foreground'
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {displayText}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="flex">
            {showPresets && (
              <div className="border-r p-3">
                <div className="space-y-1">
                  {PRESETS.map((preset) => (
                    <Button
                      key={preset.key}
                      variant={
                        selectedPreset === preset.key ? 'default' : 'ghost'
                      }
                      size="sm"
                      className="w-full justify-start text-xs"
                      onClick={() => onPresetSelect(preset.key)}
                    >
                      {preset.label}
                    </Button>
                  ))}
                </div>
              </div>
            )}
            <div className="p-3">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={value.from}
                selected={{ from: value.from, to: value.to }}
                onSelect={onCalendarSelect}
                numberOfMonths={2}
                disabled={(date) => {
                  if (minDate && date < minDate) {
                    return true
                  }
                  if (maxDate && date > maxDate) {
                    return true
                  }
                  return false
                }}
              />
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
