import { toAppError } from '@/lib/errors'
import { logger } from '@/lib/logger'
import { NextResponse } from 'next/server'

// 設計書: docs/02_design/api-spec.md

export function successResponse<T>(data: T, cacheHit = false) {
  return NextResponse.json({
    data,
    meta: {
      generatedAt: new Date().toISOString(),
      cacheHit,
    },
  })
}

export function errorResponse(
  type: string,
  title: string,
  status: number,
  detail: string,
  instance: string,
) {
  return NextResponse.json({ type, title, status, detail, instance }, { status })
}

/**
 * AppError からレスポンスを生成するヘルパー
 * API Route の catch ブロックで使用:
 *
 *   try { ... } catch (error) { return handleError(error, '/api/dashboard/xxx') }
 */
export function handleError(error: unknown, instance: string) {
  const appError = toAppError(error)
  if (appError.statusCode >= 500) {
    logger.error({ err: error, instance }, appError.message)
  }
  const body = appError.toResponse(instance)
  return NextResponse.json(body, { status: appError.statusCode })
}
