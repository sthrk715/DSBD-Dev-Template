import { auth } from '@/lib/auth'
import { errorResponse, successResponse } from '@/lib/api-response'
import { z } from 'zod'

const exportParamsSchema = z.object({
  tab: z.enum(['executive', 'channels', 'subscription', 'customers', 'access', 'gifts', 'products', 'email', 'timeseries']),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  channel: z.enum(['all', 'shopify', 'amazon', 'rakuten', 'yahoo']).optional(),
})

export async function GET(request: Request) {
  const session = await auth()
  if (!session?.user) {
    return errorResponse('UNAUTHORIZED', '認証が必要です', 401, 'ログインしてください', '/api/export/csv')
  }

  const { searchParams } = new URL(request.url)
  const raw = Object.fromEntries(searchParams.entries())
  const result = exportParamsSchema.safeParse(raw)
  if (!result.success) {
    return errorResponse('VALIDATION_ERROR', 'リクエストパラメータが不正です', 400, result.error.errors[0]?.message ?? '', '/api/export/csv')
  }

  const { tab, startDate, endDate } = result.data
  const fileName = `${tab}_${startDate.replace(/-/g, '')}_${endDate.replace(/-/g, '')}.csv`

  // TODO: BigQuery → GCS → 署名付きURL の実装（現在はモックレスポンス）
  return successResponse({
    downloadUrl: `https://storage.googleapis.com/mock-bucket/${fileName}`,
    expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    rowCount: 1500,
    fileName,
  })
}
