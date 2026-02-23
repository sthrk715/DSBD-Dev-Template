import { useQuery } from '@tanstack/react-query'
import { apiFetch } from '@/lib/api-client'
import { useDashboardParams } from '@/hooks/use-dashboard-params'
import type { CustomersData } from '@/lib/data-service/types'

export function useCustomersData() {
  const params = useDashboardParams()
  return useQuery({
    queryKey: ['customers', params],
    queryFn: ({ signal }) => apiFetch<CustomersData>('/api/dashboard/customers', params, signal),
  })
}
