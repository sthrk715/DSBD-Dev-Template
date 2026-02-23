'use client'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { AreaLineChart } from '@/components/dashboard/charts/AreaLineChart'
import { ComposedChartComponent } from '@/components/dashboard/charts/ComposedChart'
import { DonutChart } from '@/components/dashboard/charts/DonutChart'
import { BarChart } from '@/components/dashboard/charts/BarChart'

// ── 日次売上推移（AreaLineChart） ──────────────────────────────
const DAILY_SALES = [
  { date: '1/1',  web: 420, store: 280 },
  { date: '1/5',  web: 380, store: 310 },
  { date: '1/10', web: 510, store: 290 },
  { date: '1/15', web: 460, store: 340 },
  { date: '1/20', web: 580, store: 320 },
  { date: '1/25', web: 520, store: 360 },
  { date: '1/30', web: 610, store: 380 },
  { date: '2/5',  web: 540, store: 350 },
  { date: '2/10', web: 630, store: 410 },
  { date: '2/15', web: 590, store: 390 },
  { date: '2/20', web: 680, store: 420 },
]

// ── カテゴリ別売上（DonutChart） ───────────────────────────────
const CATEGORY_SALES = [
  { name: '家電',       value: 4200 },
  { name: 'ファッション', value: 3100 },
  { name: '食品・飲料',  value: 2800 },
  { name: '書籍',       value: 1500 },
  { name: 'スポーツ',    value: 1200 },
  { name: 'ホーム',      value: 900 },
]

// ── チャネル別売上比較（BarChart） ─────────────────────────────
const CHANNEL_MONTHLY = [
  { month: '9月',  web: 2800, store: 1200, app: 600 },
  { month: '10月', web: 3200, store: 1400, app: 750 },
  { month: '11月', web: 3000, store: 1300, app: 680 },
  { month: '12月', web: 3800, store: 1600, app: 900 },
  { month: '1月',  web: 3400, store: 1500, app: 820 },
  { month: '2月',  web: 3900, store: 1700, app: 950 },
]

// ── 売上・利益・利益率推移（ComposedChart） ────────────────────
const COMPOSED_DATA = [
  { month: '9月',  sales: 4600, profit: 1380, rate: 30.0 },
  { month: '10月', sales: 5350, profit: 1660, rate: 31.1 },
  { month: '11月', sales: 4980, profit: 1490, rate: 30.0 },
  { month: '12月', sales: 6300, profit: 2090, rate: 33.1 },
  { month: '1月',  sales: 5720, profit: 1840, rate: 32.1 },
  { month: '2月',  sales: 6550, profit: 2220, rate: 33.9 },
]

const yenK = (v: number) => `¥${(v / 1000).toFixed(0)}k`
const yenMan = (v: number) => `¥${v.toLocaleString()}万`
const pct = (v: number) => `${v.toFixed(1)}%`

export function ChartShowcase() {
  const categoryTotal = CATEGORY_SALES.reduce((s, d) => s + d.value, 0)

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      {/* 日次売上推移 */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-sm font-semibold">
            売上推移
          </CardTitle>
          <CardDescription>チャネル別日次売上（万円）</CardDescription>
        </CardHeader>
        <CardContent>
          <AreaLineChart
            data={DAILY_SALES}
            series={[
              { key: 'web', label: 'Web', color: '#1A1A1A' },
              { key: 'store', label: '実店舗', color: '#999999' },
            ]}
            xKey="date"
            yFormatter={yenMan}
            stacked
            showLegend
            height={260}
          />
        </CardContent>
      </Card>

      {/* カテゴリ別売上構成 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold">
            カテゴリ別売上構成
          </CardTitle>
          <CardDescription>商品カテゴリ別の売上割合</CardDescription>
        </CardHeader>
        <CardContent>
          <DonutChart
            data={CATEGORY_SALES}
            centerValue={`¥${(categoryTotal / 10000).toFixed(1)}億`}
            centerLabel="総売上"
            formatter={yenMan}
            height={220}
          />
        </CardContent>
      </Card>

      {/* チャネル別売上比較 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold">
            チャネル別売上比較
          </CardTitle>
          <CardDescription>月次チャネル別売上（万円）</CardDescription>
        </CardHeader>
        <CardContent>
          <BarChart
            data={CHANNEL_MONTHLY}
            series={[
              { key: 'web', label: 'Web', color: '#1A1A1A' },
              { key: 'store', label: '実店舗', color: '#666666' },
              { key: 'app', label: 'アプリ', color: '#B3B3B3' },
            ]}
            xKey="month"
            yFormatter={yenK}
            showLegend
            height={260}
          />
        </CardContent>
      </Card>

      {/* 売上・利益・利益率推移 */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-sm font-semibold">
            売上・利益・利益率推移
          </CardTitle>
          <CardDescription>
            棒グラフ（売上・利益）+ 折れ線（利益率）
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ComposedChartComponent
            data={COMPOSED_DATA}
            series={[
              { key: 'sales', label: '売上', type: 'bar', yAxisId: 'left' },
              { key: 'profit', label: '利益', type: 'bar', yAxisId: 'left' },
              { key: 'rate', label: '利益率', type: 'line', yAxisId: 'right' },
            ]}
            xKey="month"
            yFormatter={yenK}
            yRightFormatter={pct}
            showRightAxis
            height={280}
          />
        </CardContent>
      </Card>
    </div>
  )
}
