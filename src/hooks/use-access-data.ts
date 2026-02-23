import { useQuery } from '@tanstack/react-query'
import { apiFetch } from '@/lib/api-client'
import { useDashboardParams } from '@/hooks/use-dashboard-params'
import type { AccessData } from '@/lib/data-service/types'

export function useAccessData() {
  const params = useDashboardParams()
  return useQuery({
    queryKey: ['access', params],
    queryFn: ({ signal }) => apiFetch<AccessData>('/api/dashboard/access', params, signal),
  })
}
