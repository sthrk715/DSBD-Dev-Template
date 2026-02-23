import { requireAdmin } from '@/lib/api-auth'
import { errorResponse, successResponse } from '@/lib/api-response'
import { prisma } from '@/lib/prisma'
import type { NextRequest } from 'next/server'

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdmin()
  if (error) {
    return error
  }

  const { id } = await params
  const user = await prisma.user.findUnique({
    where: { id, deletedAt: null },
    select: {
      id: true,
      email: true,
      name: true,
      image: true,
      role: true,
      status: true,
      lastLoginAt: true,
      createdAt: true,
      updatedAt: true,
      invitedBy: { select: { name: true, email: true } },
    },
  })

  if (!user) {
    return errorResponse('NOT_FOUND', 'ユーザーが見つかりません', 404, id, '/api/admin/users/:id')
  }

  return successResponse(user)
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { error, session } = await requireAdmin()
  if (error) {
    return error
  }

  const { id } = await params

  // 自分自身は削除不可
  if (id === session!.user.id) {
    return errorResponse('VALIDATION_ERROR', '自分自身は削除できません', 400, '', '/api/admin/users/:id')
  }

  const user = await prisma.user.findUnique({ where: { id, deletedAt: null } })
  if (!user) {
    return errorResponse('NOT_FOUND', 'ユーザーが見つかりません', 404, id, '/api/admin/users/:id')
  }

  // 最後のADMINは削除不可
  if (user.role === 'ADMIN') {
    const adminCount = await prisma.user.count({ where: { role: 'ADMIN', deletedAt: null, status: 'ACTIVE' } })
    if (adminCount <= 1) {
      return errorResponse('VALIDATION_ERROR', '最後の管理者は削除できません', 400, '', '/api/admin/users/:id')
    }
  }

  // ソフトデリート
  await prisma.user.update({
    where: { id },
    data: { deletedAt: new Date() },
  })

  return successResponse({ id, deleted: true })
}
