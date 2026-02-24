import type { DashboardDataService } from './interface'
import type {
  DashboardQueryParams,
  ExecutiveData,
  ChannelsData,
  SubscriptionData,
  CustomersData,
  AccessData,
  GiftsData,
  GiftsQueryParams,
  ProductsData,
  EmailData,
  TimeseriesData,
  TimeseriesQueryParams,
} from './types'

// 日付範囲の日数配列を生成
function generateDates(startDate: string, endDate: string): string[] {
  const dates: string[] = []
  const current = new Date(startDate)
  const end = new Date(endDate)
  while (current <= end) {
    dates.push(current.toISOString().slice(0, 10))
    current.setDate(current.getDate() + 1)
  }
  return dates
}

// 乱数生成（シード的にbaseを使用して一貫性を持たせる）
function mockValue(base: number, variance: number): number {
  return Math.round(base + (Math.random() - 0.5) * 2 * variance)
}

export class MockDataService implements DashboardDataService {
  async getExecutive(_params: DashboardQueryParams): Promise<ExecutiveData> {
    return {
      kpis: {
        totalSales: { value: 12345678, previousValue: 11000000, changeRate: 12.2 },
        targetAchievement: { value: 87.3, target: 15000000 },
        yoyGrowth: { value: 12.5 },
        orderCount: { value: 1234, previousValue: 1100, changeRate: 12.2 },
      },
      dailySalesTrend: generateDates(_params.startDate, _params.endDate).map((date) => ({
        date,
        sales: mockValue(450000, 100000),
        prevYearSales: mockValue(400000, 80000),
      })),
      channelBreakdown: [
        { channel: 'shopify', sales: 5000000, ratio: 0.42 },
        { channel: 'rakuten', sales: 3500000, ratio: 0.29 },
        { channel: 'amazon', sales: 2500000, ratio: 0.21 },
        { channel: 'yahoo', sales: 1000000, ratio: 0.08 },
      ],
      channelKpiTable: [
        { channel: 'shopify', sales: 5000000, orders: 500, avgPrice: 10000, yoyGrowth: 15.2 },
        { channel: 'rakuten', sales: 3500000, orders: 420, avgPrice: 8333, yoyGrowth: 8.5 },
        { channel: 'amazon', sales: 2500000, orders: 380, avgPrice: 6579, yoyGrowth: 22.1 },
        { channel: 'yahoo', sales: 1000000, orders: 150, avgPrice: 6667, yoyGrowth: -3.2 },
      ],
      events: [
        { id: 'ev1', name: '楽天マラソン', startDate: '2026-02-01', endDate: '2026-02-05', type: 'promotion' },
        { id: 'ev2', name: 'バレンタイン', startDate: '2026-02-14', endDate: '2026-02-14', type: 'holiday' },
      ],
    }
  }

  async getChannels(_params: DashboardQueryParams): Promise<ChannelsData> {
    const months = ['2025-09', '2025-10', '2025-11', '2025-12', '2026-01', '2026-02']
    return {
      kpis: {
        channelSales: { value: 12345678, previousValue: 11000000, changeRate: 12.2 },
        orders: { value: 1450, previousValue: 1300, changeRate: 11.5 },
        avgOrderValue: { value: 8514, previousValue: 8462, changeRate: 0.6 },
        conversionRate: { value: 3.2, previousValue: 2.8, changeRate: 14.3 },
      },
      monthlySalesComparison: months.map((month) => ({
        month,
        shopify: mockValue(5000000, 500000),
        amazon: mockValue(2500000, 300000),
        rakuten: mockValue(3500000, 400000),
        yahoo: mockValue(1000000, 200000),
      })),
      dailySalesTrend: generateDates(_params.startDate, _params.endDate).map((date) => ({
        date,
        sales: mockValue(450000, 100000),
        prevYearSales: mockValue(400000, 80000),
      })),
      channelDetailTable: [
        { channel: 'shopify', sales: 5000000, orders: 500, avgPrice: 10000, yoyGrowth: 15.2, conversionRate: 3.5 },
        { channel: 'rakuten', sales: 3500000, orders: 420, avgPrice: 8333, yoyGrowth: 8.5, conversionRate: 2.8 },
        { channel: 'amazon', sales: 2500000, orders: 380, avgPrice: 6579, yoyGrowth: 22.1, conversionRate: 4.1 },
        { channel: 'yahoo', sales: 1000000, orders: 150, avgPrice: 6667, yoyGrowth: -3.2, conversionRate: 1.9 },
      ],
    }
  }

  async getSubscription(_params: DashboardQueryParams): Promise<SubscriptionData> {
    const months = ['2025-04', '2025-05', '2025-06', '2025-07', '2025-08', '2025-09', '2025-10', '2025-11', '2025-12', '2026-01', '2026-02']
    const cohortMonths = ['2025-07', '2025-08', '2025-09', '2025-10', '2025-11', '2025-12']
    return {
      kpis: {
        activeContracts: { value: 8432 },
        newContracts: { value: 342 },
        churnRate: { value: 2.8 },
        pauseRate: { value: 1.8 },
        skipRate: { value: 8.4 },
      },
      contractTrend: months.map((month, i) => ({
        month,
        active: 7200 + i * 120,
        paused: 580 + i * 12,
        churned: 180 + i * 6,
      })),
      cohortHeatmap: cohortMonths.flatMap((cohortMonth, ci) =>
        Array.from({ length: 7 - ci }, (_, mi) => ({
          cohortMonth,
          monthsSinceStart: mi,
          retentionRate: mi === 0 ? 100 : Math.round((100 * Math.pow(0.92, mi)) * 10) / 10,
        }))
      ),
      monthlyChurnTrend: months.map((month) => ({
        month,
        churnRate: mockValue(28, 5) / 10,
      })),
    }
  }

  async getCustomers(_params: DashboardQueryParams): Promise<CustomersData> {
    const months = ['2025-09', '2025-10', '2025-11', '2025-12', '2026-01', '2026-02']
    return {
      kpis: {
        newCustomers: { value: 2340, previousValue: 2100, changeRate: 11.4 },
        repeatCustomers: { value: 1560, previousValue: 1400, changeRate: 11.4 },
        f2ConversionRate: { value: 32.5, previousValue: 30.1, changeRate: 8.0 },
      },
      newVsRepeatTrend: months.map((month) => ({
        month,
        newCustomers: mockValue(2300, 300),
        repeatCustomers: mockValue(1500, 200),
      })),
      aovBySegment: [
        { segment: '新規', channel: 'shopify', aov: 8500 },
        { segment: '新規', channel: 'rakuten', aov: 7200 },
        { segment: '新規', channel: 'amazon', aov: 6800 },
        { segment: 'リピーター', channel: 'shopify', aov: 12000 },
        { segment: 'リピーター', channel: 'rakuten', aov: 9500 },
        { segment: 'リピーター', channel: 'amazon', aov: 8200 },
      ],
      f2ConversionTrend: months.map((month) => ({
        month,
        rate: mockValue(325, 30) / 10,
      })),
    }
  }

  async getAccess(_params: DashboardQueryParams): Promise<AccessData> {
    return {
      kpis: {
        sessions: { value: 125000, previousValue: 110000, changeRate: 13.6 },
        pageViews: { value: 450000, previousValue: 400000, changeRate: 12.5 },
        cvr: { value: 3.2, previousValue: 2.8, changeRate: 14.3 },
        bounceRate: { value: 42.5, previousValue: 45.2, changeRate: -6.0 },
      },
      sessionTrend: generateDates(_params.startDate, _params.endDate).map((date) => ({
        date,
        sessions: mockValue(4200, 800),
        prevYearSessions: mockValue(3700, 600),
      })),
      cvrByChannel: [
        { channel: 'shopify', sessions: 45000, conversions: 1575, cvr: 3.5 },
        { channel: 'rakuten', sessions: 35000, conversions: 980, cvr: 2.8 },
        { channel: 'amazon', sessions: 30000, conversions: 1230, cvr: 4.1 },
        { channel: 'yahoo', sessions: 15000, conversions: 285, cvr: 1.9 },
      ],
      topLandingPages: [
        { page: '/products/soup-gift-set', sessions: 8500, bounceRate: 32.1, cvr: 5.2 },
        { page: '/products/seasonal-box', sessions: 6200, bounceRate: 38.5, cvr: 4.1 },
        { page: '/', sessions: 15000, bounceRate: 52.3, cvr: 2.1 },
        { page: '/collections/gift', sessions: 4800, bounceRate: 28.7, cvr: 6.3 },
      ],
    }
  }

  async getGifts(_params: GiftsQueryParams): Promise<GiftsData> {
    return {
      kpis: {
        seasonTotal: { value: 12500000, previousValue: 10500000, changeRate: 19.0 },
        eGiftRatio: { value: 35.0 },
        remainingDays: { value: 12 },
      },
      dailyProgress: generateDates(_params.startDate, _params.endDate).slice(0, 20).map((date, i) => ({
        date,
        cumulative: 500000 + i * 600000,
        prevYearCumulative: 400000 + i * 500000,
      })),
      seasonComparison: [
        { season: 'mothers_day', currentYear: 5000000, prevYear: 4200000, yoyGrowth: 19.0 },
        { season: 'chugen', currentYear: 3200000, prevYear: 2800000, yoyGrowth: 14.3 },
        { season: 'keiro', currentYear: 1800000, prevYear: 1600000, yoyGrowth: 12.5 },
        { season: 'seibo', currentYear: 2000000, prevYear: 1500000, yoyGrowth: 33.3 },
        { season: 'newyear', currentYear: 500000, prevYear: 400000, yoyGrowth: 25.0 },
      ],
      eGiftBreakdown: { eGift: 4375000, physical: 8125000 },
    }
  }

  async getProducts(_params: DashboardQueryParams): Promise<ProductsData> {
    const months = ['2025-09', '2025-10', '2025-11', '2025-12', '2026-01', '2026-02']
    return {
      kpis: {
        topCategory: { value: 5800000 },
        categoryCount: { value: 12 },
      },
      categoryMonthlySales: months.map((month) => ({
        month,
        'カテゴリA': mockValue(3000000, 300000),
        'カテゴリB': mockValue(2000000, 200000),
        'ギフトセット': mockValue(1800000, 250000),
        'アクセサリ': mockValue(800000, 100000),
      })),
      categoryBreakdown: [
        { category: 'カテゴリA', sales: 5800000, ratio: 0.38 },
        { category: 'カテゴリB', sales: 3500000, ratio: 0.23 },
        { category: 'ギフトセット', sales: 3200000, ratio: 0.21 },
        { category: 'アクセサリ', sales: 1500000, ratio: 0.10 },
        { category: 'その他', sales: 1200000, ratio: 0.08 },
      ],
      productRankingTable: [
        { rank: 1, name: '人気商品A', category: 'カテゴリA', sales: 1200000, quantity: 3200, avgPrice: 375 },
        { rank: 2, name: '人気商品B', category: 'カテゴリA', sales: 980000, quantity: 2800, avgPrice: 350 },
        { rank: 3, name: 'ギフトセットA', category: 'ギフトセット', sales: 850000, quantity: 420, avgPrice: 2024 },
        { rank: 4, name: '季節商品C', category: 'カテゴリA', sales: 780000, quantity: 2400, avgPrice: 325 },
        { rank: 5, name: 'ギフトセットB', category: 'ギフトセット', sales: 720000, quantity: 360, avgPrice: 2000 },
        { rank: 6, name: '定番商品D', category: 'カテゴリA', sales: 650000, quantity: 2000, avgPrice: 325 },
        { rank: 7, name: 'セット商品E', category: 'カテゴリB', sales: 580000, quantity: 1800, avgPrice: 322 },
        { rank: 8, name: '限定商品F', category: 'カテゴリA', sales: 520000, quantity: 1500, avgPrice: 347 },
        { rank: 9, name: 'アクセサリG', category: 'アクセサリ', sales: 450000, quantity: 3000, avgPrice: 150 },
        { rank: 10, name: '新商品H', category: 'カテゴリB', sales: 420000, quantity: 1400, avgPrice: 300 },
      ],
    }
  }

  async getEmail(_params: DashboardQueryParams): Promise<EmailData> {
    return {
      kpis: {
        sentCount: { value: 125000, previousValue: 118000, changeRate: 5.9 },
        openRate: { value: 28.5, previousValue: 26.2, changeRate: 8.8 },
        clickRate: { value: 4.2, previousValue: 3.8, changeRate: 10.5 },
        revenuePerEmail: { value: 12.5, previousValue: 11.2, changeRate: 11.6 },
      },
      campaignPerformance: [
        { campaign: '冬の特集キャンペーン', sent: 45000, opened: 14400, clicked: 2250, revenue: 680000, openRate: 32.0, clickRate: 5.0 },
        { campaign: 'バレンタインギフト特集', sent: 38000, opened: 12160, clicked: 1900, revenue: 520000, openRate: 32.0, clickRate: 5.0 },
        { campaign: '新商品お知らせ', sent: 42000, opened: 10920, clicked: 1470, revenue: 350000, openRate: 26.0, clickRate: 3.5 },
      ],
      openRateTrend: [
        { month: '2025-09', openRate: 25.2, clickRate: 3.5 },
        { month: '2025-10', openRate: 26.8, clickRate: 3.8 },
        { month: '2025-11', openRate: 27.5, clickRate: 4.0 },
        { month: '2025-12', openRate: 28.1, clickRate: 4.1 },
        { month: '2026-01', openRate: 26.2, clickRate: 3.8 },
        { month: '2026-02', openRate: 28.5, clickRate: 4.2 },
      ],
    }
  }

  async getTimeseries(_params: TimeseriesQueryParams): Promise<TimeseriesData> {
    const dates = generateDates(_params.startDate, _params.endDate)
    return {
      series: dates.map((date) => ({
        date,
        current: mockValue(450000, 100000),
        comparison: mockValue(400000, 80000),
      })),
      movingAverage: _params.movingAvg !== 'none'
        ? dates.map((date) => ({ date, value: mockValue(430000, 50000) }))
        : [],
      mtdSales: 8500000,
      ytdSales: 95000000,
      events: [
        { id: 'ev1', name: '楽天マラソン', startDate: '2026-02-01', endDate: '2026-02-05', type: 'promotion' },
        { id: 'ev2', name: 'バレンタイン', startDate: '2026-02-14', endDate: '2026-02-14', type: 'holiday' },
      ],
    }
  }
}
