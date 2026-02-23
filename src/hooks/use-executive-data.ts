import { useQuery } from '@tanstack/react-query'
import { apiFetch } from '@/lib/api-client'
import { useDashboardParams } from '@/hooks/use-dashboard-params'
import type { ExecutiveData } from '@/lib/data-service/types'

export function useExecutiveData() {
  const params = useDashboardParams()
  return useQuery({
    queryKey: ['executive', params],
    queryFn: ({ signal }) => apiFetch<ExecutiveData>('/api/dashboard/executive', params, signal),
  })
}
