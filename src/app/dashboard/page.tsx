import { Suspense } from "react"
import { AppSidebar }          from "@/components/app-sidebar"
import { SectionCards }         from "@/components/section-cards"
import { SiteHeader }           from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FilterBar } from "@/components/organisms/filter-bar"
import { CohortChart } from "@/components/cohort-chart"
import { ChartShowcase } from "@/features/dashboard/chart-showcase"
import { DashboardDataTable } from "@/features/dashboard/dashboard-data-table"
import type { DashboardRow } from "@/features/dashboard/columns"
import type { SelectOption } from "@/types/components"

import data from "./data.json"

const typedData: DashboardRow[] = data as DashboardRow[]

// ── フィルターオプション ─────────────────────────────────────────
const CHANNEL_OPTIONS: SelectOption[] = [
  { value: 'web',   label: 'Web' },
  { value: 'store', label: '実店舗' },
  { value: 'app',   label: 'アプリ' },
]

const CATEGORY_OPTIONS: SelectOption[] = [
  { value: 'electronics', label: '家電' },
  { value: 'fashion',     label: 'ファッション' },
  { value: 'food',        label: '食品・飲料' },
  { value: 'books',       label: '書籍' },
  { value: 'sports',      label: 'スポーツ' },
  { value: 'home',        label: 'ホーム' },
]

const REGION_OPTIONS: SelectOption[] = [
  { value: 'hokkaido', label: '北海道' },
  { value: 'tohoku',   label: '東北' },
  { value: 'kanto',    label: '関東' },
  { value: 'chubu',    label: '中部' },
  { value: 'kinki',    label: '近畿' },
  { value: 'chugoku',  label: '中国' },
  { value: 'shikoku',  label: '四国' },
  { value: 'kyushu',   label: '九州・沖縄' },
]

// ── コホートデータ（月次リテンション） ─────────────────────────
const COHORT_HEADERS = [
  "当月", "1ヶ月後", "2ヶ月後", "3ヶ月後",
  "4ヶ月後", "5ヶ月後", "6ヶ月後",
]

const COHORT_DATA = [
  { cohort: "2025年7月",  values: [1.00, 0.68, 0.52, 0.41, 0.35, 0.30, 0.27] },
  { cohort: "2025年8月",  values: [1.00, 0.72, 0.55, 0.44, 0.37, 0.32] },
  { cohort: "2025年9月",  values: [1.00, 0.65, 0.48, 0.38, 0.31] },
  { cohort: "2025年10月", values: [1.00, 0.70, 0.53, 0.42] },
  { cohort: "2025年11月", values: [1.00, 0.74, 0.58] },
  { cohort: "2025年12月", values: [1.00, 0.69] },
  { cohort: "2026年1月",  values: [1.00] },
]

// ── 商品別売上ランキング ─────────────────────────────────────────
const PRODUCT_RANKING = [
  { rank: 1, name: "ワイヤレスイヤホン Pro",   category: "家電",       sales: 2450000, count: 340 },
  { rank: 2, name: "スマートウォッチ X2",      category: "家電",       sales: 1980000, count: 180 },
  { rank: 3, name: "オーガニックコーヒー豆セット", category: "食品・飲料", sales: 1560000, count: 520 },
  { rank: 4, name: "カシミヤニット",            category: "ファッション", sales: 1340000, count: 95 },
  { rank: 5, name: "ランニングシューズ GT",     category: "スポーツ",    sales: 1120000, count: 160 },
  { rank: 6, name: "ポータブルプロジェクター",   category: "家電",       sales: 980000,  count: 70 },
  { rank: 7, name: "アロマディフューザー",       category: "ホーム",     sales: 870000,  count: 290 },
  { rank: 8, name: "プログラミング入門書",       category: "書籍",      sales: 750000,  count: 500 },
  { rank: 9, name: "ヨガマット プレミアム",      category: "スポーツ",   sales: 680000,  count: 340 },
  { rank: 10, name: "デニムジャケット",          category: "ファッション", sales: 620000,  count: 88 },
]

function ProductRankingTable() {
  return (
    <Card>
      <CardHeader className="pb-2 pt-4 px-4">
        <CardTitle className="text-sm font-semibold">商品別売上ランキング</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                <th className="px-3 py-2 text-center font-medium text-muted-foreground w-10">#</th>
                <th className="px-3 py-2 text-left font-medium text-muted-foreground">商品名</th>
                <th className="px-3 py-2 text-left font-medium text-muted-foreground">カテゴリ</th>
                <th className="px-3 py-2 text-right font-medium text-muted-foreground">売上</th>
                <th className="px-3 py-2 text-right font-medium text-muted-foreground">販売数</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {PRODUCT_RANKING.map((row) => (
                <tr key={row.rank} className="hover:bg-muted/30 transition-colors">
                  <td className="px-3 py-2 text-center tabular-nums font-medium text-muted-foreground">{row.rank}</td>
                  <td className="px-3 py-2 text-foreground">{row.name}</td>
                  <td className="px-3 py-2 text-muted-foreground">{row.category}</td>
                  <td className="px-3 py-2 text-right tabular-nums text-foreground font-medium">¥{row.sales.toLocaleString()}</td>
                  <td className="px-3 py-2 text-right tabular-nums text-muted-foreground">{row.count.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}

// ── ページ ────────────────────────────────────────────────────
export default function Page() {
  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-5 md:py-5">
              {/* KPI カード 4列 */}
              <SectionCards />

              {/* フィルタバー */}
              <div className="px-4 lg:px-6">
                <Suspense fallback={<div className="h-20 animate-pulse rounded-md bg-muted" />}>
                  <FilterBar
                    channelOptions={CHANNEL_OPTIONS}
                    categoryOptions={CATEGORY_OPTIONS}
                    regionOptions={REGION_OPTIONS}
                  />
                </Suspense>
              </div>

              {/* チャートセクション */}
              <div className="px-4 lg:px-6">
                <ChartShowcase />
              </div>

              {/* 商品別売上ランキング */}
              <div className="px-4 lg:px-6">
                <ProductRankingTable />
              </div>

              {/* コホート分析 */}
              <div className="px-4 lg:px-6">
                <CohortChart
                  title="顧客リテンション分析"
                  description="月次コホート別リピート購入率"
                  headers={COHORT_HEADERS}
                  data={COHORT_DATA}
                />
              </div>

              {/* 注文一覧テーブル */}
              <div className="px-4 lg:px-6">
                <DashboardDataTable data={typedData} />
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
