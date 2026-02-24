import pino from 'pino'

/**
 * 構造化ロガー
 *
 * 本番: JSON フォーマット（Cloud Logging で構造化クエリ可能）
 * 開発: pino-pretty でカラー付き読みやすい出力
 *
 * 使い方:
 *   import { logger } from '@/lib/logger'
 *   logger.info({ userId, action: 'login' }, 'User logged in')
 *   logger.error({ err, endpoint }, 'API request failed')
 */
export const logger = pino({
  level: process.env.LOG_LEVEL ?? 'info',

  // GCP Cloud Logging 互換のフィールドマッピング
  ...(process.env.NODE_ENV === 'production'
    ? {
        messageKey: 'message',
        formatters: {
          level(label: string) {
            // Cloud Logging の severity フィールドにマッピング
            const severityMap: Record<string, string> = {
              trace: 'DEBUG',
              debug: 'DEBUG',
              info: 'INFO',
              warn: 'WARNING',
              error: 'ERROR',
              fatal: 'CRITICAL',
            }
            return { severity: severityMap[label] ?? 'DEFAULT' }
          },
        },
      }
    : {
        transport: {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'HH:MM:ss',
            ignore: 'pid,hostname',
          },
        },
      }),
})
