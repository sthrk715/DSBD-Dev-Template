/**
 * カスタムエラークラス階層
 *
 * API Route で型安全かつ一貫したエラーハンドリングを実現する。
 * RFC 7807 Problem Details フォーマットと統合。
 *
 * 使い方:
 *   throw new NotFoundError('User')
 *   throw new ValidationError('Invalid date range', { startDate: 'must be before endDate' })
 *   throw new ForbiddenError()
 */

export class AppError extends Error {
  public readonly statusCode: number
  public readonly code: string

  constructor(statusCode: number, message: string, code: string) {
    super(message)
    this.name = this.constructor.name
    this.statusCode = statusCode
    this.code = code
  }

  /**
   * RFC 7807 Problem Details 形式に変換
   */
  toResponse(instance: string) {
    return {
      type: `https://api.example.com/errors/${this.code.toLowerCase()}`,
      title: this.name,
      status: this.statusCode,
      detail: this.message,
      instance,
    }
  }
}

/** 400 Bad Request */
export class BadRequestError extends AppError {
  constructor(message = 'Bad request') {
    super(400, message, 'BAD_REQUEST')
  }
}

/** 401 Unauthorized */
export class UnauthorizedError extends AppError {
  constructor(message = 'Authentication required') {
    super(401, message, 'UNAUTHORIZED')
  }
}

/** 403 Forbidden */
export class ForbiddenError extends AppError {
  constructor(message = 'Forbidden') {
    super(403, message, 'FORBIDDEN')
  }
}

/** 404 Not Found */
export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(404, `${resource} not found`, 'NOT_FOUND')
  }
}

/** 422 Unprocessable Entity（バリデーションエラー） */
export class ValidationError extends AppError {
  public readonly fieldErrors: Record<string, string>

  constructor(message: string, fieldErrors: Record<string, string> = {}) {
    super(422, message, 'VALIDATION_ERROR')
    this.fieldErrors = fieldErrors
  }

  override toResponse(instance: string) {
    return {
      ...super.toResponse(instance),
      fieldErrors: this.fieldErrors,
    }
  }
}

/** 500 Internal Server Error（予期しないエラー） */
export class InternalError extends AppError {
  constructor(message = 'Internal server error') {
    super(500, message, 'INTERNAL_ERROR')
  }
}

/**
 * エラーオブジェクトから AppError に変換するヘルパー
 * API Route の catch ブロックで使用
 */
export function toAppError(error: unknown): AppError {
  if (error instanceof AppError) {
    return error
  }
  // 予期しないエラーは InternalError にラップ（詳細を漏らさない）
  return new InternalError()
}
