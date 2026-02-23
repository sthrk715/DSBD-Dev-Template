import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from '@/lib/prisma'
import type { UserRole } from '@prisma/client'

// 設計書: docs/02_design/auth-design.md

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'jwt', maxAge: 24 * 60 * 60 }, // 24時間

  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  callbacks: {
    // Google SSOドメイン制限 + ステータスチェック
    async signIn({ account, profile }) {
      if (account?.provider === 'google') {
        const allowedDomains = process.env.ALLOWED_EMAIL_DOMAINS?.split(',') ?? []
        const emailDomain = profile?.email?.split('@')[1]
        if (allowedDomains.length > 0 && !allowedDomains.includes(emailDomain ?? '')) {
          return false
        }

        if (profile?.email) {
          const existingUser = await prisma.user.findUnique({
            where: { email: profile.email },
          })
          if (existingUser) {
            // 無効化されたユーザーはログイン不可
            if (existingUser.status === 'DEACTIVATED') {
              return false
            }
            // lastLoginAt更新 + 招待中→有効化
            await prisma.user.update({
              where: { id: existingUser.id },
              data: {
                lastLoginAt: new Date(),
                status: existingUser.status === 'INVITED' ? 'ACTIVE' : existingUser.status,
              },
            })
          }
          // 新規ユーザーはPrismaAdapterが自動作成（VIEWER + ACTIVEがデフォルト）
        }
      }
      return true
    },

    // JWTにrole・idを含める
    async jwt({ token, user, trigger }) {
      if (user) {
        token.role = (user as { role: UserRole }).role
        token.id = user.id
      }
      // セッション更新時にDBからロールを再取得
      if (trigger === 'update') {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id as string },
          select: { role: true },
        })
        if (dbUser) {
          token.role = dbUser.role
        }
      }
      return token
    },

    // セッションにrole・idを公開
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as UserRole
        session.user.id = token.id as string
      }
      return session
    },

    // ページレベル認可
    authorized({ auth: session, request: { nextUrl } }) {
      const isLoggedIn = !!session?.user

      // 管理者ページ
      if (nextUrl.pathname.startsWith('/settings') || nextUrl.pathname.startsWith('/api/admin/')) {
        return session?.user?.role === 'ADMIN'
      }

      // ダッシュボード
      if (nextUrl.pathname.startsWith('/dashboard')) {
        return isLoggedIn
      }

      return true
    },
  },

  pages: {
    signIn: '/login',
  },
})
