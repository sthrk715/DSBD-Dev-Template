import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  if (process.env.SKIP_AUTH === 'true') {
    return NextResponse.next()
  }

  const { auth } = await import('@/lib/auth')
  const session = await auth()

  if (!session?.user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // 管理者ページは ADMIN のみ
  const { pathname } = request.nextUrl
  if (pathname.startsWith('/settings') || pathname.startsWith('/api/admin/')) {
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/settings/:path*', '/api/admin/:path*'],
}
