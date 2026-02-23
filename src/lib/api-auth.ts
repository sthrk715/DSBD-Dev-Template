import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

// 設計書: docs/02_design/permission-management.md

export async function requireAuth() {
  const session = await auth()

  if (!session?.user) {
    return {
      error: NextResponse.json(
        { type: 'UNAUTHORIZED', title: '認証が必要です', status: 401, detail: 'ログインしてください', instance: '' },
        { status: 401 },
      ),
      session: null,
    }
  }

  return { error: null, session }
}

export async function requireAdmin() {
  const { error, session } = await requireAuth()
  if (error) {
    return { error, session: null }
  }

  if (session!.user.role !== 'ADMIN') {
    return {
      error: NextResponse.json(
        { type: 'FORBIDDEN', title: '権限がありません', status: 403, detail: '管理者権限が必要です', instance: '' },
        { status: 403 },
      ),
      session: null,
    }
  }

  return { error: null, session: session! }
}
