'use client'

import * as React from 'react'
import { RotateCcwIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DateRangePicker } from '@/components/molecules/date-range-picker'
import { FilterSelect } from '@/components/molecules/filter-select'
import { FilterMultiSelect } from '@/components/molecules/filter-multi-select'
import { PeriodSelector } from '@/components/molecules/period-selector'
import { useFilterUrlSync } from '@/hooks/use-filter-url-sync'
import type { SelectOption } from '@/types/components'

export interface FilterBarProps {
  channelOptions?: SelectOption[]
  categoryOptions?: SelectOption[]
  regionOptions?: SelectOption[]
  channelLoading?: boolean
  categoryLoading?: boolean
  disabled?: boolean
}

export function FilterBar({
  channelOptions = [],
  categoryOptions = [],
  regionOptions = [],
  channelLoading = false,
  categoryLoading = false,
  disabled = false,
}: FilterBarProps) {
  const store = useFilterUrlSync()

  const hasActiveFilters = React.useMemo(() => {
    return (
      store.channel !== '' ||
      store.categoryL1 !== '' ||
      store.regions.length > 0 ||
      store.preset !== 'last30d'
    )
  }, [store.channel, store.categoryL1, store.regions, store.preset])

  return (
    <div className="flex flex-col gap-3">
      {/* Desktop: 横並び / Tablet: 2列 / Mobile: 1列 */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:flex lg:flex-wrap lg:items-end">
        <div className="sm:col-span-2 lg:w-auto">
          <DateRangePicker
            label="期間"
            value={store.dateRange}
            onChange={(range) => {
              store.setDateRange(range)
              store.setPreset('custom')
            }}
            disabled={disabled}
          />
        </div>

        <div className="lg:w-40">
          <FilterSelect
            label="チャネル"
            options={channelOptions}
            value={store.channel}
            onChange={store.setChannel}
            placeholder="すべて"
            loading={channelLoading}
            disabled={disabled}
            size="sm"
          />
        </div>

        <div className="lg:w-40">
          <FilterSelect
            label="カテゴリ"
            options={categoryOptions}
            value={store.categoryL1}
            onChange={store.setCategoryL1}
            placeholder="すべて"
            loading={categoryLoading}
            disabled={disabled}
            size="sm"
          />
        </div>

        <div className="lg:w-52">
          <FilterMultiSelect
            label="地域"
            options={regionOptions}
            value={store.regions}
            onChange={store.setRegions}
            placeholder="すべて"
            disabled={disabled}
            size="sm"
          />
        </div>

        <div className="flex items-end gap-2 lg:w-auto">
          <div>
            <label className="text-xs font-medium text-muted-foreground">
              集計単位
            </label>
            <div className="mt-1">
              <PeriodSelector
                value={store.period}
                onChange={store.setPeriod}
                disabled={disabled}
              />
            </div>
          </div>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 gap-1 text-xs text-muted-foreground"
              onClick={store.reset}
            >
              <RotateCcwIcon className="h-3 w-3" />
              リセット
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
