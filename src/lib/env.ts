import { z } from 'zod'

/**
 * サーバーサイド環境変数のバリデーションスキーマ
 * アプリケーション起動時に必須変数の存在と形式を検証する
 */
const serverEnvSchema = z.object({
  // アプリケーション
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

  // 認証 (NextAuth.js)
  NEXTAUTH_URL: z.string().url().optional(),
  NEXTAUTH_SECRET: z.string().min(1, 'NEXTAUTH_SECRET is required'),
  GOOGLE_CLIENT_ID: z.string().min(1, 'GOOGLE_CLIENT_ID is required'),
  GOOGLE_CLIENT_SECRET: z.string().min(1, 'GOOGLE_CLIENT_SECRET is required'),
  ALLOWED_EMAIL_DOMAINS: z.string().optional().default(''),

  // データベース
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),

  // BigQuery
  GCP_PROJECT_ID: z.string().min(1, 'GCP_PROJECT_ID is required'),
  BIGQUERY_DATASET: z.string().optional().default(''),
  GOOGLE_APPLICATION_CREDENTIALS: z.string().optional(),

  // GCP
  GCP_REGION: z.string().optional().default('asia-northeast1'),

  // 開発用
  SKIP_AUTH: z
    .string()
    .optional()
    .transform((v) => v === 'true'),
})

/**
 * クライアントサイド環境変数のバリデーションスキーマ
 * NEXT_PUBLIC_ プレフィックスの変数のみ
 */
const clientEnvSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().url().optional().default('http://localhost:3000'),
  NEXT_PUBLIC_SENTRY_DSN: z.string().optional().default(''),
})

export type ServerEnv = z.infer<typeof serverEnvSchema>
export type ClientEnv = z.infer<typeof clientEnvSchema>

/**
 * サーバーサイド環境変数（API Route / Server Component で使用）
 * 開発時は SKIP_AUTH=true の場合、認証系変数を省略可能
 */
export function getServerEnv(): ServerEnv {
  // 開発時にSKIP_AUTH=trueの場合は認証系変数を省略可能
  if (process.env.SKIP_AUTH === 'true') {
    const devSchema = serverEnvSchema.extend({
      NEXTAUTH_SECRET: z.string().optional().default('dev-secret'),
      GOOGLE_CLIENT_ID: z.string().optional().default('dev-client-id'),
      GOOGLE_CLIENT_SECRET: z.string().optional().default('dev-client-secret'),
      GCP_PROJECT_ID: z.string().optional().default('dev-project'),
    })
    return devSchema.parse(process.env) as ServerEnv
  }
  return serverEnvSchema.parse(process.env)
}

/**
 * クライアントサイド環境変数
 */
export function getClientEnv(): ClientEnv {
  return clientEnvSchema.parse({
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
  })
}
