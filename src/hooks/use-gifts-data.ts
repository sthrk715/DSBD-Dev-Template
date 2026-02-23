import { useQuery } from '@tanstack/react-query'
import { apiFetch } from '@/lib/api-client'
import { useDashboardParams } from '@/hooks/use-dashboard-params'
import { useFilterStore } from '@/stores/filter-store'
import type { GiftsData } from '@/lib/data-service/types'

export function useGiftsData() {
  const params = useDashboardParams()
  const giftSeason = useFilterStore((s) => s.giftSeason)
  const queryParams = { ...params, season: giftSeason }

  return useQuery({
    queryKey: ['gifts', queryParams],
    queryFn: ({ signal }) => apiFetch<GiftsData>('/api/dashboard/gifts', queryParams, signal),
  })
}
