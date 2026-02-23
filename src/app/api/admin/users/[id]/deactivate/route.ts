import { requireAdmin } from '@/lib/api-auth'
import { errorResponse, successResponse } from '@/lib/api-response'
import { prisma } from '@/lib/prisma'
import type { NextRequest } from 'next/server'

export async function PUT(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error, session } = await requireAdmin()
  if (error) {
    return error
  }

  const { id } = await params

  if (id === session!.user.id) {
    return errorResponse('VALIDATION_ERROR', '自分自身は無効化できません', 400, '', '/api/admin/users/:id/deactivate')
  }

  const user = await prisma.user.findUnique({ where: { id, deletedAt: null } })
  if (!user) {
    return errorResponse('NOT_FOUND', 'ユーザーが見つかりません', 404, id, '/api/admin/users/:id/deactivate')
  }

  // 最後のADMINは無効化不可
  if (user.role === 'ADMIN') {
    const adminCount = await prisma.user.count({ where: { role: 'ADMIN', deletedAt: null, status: 'ACTIVE' } })
    if (adminCount <= 1) {
      return errorResponse('VALIDATION_ERROR', '最後の管理者は無効化できません', 400, '', '/api/admin/users/:id/deactivate')
    }
  }

  const updated = await prisma.user.update({
    where: { id },
    data: { status: 'DEACTIVATED' },
    select: { id: true, email: true, status: true },
  })

  return successResponse(updated)
}
