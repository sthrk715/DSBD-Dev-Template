import type { Metadata } from 'next'
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import './globals.css'
import { APP_CONFIG } from '@/lib/design-tokens'

export const metadata: Metadata = {
  title: {
    default: APP_CONFIG.name,
    template: `%s | ${APP_CONFIG.name}`,
  },
  description: APP_CONFIG.description,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>
        <NuqsAdapter>{children}</NuqsAdapter>
      </body>
    </html>
  )
}
