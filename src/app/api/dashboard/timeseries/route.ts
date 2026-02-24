import { requireAuth } from '@/lib/api-auth'
import { getDataService } from '@/lib/data-service'
import { timeseriesParamsSchema, parseParams } from '@/lib/validate-params'
import { successResponse, errorResponse } from '@/lib/api-response'

export async function GET(request: Request) {
  const { error } = await requireAuth()
  if (error) { return error }

  const { searchParams } = new URL(request.url)
  const parsed = parseParams(timeseriesParamsSchema, searchParams)
  if (!parsed.success) {
    return errorResponse('VALIDATION_ERROR', 'リクエストパラメータが不正です', 400, parsed.error, '/api/dashboard/timeseries')
  }

  const service = getDataService()
  const data = await service.getTimeseries(parsed.data)
  return successResponse(data)
}
