import { NextResponse } from 'next/server'

// 設計書: docs/02_design/permission-management.md

const DEV_SESSION = {
  user: { id: 'dev-user', name: 'Dev User', email: 'dev@localhost', role: 'ADMIN' as const },
  expires: new Date(Date.now() + 86400000).toISOString(),
}

export async function requireAuth() {
  if (process.env.SKIP_AUTH === 'true') {
    return { error: null, session: DEV_SESSION }
  }

  const { auth } = await import('@/lib/auth')
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
