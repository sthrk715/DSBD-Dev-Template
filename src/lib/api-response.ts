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
