'use client'

import { useState } from 'react'
import type { FormEvent } from 'react'
import { EyeIcon, EyeOffIcon } from '@/components/icons'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'

// ── AnyMind ロゴ ──────────────────────────────────────────────
function AnyMindLogo() {
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
        <circle cx="16" cy="16" r="15" fill="#FF6B35" />
        <circle cx="16" cy="16" r="10" fill="#4CAF50" />
        <circle cx="16" cy="16" r="6" fill="#2196F3" />
        <circle cx="16" cy="16" r="2.5" fill="white" />
      </svg>
      <span className="text-xl font-bold text-gray-900 tracking-tight">
        AnyMind<sup className="text-xs font-normal">™</sup>
      </span>
    </div>
  )
}

// ── ログインフォーム ───────────────────────────────────────────
function LoginForm({
  onSubmit,
  loading,
}: {
  onSubmit: (email: string, password: string) => void
  loading: boolean
}) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setError('')
    if (!email || !password) {
      setError('Please enter your email and password.')
      return
    }
    onSubmit(email, password)
  }

  return (
    <form onSubmit={handleSubmit}>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@anymind.com"
            autoComplete="email"
            required
          />
        </Field>

        <Field>
          <div className="flex items-center">
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <button
              type="button"
              className="ml-auto text-xs text-blue-600 hover:text-blue-700 transition-colors underline-offset-4 hover:underline"
            >
              Forgot Password?
            </button>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••"
              autoComplete="current-password"
              required
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOffIcon size={16} /> : <EyeIcon size={16} />}
            </button>
          </div>
        </Field>

        {error && (
          <p className="text-xs text-destructive bg-destructive/10 px-3 py-2 rounded-md">
            {error}
          </p>
        )}

        <Field>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Signing in...
              </span>
            ) : (
              'Sign In'
            )}
          </Button>
          <FieldDescription className="text-center text-xs">
            Don&apos;t have an account?{' '}
            <a href="#" className="text-blue-600 hover:text-blue-700">
              Contact your administrator
            </a>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  )
}

// ── メインコンポーネント ──────────────────────────────────────
export default function LoginPage() {
  const [loading, setLoading] = useState(false)

  const handleLogin = (email: string, _password: string) => {
    setLoading(true)
    console.warn('Login attempt:', email)
    // TODO: signIn('credentials', { email, password }) を実装
    setTimeout(() => setLoading(false), 1000)
  }

  return (
    <div className="min-h-screen bg-muted/40 flex flex-col">
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm">
          <AnyMindLogo />
          <Card>
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-xl font-bold">Log In</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <LoginForm onSubmit={handleLogin} loading={loading} />
            </CardContent>
          </Card>
        </div>
      </div>

      <footer className="py-4 px-6 flex items-center justify-between text-xs text-muted-foreground">
        <span>Copyright © AnyMind Group. All right reserved.</span>
        <div className="flex items-center gap-4">
          <span>Privacy Policy and Terms of Service apply.</span>
          <select className="text-xs border border-input rounded px-2 py-1 bg-background focus:outline-hidden">
            <option>English</option>
            <option>Japanese</option>
          </select>
        </div>
      </footer>
    </div>
  )
}
