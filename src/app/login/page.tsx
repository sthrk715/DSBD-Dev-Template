'use client'

import { Suspense, useState } from 'react'
import { signIn } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

// 設計書: docs/02_design/auth-design.md

const ERROR_MESSAGES: Record<string, string> = {
  OAuthAccountNotLinked: 'このメールアドレスは別の認証方法で登録されています。',
  AccessDenied: 'アクセスが許可されていません。管理者にお問い合わせください。',
  default: 'Google認証に失敗しました。再度お試しください。',
}

function LoginContent() {
  const [loading, setLoading] = useState(false)
  const searchParams = useSearchParams()
  const errorParam = searchParams.get('error')
  const errorMessage = errorParam ? (ERROR_MESSAGES[errorParam] ?? ERROR_MESSAGES.default) : null

  const handleGoogleLogin = async () => {
    setLoading(true)
    await signIn('google', { callbackUrl: '/dashboard' })
  }

  return (
    <div className="min-h-screen bg-muted/40 flex flex-col">
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm">
          <div className="flex flex-col items-center justify-center gap-1 mb-8">
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">
              Your Company
            </h1>
            <p className="text-sm text-muted-foreground">EC Dashboard</p>
          </div>

          <Card>
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-lg font-bold">ログイン</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              {errorMessage && (
                <p className="text-xs text-destructive bg-destructive/10 px-3 py-2 rounded-md mb-4">
                  {errorMessage}
                </p>
              )}

              <Button
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full"
                size="lg"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ログイン中...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
                      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
                      <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
                      <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
                      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
                    </svg>
                    Googleでログイン
                  </span>
                )}
              </Button>

              <p className="text-center text-xs text-muted-foreground mt-4">
                アカウントをお持ちでない方は管理者にお問い合わせください
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <footer className="py-4 px-6 text-center text-xs text-muted-foreground">
        <span>&copy; Your Company. All rights reserved.</span>
      </footer>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  )
}
