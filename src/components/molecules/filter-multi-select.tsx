'use client'

import * as React from 'react'
import { CheckIcon, ChevronsUpDownIcon, XIcon } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import type { FilterMultiSelectProps } from '@/types/components'

const sizeClasses = {
  sm: 'h-8 text-xs',
  md: 'h-10 text-sm',
  lg: 'h-12 text-base',
}

export function FilterMultiSelect({
  label,
  options,
  value,
  onChange,
  placeholder = '選択してください',
  maxSelections,
  disabled = false,
  size = 'md',
}: FilterMultiSelectProps) {
  const [open, setOpen] = React.useState(false)

  const selectedSet = React.useMemo(() => new Set(value), [value])

  const onToggle = React.useCallback(
    (optionValue: string) => {
      if (selectedSet.has(optionValue)) {
        onChange(value.filter((v) => v !== optionValue))
      } else {
        if (maxSelections && value.length >= maxSelections) {
          return
        }
        onChange([...value, optionValue])
      }
    },
    [selectedSet, value, onChange, maxSelections]
  )

  const onSelectAll = React.useCallback(() => {
    const allValues = options.map((o) => o.value)
    if (maxSelections) {
      onChange(allValues.slice(0, maxSelections))
    } else {
      onChange(allValues)
    }
  }, [options, onChange, maxSelections])

  const onClearAll = React.useCallback(() => {
    onChange([])
  }, [onChange])

  const selectedLabels = React.useMemo(() => {
    return options.filter((o) => selectedSet.has(o.value))
  }, [options, selectedSet])

  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-muted-foreground">
        {label}
      </label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            disabled={disabled}
            className={cn(
              'w-full justify-between font-normal',
              sizeClasses[size],
              value.length === 0 && 'text-muted-foreground'
            )}
          >
            {value.length === 0 ? (
              placeholder
            ) : (
              <div className="flex items-center gap-1 overflow-hidden">
                {selectedLabels.slice(0, 2).map((opt) => (
                  <Badge
                    key={opt.value}
                    variant="secondary"
                    className="rounded-sm px-1 text-xs font-normal"
                  >
                    {opt.label}
                  </Badge>
                ))}
                {selectedLabels.length > 2 && (
                  <Badge
                    variant="secondary"
                    className="rounded-sm px-1 text-xs font-normal"
                  >
                    +{selectedLabels.length - 2}
                  </Badge>
                )}
              </div>
            )}
            <ChevronsUpDownIcon className="ml-auto h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0" align="start">
          <Command>
            <CommandInput placeholder={`${label}を検索...`} />
            <CommandList>
              <CommandEmpty>結果がありません</CommandEmpty>
              <CommandGroup>
                <div className="flex items-center gap-1 px-2 py-1.5">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 text-xs"
                    onClick={onSelectAll}
                  >
                    すべて選択
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 text-xs"
                    onClick={onClearAll}
                  >
                    <XIcon className="mr-1 h-3 w-3" />
                    すべて解除
                  </Button>
                </div>
                {options.map((option) => {
                  const isSelected = selectedSet.has(option.value)
                  return (
                    <CommandItem
                      key={option.value}
                      onSelect={() => onToggle(option.value)}
                      disabled={option.disabled}
                    >
                      <div
                        className={cn(
                          'border-primary mr-2 flex h-4 w-4 items-center justify-center rounded-sm border',
                          isSelected
                            ? 'bg-primary text-primary-foreground'
                            : 'opacity-50 [&_svg]:invisible'
                        )}
                      >
                        <CheckIcon className="h-3 w-3" />
                      </div>
                      <span className="truncate">{option.label}</span>
                      {option.badge !== undefined && (
                        <span className="ml-auto text-xs text-muted-foreground">
                          ({option.badge})
                        </span>
                      )}
                    </CommandItem>
                  )
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}
