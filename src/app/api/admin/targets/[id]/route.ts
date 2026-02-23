import { requireAdmin } from '@/lib/api-auth'
import { errorResponse, successResponse } from '@/lib/api-response'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import type { NextRequest } from 'next/server'

const targetUpdateSchema = z.object({
  amount: z.number().int().positive(),
})

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdmin()
  if (error) {
    return error
  }

  const { id } = await params
  const body = await request.json()
  const parsed = targetUpdateSchema.safeParse(body)
  if (!parsed.success) {
    return errorResponse('VALIDATION_ERROR', 'リクエストが不正です', 400, parsed.error.errors[0]?.message ?? '', '/api/admin/targets/:id')
  }

  const target = await prisma.salesTarget.update({
    where: { id },
    data: { amount: parsed.data.amount },
  })

  return successResponse(target)
}
