import { requireAdmin } from '@/lib/api-auth'
import { errorResponse, successResponse } from '@/lib/api-response'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

export async function GET() {
  const { error } = await requireAdmin()
  if (error) {
    return error
  }

  const settings = await prisma.systemSetting.findMany()
  const settingsMap = Object.fromEntries(settings.map((s) => [s.key, s.value]))
  return successResponse(settingsMap)
}

const settingsSchema = z.record(z.string(), z.string())

export async function PUT(request: Request) {
  const { error } = await requireAdmin()
  if (error) {
    return error
  }

  const body = await request.json()
  const parsed = settingsSchema.safeParse(body)
  if (!parsed.success) {
    return errorResponse('VALIDATION_ERROR', 'リクエストが不正です', 400, parsed.error.errors[0]?.message ?? '', '/api/admin/settings')
  }

  const updates = Object.entries(parsed.data).map(([key, value]) =>
    prisma.systemSetting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    }),
  )

  await prisma.$transaction(updates)
  return successResponse({ updated: Object.keys(parsed.data).length })
}
