import { requireAdmin } from '@/lib/api-auth'
import { errorResponse, successResponse } from '@/lib/api-response'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

export async function GET() {
  const { error } = await requireAdmin()
  if (error) {
    return error
  }

  const events = await prisma.event.findMany({ orderBy: { startDate: 'desc' } })
  return successResponse(events)
}

const eventSchema = z.object({
  name: z.string().min(1),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  type: z.enum(['PROMOTION', 'HOLIDAY', 'CAMPAIGN', 'OTHER']),
  memo: z.string().optional(),
})

export async function POST(request: Request) {
  const { error } = await requireAdmin()
  if (error) {
    return error
  }

  const body = await request.json()
  const parsed = eventSchema.safeParse(body)
  if (!parsed.success) {
    return errorResponse('VALIDATION_ERROR', 'リクエストが不正です', 400, parsed.error.errors[0]?.message ?? '', '/api/admin/events')
  }

  const event = await prisma.event.create({
    data: {
      ...parsed.data,
      startDate: new Date(parsed.data.startDate),
      endDate: new Date(parsed.data.endDate),
    },
  })

  return successResponse(event)
}
