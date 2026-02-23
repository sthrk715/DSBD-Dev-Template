import { requireAdmin } from '@/lib/api-auth'
import { errorResponse, successResponse } from '@/lib/api-response'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import type { NextRequest } from 'next/server'

const eventUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  type: z.enum(['PROMOTION', 'HOLIDAY', 'CAMPAIGN', 'OTHER']).optional(),
  memo: z.string().optional(),
})

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdmin()
  if (error) {
    return error
  }

  const { id } = await params
  const body = await request.json()
  const parsed = eventUpdateSchema.safeParse(body)
  if (!parsed.success) {
    return errorResponse('VALIDATION_ERROR', 'リクエストが不正です', 400, parsed.error.errors[0]?.message ?? '', '/api/admin/events/:id')
  }

  const data: Record<string, unknown> = { ...parsed.data }
  if (parsed.data.startDate) {
    data.startDate = new Date(parsed.data.startDate)
  }
  if (parsed.data.endDate) {
    data.endDate = new Date(parsed.data.endDate)
  }

  const event = await prisma.event.update({ where: { id }, data })
  return successResponse(event)
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdmin()
  if (error) {
    return error
  }

  const { id } = await params
  await prisma.event.delete({ where: { id } })
  return successResponse({ id, deleted: true })
}
