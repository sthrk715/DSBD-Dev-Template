import { z } from 'zod'
import { format, subDays } from 'date-fns'

// 設計書: docs/02_design/api-spec.md

const dateRegex = /^\d{4}-\d{2}-\d{2}$/

const today = () => format(new Date(), 'yyyy-MM-dd')
const thirtyDaysAgo = () => format(subDays(new Date(), 30), 'yyyy-MM-dd')

export const dashboardParamsSchema = z.object({
  startDate: z.string().regex(dateRegex, 'YYYY-MM-DD形式で指定してください').default(thirtyDaysAgo),
  endDate: z.string().regex(dateRegex, 'YYYY-MM-DD形式で指定してください').default(today),
  channel: z.enum(['all', 'shopify', 'amazon', 'rakuten', 'yahoo']).default('all'),
  period: z.enum(['daily', 'weekly', 'monthly']).default('daily'),
  compareMode: z.enum(['calendar', 'same_dow']).default('calendar'),
})

export const giftsParamsSchema = dashboardParamsSchema.extend({
  season: z.enum(['all', 'mothers_day', 'chugen', 'keiro', 'seibo', 'newyear']).default('all'),
})

export const timeseriesParamsSchema = dashboardParamsSchema.extend({
  comparison: z.enum(['yoy', 'mom', 'wow', 'same_dow', 'y2y']).default('yoy'),
  movingAvg: z.enum(['none', '7d', '28d']).default('none'),
})

export function parseParams<T extends z.ZodTypeAny>(
  schema: T,
  searchParams: URLSearchParams,
): { success: true; data: z.infer<T> } | { success: false; error: string } {
  const raw = Object.fromEntries(searchParams.entries())
  const result = schema.safeParse(raw)
  if (!result.success) {
    const firstError = result.error.errors[0]
    return { success: false, error: `${firstError?.path.join('.')}: ${firstError?.message}` }
  }
  return { success: true, data: result.data }
}
