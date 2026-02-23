import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'
import Credentials from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@auth/prisma-adapter'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import type { UserRole } from '@prisma/client'

// 設計書: docs/02_design/auth-design.md

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'jwt', maxAge: 24 * 60 * 60 }, // 24時間

  providers: [
    // 方式1: Google SSO
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    // 方式2: Email & Password
    Credentials({
      credentials: {
        email: { label: 'メールアドレス', type: 'email' },
        password: { label: 'パスワード', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {return null}

        const email = credentials.email as string
        const password = credentials.password as string

        const user = await prisma.user.findUnique({ where: { email } })
        if (!user?.passwordHash) {return null}

        // アカウントロック中チェック
        if (user.lockedUntil && user.lockedUntil > new Date()) {return null}

        const isValid = await bcrypt.compare(password, user.passwordHash)
        if (!isValid) {
          // ログイン失敗カウント + ロック判定 (5回で30分ロック)
          await prisma.user.update({
            where: { id: user.id },
            data: {
              failedLoginAttempts: { increment: 1 },
              ...(user.failedLoginAttempts + 1 >= 5 && {
                lockedUntil: new Date(Date.now() + 30 * 60 * 1000),
              }),
            },
          })
          return null
        }

        // 成功: 失敗カウンターリセット
        await prisma.user.update({
          where: { id: user.id },
          data: { failedLoginAttempts: 0, lockedUntil: null },
        })

        return { id: user.id, email: user.email, name: user.name, role: user.role }
      },
    }),
  ],

  callbacks: {
    // Google SSOドメイン制限
    async signIn({ account, profile }) {
      if (account?.provider === 'google') {
        const allowedDomains = process.env.ALLOWED_EMAIL_DOMAINS?.split(',') ?? []
        const emailDomain = profile?.email?.split('@')[1]
        if (allowedDomains.length > 0 && !allowedDomains.includes(emailDomain ?? '')) {
          return false
        }
      }
      return true
    },

    // JWTにrole・idを含める
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { role: UserRole }).role
        token.id = user.id
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
      if (nextUrl.pathname.startsWith('/settings/users') || nextUrl.pathname.startsWith('/api/admin/')) {
        return session?.user?.role === 'ADMIN'
      }

      // ダッシュボード・設定ページ
      if (nextUrl.pathname.startsWith('/dashboard') || nextUrl.pathname.startsWith('/settings')) {
        return isLoggedIn
      }

      return true
    },
  },

  pages: {
    signIn: '/login',
  },
})
