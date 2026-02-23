import { requireAdmin } from '@/lib/api-auth'
import { successResponse } from '@/lib/api-response'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const { error } = await requireAdmin()
  if (error) {
    return error
  }

  const seasons = await prisma.giftSeason.findMany({ orderBy: { startDate: 'asc' } })
  return successResponse(seasons)
}
