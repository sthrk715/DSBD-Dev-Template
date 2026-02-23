import { requireAdmin } from '@/lib/api-auth'
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { error } = await requireAdmin()
  if (error) {
    return error
  }

  const { searchParams } = new URL(request.url)
  const page = Math.max(1, Number(searchParams.get('page') ?? 1))
  const perPage = Math.min(100, Math.max(1, Number(searchParams.get('perPage') ?? 20)))
  const role = searchParams.get('role') || undefined
  const status = searchParams.get('status') || undefined
  const search = searchParams.get('search') || undefined

  const where = {
    deletedAt: null,
    ...(role && { role: role as 'ADMIN' | 'VIEWER' }),
    ...(status && { status: status as 'ACTIVE' | 'INVITED' | 'DEACTIVATED' }),
    ...(search && {
      OR: [
        { email: { contains: search, mode: 'insensitive' as const } },
        { name: { contains: search, mode: 'insensitive' as const } },
      ],
    }),
  }

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
        role: true,
        status: true,
        lastLoginAt: true,
        createdAt: true,
        invitedBy: { select: { name: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    prisma.user.count({ where }),
  ])

  return NextResponse.json({
    data: users,
    meta: { total, page, perPage, generatedAt: new Date().toISOString() },
  })
}
