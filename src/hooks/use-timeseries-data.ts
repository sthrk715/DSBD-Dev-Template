import { useQuery } from '@tanstack/react-query'
import { apiFetch } from '@/lib/api-client'
import { useDashboardParams } from '@/hooks/use-dashboard-params'
import type { TimeseriesData } from '@/lib/data-service/types'

export function useTimeseriesData(comparison = 'yoy', movingAvg = '7d') {
  const params = useDashboardParams()
  const queryParams = { ...params, comparison, movingAvg }

  return useQuery({
    queryKey: ['timeseries', queryParams],
    queryFn: ({ signal }) => apiFetch<TimeseriesData>('/api/dashboard/timeseries', queryParams, signal),
  })
}
