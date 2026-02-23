'use client'

import * as React from 'react'
import { CheckIcon, ChevronsUpDownIcon, Loader2Icon } from 'lucide-react'

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
import { useDebouncedCallback } from '@/hooks/use-debounced-callback'
import type { SearchableSelectProps, SelectOption } from '@/types/components'

export function SearchableSelect({
  label,
  value,
  onChange,
  onSearch,
  placeholder = '選択してください',
  debounceMs = 300,
  minQueryLength = 1,
  disabled = false,
  emptyMessage = '該当する項目がありません',
}: SearchableSelectProps) {
  const [open, setOpen] = React.useState(false)
  const [options, setOptions] = React.useState<SelectOption[]>([])
  const [loading, setLoading] = React.useState(false)

  const debouncedSearch = useDebouncedCallback(
    async (query: string) => {
      if (query.length < minQueryLength) {
        setOptions([])
        setLoading(false)
        return
      }
      setLoading(true)
      try {
        const results = await onSearch(query)
        setOptions(results)
      } finally {
        setLoading(false)
      }
    },
    debounceMs
  )

  const selectedLabel = React.useMemo(() => {
    return options.find((o) => o.value === value)?.label ?? value
  }, [options, value])

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
              !value && 'text-muted-foreground'
            )}
          >
            {value ? selectedLabel : placeholder}
            <ChevronsUpDownIcon className="ml-auto h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0" align="start">
          <Command shouldFilter={false}>
            <CommandInput
              placeholder={`${label}を検索...`}
              onValueChange={(query) => debouncedSearch(query)}
            />
            <CommandList>
              {loading ? (
                <div className="flex items-center justify-center py-6">
                  <Loader2Icon className="h-4 w-4 animate-spin" />
                </div>
              ) : (
                <>
                  <CommandEmpty>{emptyMessage}</CommandEmpty>
                  <CommandGroup>
                    {options.map((option) => (
                      <CommandItem
                        key={option.value}
                        value={option.value}
                        onSelect={() => {
                          onChange(option.value)
                          setOpen(false)
                        }}
                      >
                        <span className="truncate">{option.label}</span>
                        <CheckIcon
                          className={cn(
                            'ml-auto h-4 w-4',
                            value === option.value
                              ? 'opacity-100'
                              : 'opacity-0'
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}
