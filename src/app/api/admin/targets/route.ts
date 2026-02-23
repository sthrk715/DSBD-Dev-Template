import { requireAdmin } from '@/lib/api-auth'
import { errorResponse, successResponse } from '@/lib/api-response'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

export async function GET() {
  const { error } = await requireAdmin()
  if (error) {
    return error
  }

  const targets = await prisma.salesTarget.findMany({ orderBy: [{ year: 'desc' }, { month: 'desc' }] })
  return successResponse(targets)
}

const targetSchema = z.object({
  year: z.number().int().min(2020).max(2030),
  month: z.number().int().min(1).max(12),
  channel: z.enum(['all', 'shopify', 'amazon', 'rakuten', 'yahoo']).default('all'),
  amount: z.number().int().positive(),
})

export async function POST(request: Request) {
  const { error } = await requireAdmin()
  if (error) {
    return error
  }

  const body = await request.json()
  const parsed = targetSchema.safeParse(body)
  if (!parsed.success) {
    return errorResponse('VALIDATION_ERROR', 'リクエストが不正です', 400, parsed.error.errors[0]?.message ?? '', '/api/admin/targets')
  }

  const target = await prisma.salesTarget.upsert({
    where: {
      year_month_channel: {
        year: parsed.data.year,
        month: parsed.data.month,
        channel: parsed.data.channel,
      },
    },
    update: { amount: parsed.data.amount },
    create: parsed.data,
  })

  return successResponse(target)
}
