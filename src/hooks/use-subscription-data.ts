import { useQuery } from '@tanstack/react-query'
import { apiFetch } from '@/lib/api-client'
import { useDashboardParams } from '@/hooks/use-dashboard-params'
import type { SubscriptionData } from '@/lib/data-service/types'

export function useSubscriptionData() {
  const params = useDashboardParams()
  return useQuery({
    queryKey: ['subscription', params],
    queryFn: ({ signal }) => apiFetch<SubscriptionData>('/api/dashboard/subscription', params, signal),
  })
}
