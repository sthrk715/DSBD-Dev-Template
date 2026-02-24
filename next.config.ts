import { withSentryConfig } from '@sentry/nextjs'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'standalone', // Cloud Run用
  poweredByHeader: false, // セキュリティ: X-Powered-By ヘッダー無効化
  reactStrictMode: true,

  // セキュリティヘッダー（静的アセットは Next.js が適切な Content-Type を付与するため除外）
  async headers() {
    return [
      {
        source: '/((?!_next|favicon.ico).*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline'", // [TODO: nonce対応後に厳格化]
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "img-src 'self' data: https:",
              "font-src 'self' https://fonts.gstatic.com",
              `connect-src 'self'${process.env.NODE_ENV === 'development' ? ' ws://localhost:* http://localhost:*' : ''}`,
              "frame-ancestors 'none'",
            ].join('; '),
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ]
  },
}

export default withSentryConfig(nextConfig, {
  // Sentry が未設定の場合はビルドログを抑制
  silent: true,
  // ソースマップのアップロードは DSN 設定時のみ
  sourcemaps: {
    disable: !process.env.NEXT_PUBLIC_SENTRY_DSN,
  },
})
