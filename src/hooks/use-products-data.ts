import { useQuery } from '@tanstack/react-query'
import { apiFetch } from '@/lib/api-client'
import { useDashboardParams } from '@/hooks/use-dashboard-params'
import type { ProductsData } from '@/lib/data-service/types'

export function useProductsData() {
  const params = useDashboardParams()
  return useQuery({
    queryKey: ['products', params],
    queryFn: ({ signal }) => apiFetch<ProductsData>('/api/dashboard/products', params, signal),
  })
}
