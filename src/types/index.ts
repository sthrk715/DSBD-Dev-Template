// ===== 共通型定義 =====

/** APIレスポンス共通型 */
export interface ApiResponse<T> {
  data: T
  meta?: {
    total: number
    page: number
    perPage: number
  }
}

/** APIエラーレスポンス (RFC 7807) */
export interface ApiError {
  type: string
  title: string
  status: number
  detail: string
  instance?: string
}

/** ユーザーロール */
export type UserRole = 'admin' | 'editor' | 'viewer'

/** ユーザー */
export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  avatarUrl?: string
}

/** 期間フィルター */
export interface DateRange {
  from: Date
  to: Date
}

/** ダッシュボードフィルター */
export interface DashboardFilters {
  dateRange: DateRange
  // [TODO: プロジェクト固有のフィルターを追加]
}

/** KPIカードデータ */
export interface KpiData {
  label: string
  value: number
  unit?: string
  changeRate?: number // 前期比（%）
  trend?: 'up' | 'down' | 'flat'
}

/** チャートデータポイント */
export interface ChartDataPoint {
  label: string
  value: number
  [key: string]: unknown
}
