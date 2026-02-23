import { requireAdmin } from '@/lib/api-auth'
import { errorResponse, successResponse } from '@/lib/api-response'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import type { NextRequest } from 'next/server'

const roleSchema = z.object({
  role: z.enum(['ADMIN', 'VIEWER']),
})

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error, session } = await requireAdmin()
  if (error) {
    return error
  }

  const { id } = await params

  // 自分自身は変更不可
  if (id === session!.user.id) {
    return errorResponse('VALIDATION_ERROR', '自分自身のロールは変更できません', 400, '', '/api/admin/users/:id/role')
  }

  const body = await request.json()
  const parsed = roleSchema.safeParse(body)
  if (!parsed.success) {
    return errorResponse('VALIDATION_ERROR', 'ロールはADMINまたはVIEWERを指定してください', 400, '', '/api/admin/users/:id/role')
  }

  const user = await prisma.user.findUnique({ where: { id, deletedAt: null } })
  if (!user) {
    return errorResponse('NOT_FOUND', 'ユーザーが見つかりません', 404, id, '/api/admin/users/:id/role')
  }

  // ADMINからVIEWERへの降格時: 最後のADMINチェック
  if (user.role === 'ADMIN' && parsed.data.role === 'VIEWER') {
    const adminCount = await prisma.user.count({ where: { role: 'ADMIN', deletedAt: null, status: 'ACTIVE' } })
    if (adminCount <= 1) {
      return errorResponse('VALIDATION_ERROR', '最後の管理者のロールは変更できません', 400, '', '/api/admin/users/:id/role')
    }
  }

  const updated = await prisma.user.update({
    where: { id },
    data: { role: parsed.data.role },
    select: { id: true, email: true, role: true },
  })

  return successResponse(updated)
}
