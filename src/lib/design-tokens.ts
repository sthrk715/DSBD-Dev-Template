// ================================================================
// Design Tokens — ここを編集してデザインをカスタマイズします
// ================================================================

/** チャートカラーパレット (Recharts での fill/stroke に使用) */
export const CHART_COLORS = [
  '#1A1A1A', // gray-950
  '#404040', // gray-800
  '#666666', // gray-600
  '#8C8C8C', // gray-500
  '#B3B3B3', // gray-400
  '#CCCCCC', // gray-300
  '#D9D9D9', // gray-250
  '#E6E6E6', // gray-200
] as const

export type ChartColor = (typeof CHART_COLORS)[number]

/** ステータスバッジのスタイルマッピング */
export const STATUS_STYLES = {
  active:   { bg: 'bg-success-light',  text: 'text-success-dark',  dot: 'bg-success' },
  inactive: { bg: 'bg-gray-100',       text: 'text-gray-500',      dot: 'bg-gray-400' },
  pending:  { bg: 'bg-warning-light',  text: 'text-warning-dark',  dot: 'bg-warning' },
  error:    { bg: 'bg-error-light',    text: 'text-error-dark',    dot: 'bg-error' },
  paid:     { bg: 'bg-success-light',  text: 'text-success-dark',  dot: 'bg-success' },
  unpaid:   { bg: 'bg-error-light',    text: 'text-error-dark',    dot: 'bg-error' },
  sent:     { bg: 'bg-info-light',     text: 'text-info-dark',     dot: 'bg-info' },
  draft:    { bg: 'bg-gray-100',       text: 'text-gray-500',      dot: 'bg-gray-400' },
} as const

export type StatusType = keyof typeof STATUS_STYLES

/** KPIカードのアイコン背景グラジェント */
export const KPI_GRADIENTS = [
  { style: { background: 'linear-gradient(135deg, #1A1A1A, #404040)' }, label: 'black-dark' },
  { style: { background: 'linear-gradient(135deg, #404040, #666666)' }, label: 'dark-medium' },
  { style: { background: 'linear-gradient(135deg, #666666, #8C8C8C)' }, label: 'medium-light' },
  { style: { background: 'linear-gradient(135deg, #8C8C8C, #B3B3B3)' }, label: 'light-pale' },
] as const

export type KpiGradient = (typeof KPI_GRADIENTS)[number]

/** アイコンキーの型 */
export type IconKey =
  | 'dashboard'
  | 'analytics'
  | 'report'
  | 'users'
  | 'profile'
  | 'settings'

/** サイドバーナビゲーション定義 — 書き換えてメニュー構造を変更 */
export const SIDEBAR_NAV = [
  {
    section: 'メイン',
    items: [
      { label: 'ダッシュボード', href: '/dashboard',  iconKey: 'dashboard' as IconKey },
      { label: '売上分析',       href: '/analytics',  iconKey: 'analytics'  as IconKey },
      { label: '商品管理',       href: '/products',   iconKey: 'report'     as IconKey },
      { label: '顧客分析',       href: '/customers',  iconKey: 'users'      as IconKey },
      { label: 'レポート',       href: '/reports',    iconKey: 'report'     as IconKey },
    ],
  },
  {
    section: '管理',
    items: [
      { label: 'ユーザー管理',   href: '/settings/users',   iconKey: 'users'    as IconKey },
      { label: 'プロフィール',   href: '/settings/profile', iconKey: 'profile'  as IconKey },
      { label: '設定',           href: '/settings',         iconKey: 'settings' as IconKey },
    ],
  },
] as const

/** アプリ設定 — ブランドカスタマイズはここを書き換える */
export const APP_CONFIG = {
  /** アプリ名 (TopNavのタイトル等に使用) */
  name: 'EC Store Dashboard',
  /** ロゴ内略称 (2〜3文字) */
  shortName: 'EC',
  /** サブタイトル */
  description: 'ECサイト売上管理ダッシュボード',
} as const

/** テーブルのページあたり行数オプション */
export const PAGE_SIZE_OPTIONS = [10, 25, 50] as const
