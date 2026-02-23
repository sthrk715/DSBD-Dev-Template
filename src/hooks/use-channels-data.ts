import { useQuery } from '@tanstack/react-query'
import { apiFetch } from '@/lib/api-client'
import { useDashboardParams } from '@/hooks/use-dashboard-params'
import type { ChannelsData } from '@/lib/data-service/types'

export function useChannelsData() {
  const params = useDashboardParams()
  return useQuery({
    queryKey: ['channels', params],
    queryFn: ({ signal }) => apiFetch<ChannelsData>('/api/dashboard/channels', params, signal),
  })
}
