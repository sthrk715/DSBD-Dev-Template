import { requireAdmin } from '@/lib/api-auth'
import { errorResponse, successResponse } from '@/lib/api-response'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const inviteSchema = z.object({
  email: z.string().email('有効なメールアドレスを入力してください'),
  name: z.string().optional(),
  role: z.enum(['ADMIN', 'VIEWER']).default('VIEWER'),
})

export async function POST(request: Request) {
  const { error, session } = await requireAdmin()
  if (error) {
    return error
  }

  const body = await request.json()
  const parsed = inviteSchema.safeParse(body)
  if (!parsed.success) {
    return errorResponse('VALIDATION_ERROR', 'リクエストが不正です', 400, parsed.error.errors[0]?.message ?? '', '/api/admin/users/invite')
  }

  const { email, name, role } = parsed.data

  // ドメインチェック
  const allowedDomains = process.env.ALLOWED_EMAIL_DOMAINS?.split(',') ?? []
  const emailDomain = email.split('@')[1]
  if (allowedDomains.length > 0 && !allowedDomains.includes(emailDomain ?? '')) {
    return errorResponse('VALIDATION_ERROR', '許可されていないドメインです', 400, `${emailDomain} は許可されていません`, '/api/admin/users/invite')
  }

  // 重複チェック
  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    return errorResponse('CONFLICT', 'このメールアドレスは既に登録されています', 409, email, '/api/admin/users/invite')
  }

  const user = await prisma.user.create({
    data: {
      email,
      name,
      role,
      status: 'INVITED',
      invitedById: session!.user.id,
    },
  })

  // TODO: 招待メール送信

  return successResponse({ id: user.id, email: user.email, role: user.role, status: user.status })
}
