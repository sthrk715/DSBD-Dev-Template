'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Loader2Icon } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { FilterSelectProps } from '@/types/components'

const sizeClasses = {
  sm: 'h-8 text-xs',
  md: 'h-10 text-sm',
  lg: 'h-12 text-base',
}

export function FilterSelect({
  label,
  options,
  value,
  onChange,
  placeholder = '選択してください',
  showAllOption = true,
  disabled = false,
  loading = false,
  size = 'md',
  error,
}: FilterSelectProps) {
  const allOptions = showAllOption
    ? [{ value: '__all__', label: 'すべて' }, ...options]
    : options

  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-muted-foreground">
        {label}
      </label>
      <Select
        value={value}
        onValueChange={(v) => onChange(v === '__all__' ? '' : v)}
        disabled={disabled || loading}
      >
        <SelectTrigger
          className={cn(sizeClasses[size], error && 'border-destructive')}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <Loader2Icon className="h-4 w-4 animate-spin" />
              読み込み中...
            </span>
          ) : (
            <SelectValue placeholder={placeholder} />
          )}
        </SelectTrigger>
        <SelectContent>
          {allOptions.map((opt) => (
            <SelectItem
              key={opt.value}
              value={opt.value}
              disabled={opt.disabled}
            >
              <span className="flex w-full items-center justify-between">
                <span>{opt.label}</span>
                {opt.badge && (
                  <span className="ml-2 text-xs text-muted-foreground">
                    ({opt.badge})
                  </span>
                )}
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && (
        <span className="text-xs text-destructive">{error}</span>
      )}
    </div>
  )
}
