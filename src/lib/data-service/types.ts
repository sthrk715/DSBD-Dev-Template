// API レスポンス型定義（docs/02_design/api-spec.md 準拠）

// ===== 共通 =====

export interface KpiValue {
  value: number
  previousValue?: number
  changeRate?: number
  target?: number
}

export interface EventItem {
  id: string
  name: string
  startDate: string
  endDate: string
  type: 'promotion' | 'holiday' | 'campaign' | 'other'
}

export interface DashboardQueryParams {
  startDate: string
  endDate: string
  channel: string
  period: 'daily' | 'weekly' | 'monthly'
  compareMode: 'calendar' | 'same_dow'
}

// ===== タブ1: エグゼクティブサマリ =====

export interface ExecutiveData {
  kpis: {
    totalSales: KpiValue
    targetAchievement: KpiValue
    yoyGrowth: KpiValue
    orderCount: KpiValue
  }
  dailySalesTrend: { date: string; sales: number; prevYearSales: number }[]
  channelBreakdown: { channel: string; sales: number; ratio: number }[]
  channelKpiTable: { channel: string; sales: number; orders: number; avgPrice: number; yoyGrowth: number }[]
  events: EventItem[]
}

// ===== タブ2: チャネル別詳細 =====

export interface ChannelsData {
  kpis: {
    channelSales: KpiValue
    orders: KpiValue
    avgOrderValue: KpiValue
    conversionRate: KpiValue
  }
  monthlySalesComparison: { month: string; shopify: number; amazon: number; rakuten: number; yahoo: number }[]
  dailySalesTrend: { date: string; sales: number; prevYearSales: number }[]
  channelDetailTable: { channel: string; sales: number; orders: number; avgPrice: number; yoyGrowth: number; conversionRate: number }[]
}

// ===== タブ3: サブスク分析 =====

export interface SubscriptionData {
  kpis: {
    activeContracts: KpiValue
    newContracts: KpiValue
    churnRate: KpiValue
    pauseRate: KpiValue
    skipRate: KpiValue
  }
  contractTrend: { month: string; active: number; paused: number; churned: number }[]
  cohortHeatmap: { cohortMonth: string; monthsSinceStart: number; retentionRate: number }[]
  monthlyChurnTrend: { month: string; churnRate: number }[]
}

// ===== タブ4: 顧客分析 =====

export interface CustomersData {
  kpis: {
    newCustomers: KpiValue
    repeatCustomers: KpiValue
    f2ConversionRate: KpiValue
  }
  newVsRepeatTrend: { month: string; newCustomers: number; repeatCustomers: number }[]
  aovBySegment: { segment: string; channel: string; aov: number }[]
  f2ConversionTrend: { month: string; rate: number }[]
}

// ===== タブ5: アクセス・CVR分析 =====

export interface AccessData {
  kpis: {
    sessions: KpiValue
    pageViews: KpiValue
    cvr: KpiValue
    bounceRate: KpiValue
  }
  sessionTrend: { date: string; sessions: number; prevYearSessions: number }[]
  cvrByChannel: { channel: string; sessions: number; conversions: number; cvr: number }[]
  topLandingPages: { page: string; sessions: number; bounceRate: number; cvr: number }[]
}

// ===== タブ6: ギフト売上 =====

export interface GiftsQueryParams extends DashboardQueryParams {
  season: string
}

export interface GiftsData {
  kpis: {
    seasonTotal: KpiValue
    eGiftRatio: KpiValue
    remainingDays: KpiValue
  }
  dailyProgress: { date: string; cumulative: number; prevYearCumulative: number }[]
  seasonComparison: { season: string; currentYear: number; prevYear: number; yoyGrowth: number }[]
  eGiftBreakdown: { eGift: number; physical: number }
}

// ===== タブ7: 商品カテゴリ別売上 =====

export interface ProductsData {
  kpis: {
    topCategory: KpiValue
    categoryCount: KpiValue
  }
  categoryMonthlySales: { month: string; [category: string]: string | number }[]
  categoryBreakdown: { category: string; sales: number; ratio: number }[]
  productRankingTable: { rank: number; name: string; category: string; sales: number; quantity: number; avgPrice: number }[]
}

// ===== タブ8: メルマガ分析 =====

export interface EmailData {
  kpis: {
    sentCount: KpiValue
    openRate: KpiValue
    clickRate: KpiValue
    revenuePerEmail: KpiValue
  }
  campaignPerformance: { campaign: string; sent: number; opened: number; clicked: number; revenue: number; openRate: number; clickRate: number }[]
  openRateTrend: { month: string; openRate: number; clickRate: number }[]
}

// ===== タブ9: 時系列比較 =====

export interface TimeseriesQueryParams extends DashboardQueryParams {
  comparison: string
  movingAvg: string
}

export interface TimeseriesData {
  series: { date: string; current: number; comparison: number }[]
  movingAverage: { date: string; value: number }[]
  mtdSales: number
  ytdSales: number
  events: EventItem[]
}
