import { useQuery } from '@tanstack/react-query'
import { apiFetch } from '@/lib/api-client'
import { useDashboardParams } from '@/hooks/use-dashboard-params'
import type { EmailData } from '@/lib/data-service/types'

export function useEmailData() {
  const params = useDashboardParams()
  return useQuery({
    queryKey: ['email', params],
    queryFn: ({ signal }) => apiFetch<EmailData>('/api/dashboard/email', params, signal),
  })
}
