import { auth } from '@/lib/auth'
import { getDataService } from '@/lib/data-service'
import { giftsParamsSchema, parseParams } from '@/lib/validate-params'
import { successResponse, errorResponse } from '@/lib/api-response'

export async function GET(request: Request) {
  const session = await auth()
  if (!session?.user) {
    return errorResponse('UNAUTHORIZED', '認証が必要です', 401, 'ログインしてください', '/api/dashboard/gifts')
  }

  const { searchParams } = new URL(request.url)
  const parsed = parseParams(giftsParamsSchema, searchParams)
  if (!parsed.success) {
    return errorResponse('VALIDATION_ERROR', 'リクエストパラメータが不正です', 400, parsed.error, '/api/dashboard/gifts')
  }

  const service = getDataService()
  const data = await service.getGifts(parsed.data)
  return successResponse(data)
}
