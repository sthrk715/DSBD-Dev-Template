import { useMemo } from 'react'
import { useFilterStore } from '@/stores/filter-store'

/** フィルタストアから共通APIパラメータを生成 */
export function useDashboardParams() {
  const { dateRange, channel, period, compareMode } = useFilterStore()

  return useMemo(() => ({
    startDate: dateRange.from.toISOString().slice(0, 10),
    endDate: dateRange.to.toISOString().slice(0, 10),
    channel,
    period,
    compareMode,
  }), [dateRange, channel, period, compareMode])
}
