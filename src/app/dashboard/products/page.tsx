'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { StackedBarChart } from '@/components/dashboard/charts/StackedBarChart'
import { DonutChart } from '@/components/dashboard/charts/DonutChart'
import { fmtYen, fmtYenMan } from '@/lib/mock-data'

// ── KPI ──────────────────────────────────────────────────────
const PRODUCT_KPI = [
  { label: '注力商品売上合計', value: '¥38,200,000', trend: '+16.8%' },
  { label: '前年同月比',       value: '+16.8%',       trend: '前年 ¥32,700,000' },
]

// ── 注力商品ランキング ───────────────────────────────────────
const FOCUS_PRODUCTS = [
  { rank: 1, name: 'オマール海老のビスク',           sales: 4500000, units: 12000, yoy: 18.5 },
  { rank: 2, name: '東京ボルシチ',                   sales: 3800000, units: 10500, yoy: 12.3 },
  { rank: 3, name: 'とうもろこしとさつま芋のスープ',  sales: 3200000, units: 9200,  yoy: 8.7 },
  { rank: 4, name: '参鶏湯',                         sales: 2900000, units: 8100,  yoy: 15.2 },
  { rank: 5, name: 'ミネストローネ',                  sales: 2600000, units: 7500,  yoy: 6.4 },
  { rank: 6, name: '緑の野菜と岩塩のスープ',         sales: 2400000, units: 6800,  yoy: 22.1 },
  { rank: 7, name: 'カレーとスープのセット',           sales: 2200000, units: 5200,  yoy: 11.5 },
  { rank: 8, name: '石窯パンセット',                  sales: 1900000, units: 4800,  yoy: 9.8 },
  { rank: 9, name: 'ボーンブロス',                    sales: 1800000, units: 4200,  yoy: 28.3 },
  { rank: 10, name: 'スープストックギフトセット',      sales: 1600000, units: 3500,  yoy: 14.7 },
]

// ── カテゴリ別月次売上構成 ───────────────────────────────────
const CATEGORY_MONTHLY = [
  { month: '9月',  スープ: 3800, カレー: 1200, パン: 800, ギフトセット: 1500, その他: 500 },
  { month: '10月', スープ: 4100, カレー: 1300, パン: 850, ギフトセット: 1600, その他: 520 },
  { month: '11月', スープ: 4300, カレー: 1350, パン: 900, ギフトセット: 2000, その他: 550 },
  { month: '12月', スープ: 5200, カレー: 1500, パン: 1000, ギフトセット: 3200, その他: 600 },
  { month: '1月',  スープ: 4600, カレー: 1400, パン: 950, ギフトセット: 1800, その他: 580 },
  { month: '2月',  スープ: 4800, カレー: 1450, パン: 980, ギフトセット: 1900, その他: 590 },
]

// ── カテゴリ構成比 ───────────────────────────────────────────
const CATEGORY_COMPOSITION = [
  { name: 'スープ',       value: 26800, color: '#1A1A1A' },
  { name: 'カレー',       value: 8200,  color: '#404040' },
  { name: 'パン',         value: 5480,  color: '#666666' },
  { name: 'ギフトセット', value: 12000, color: '#8C8C8C' },
  { name: 'その他',       value: 3340,  color: '#CCCCCC' },
]

export default function ProductsPage() {
  const catTotal = CATEGORY_COMPOSITION.reduce((s, d) => s + d.value, 0)

  return (
    <div className="flex flex-col gap-4 py-4 md:gap-5 md:py-5">
      {/* KPIカード */}
      <div className="@xl/main:grid-cols-2 grid grid-cols-1 gap-4 px-4 lg:px-6">
        {PRODUCT_KPI.map((kpi) => (
          <Card key={kpi.label} className="shadow-xs">
            <CardHeader className="pb-1 pt-4 px-4">
              <CardTitle className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{kpi.label}</CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4">
              <p className="text-xl font-bold tabular-nums">{kpi.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{kpi.trend}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 px-4 lg:grid-cols-2 lg:px-6">
        {/* カテゴリ別月次売上 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold">カテゴリ別月次売上構成</CardTitle>
            <CardDescription>万円</CardDescription>
          </CardHeader>
          <CardContent>
            <StackedBarChart
              data={CATEGORY_MONTHLY}
              series={[
                { key: 'スープ', label: 'スープ', color: '#1A1A1A' },
                { key: 'カレー', label: 'カレー', color: '#404040' },
                { key: 'パン', label: 'パン', color: '#666666' },
                { key: 'ギフトセット', label: 'ギフトセット', color: '#8C8C8C' },
                { key: 'その他', label: 'その他', color: '#CCCCCC' },
              ]}
              xKey="month"
              yFormatter={fmtYenMan}
              showLegend
              height={300}
            />
          </CardContent>
        </Card>

        {/* カテゴリ構成比 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold">カテゴリ売上構成比</CardTitle>
            <CardDescription>全チャネル合計</CardDescription>
          </CardHeader>
          <CardContent>
            <DonutChart
              data={CATEGORY_COMPOSITION}
              centerValue={`¥${(catTotal / 10000).toFixed(0)}万`}
              centerLabel="合計"
              formatter={fmtYenMan}
              height={300}
            />
          </CardContent>
        </Card>
      </div>

      {/* 注力商品ランキング */}
      <div className="px-4 lg:px-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold">注力商品売上ランキング</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border bg-muted/40">
                    <th className="px-3 py-2 text-center font-medium text-muted-foreground w-10">#</th>
                    <th className="px-3 py-2 text-left font-medium text-muted-foreground">商品名</th>
                    <th className="px-3 py-2 text-right font-medium text-muted-foreground">売上</th>
                    <th className="px-3 py-2 text-right font-medium text-muted-foreground">販売数</th>
                    <th className="px-3 py-2 text-right font-medium text-muted-foreground">前年比</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {FOCUS_PRODUCTS.map((row) => (
                    <tr key={row.rank} className="hover:bg-muted/30 transition-colors">
                      <td className="px-3 py-2 text-center tabular-nums font-medium text-muted-foreground">{row.rank}</td>
                      <td className="px-3 py-2 text-foreground">{row.name}</td>
                      <td className="px-3 py-2 text-right tabular-nums font-medium">{fmtYen(row.sales)}</td>
                      <td className="px-3 py-2 text-right tabular-nums text-muted-foreground">{row.units.toLocaleString()}</td>
                      <td className="px-3 py-2 text-right tabular-nums font-medium">+{row.yoy}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
