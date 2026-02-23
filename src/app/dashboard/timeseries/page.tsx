'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LineChartComponent } from '@/components/dashboard/charts/LineChart'
import { AreaLineChart } from '@/components/dashboard/charts/AreaLineChart'
import { ComposedChartComponent } from '@/components/dashboard/charts/ComposedChart'
import { fmtYenMan } from '@/lib/mock-data'

// ── 日次売上生成（90日分） ──────────────────────────────────
function generateDailyData() {
  const data: { date: string; 当年: number; 前年: number; 前々年: number; ma7: number; ma28: number }[] = []
  for (let i = 0; i < 90; i++) {
    const d = new Date(2026, 0, 1)
    d.setDate(d.getDate() + i)
    const label = `${d.getMonth() + 1}/${d.getDate()}`
    const base = 2000000 + Math.sin(i / 7 * Math.PI) * 400000
    const current = Math.floor(base + Math.random() * 600000)
    const prevYear = Math.floor(base * 0.88 + Math.random() * 500000)
    const prev2Year = Math.floor(base * 0.76 + Math.random() * 400000)
    data.push({ date: label, 当年: current, 前年: prevYear, 前々年: prev2Year, ma7: 0, ma28: 0 })
  }
  // 移動平均を計算
  for (let i = 0; i < data.length; i++) {
    const s7 = data.slice(Math.max(0, i - 6), i + 1)
    data[i].ma7 = Math.floor(s7.reduce((a, b) => a + b.当年, 0) / s7.length)
    const s28 = data.slice(Math.max(0, i - 27), i + 1)
    data[i].ma28 = Math.floor(s28.reduce((a, b) => a + b.当年, 0) / s28.length)
  }
  return data
}

const DAILY_DATA = generateDailyData()

// ── MTD累積 ──────────────────────────────────────────────────
const MTD_DATA = Array.from({ length: 24 }, (_, i) => {
  const actual = (i + 1) * 3200000 + Math.floor(Math.random() * 500000)
  const target = (i + 1) * 3540000
  return { day: `2/${i + 1}`, 実績累計: actual, 目標累計: target }
})

// ── イベントマーカー付き売上（直近60日） ─────────────────────
const EVENTS = [
  { date: '1/1',  label: '元日' },
  { date: '2/3',  label: '節分' },
  { date: '2/14', label: 'バレンタイン' },
]

const RECENT_DATA = DAILY_DATA.slice(0, 60)

export default function TimeseriesPage() {
  return (
    <div className="flex flex-col gap-4 py-4 md:gap-5 md:py-5">
      {/* 当年 vs 前年 vs 前々年 */}
      <div className="px-4 lg:px-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold">年次比較（当年 vs 前年 vs 前々年）</CardTitle>
            <CardDescription>日次売上推移</CardDescription>
          </CardHeader>
          <CardContent>
            <LineChartComponent
              data={DAILY_DATA.slice(0, 60)}
              series={[
                { key: '当年', label: '2026年', color: '#1A1A1A' },
                { key: '前年', label: '2025年', color: '#666666' },
                { key: '前々年', label: '2024年', color: '#CCCCCC' },
              ]}
              xKey="date"
              yFormatter={fmtYenMan}
              height={300}
            />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 px-4 lg:grid-cols-2 lg:px-6">
        {/* MTD/YTD累積 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold">MTD累積売上 vs 目標</CardTitle>
            <CardDescription>2月 月初来累計</CardDescription>
          </CardHeader>
          <CardContent>
            <AreaLineChart
              data={MTD_DATA}
              series={[
                { key: '実績累計', label: '実績累計', color: '#1A1A1A' },
                { key: '目標累計', label: '目標累計', color: '#B3B3B3' },
              ]}
              xKey="day"
              yFormatter={fmtYenMan}
              showLegend
              height={260}
            />
          </CardContent>
        </Card>

        {/* 移動平均 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold">売上 + 移動平均</CardTitle>
            <CardDescription>7日MA / 28日MA</CardDescription>
          </CardHeader>
          <CardContent>
            <ComposedChartComponent
              data={RECENT_DATA}
              series={[
                { key: '当年', label: '日次売上', type: 'bar', yAxisId: 'left', color: '#E6E6E6' },
                { key: 'ma7', label: '7日MA', type: 'line', yAxisId: 'left', color: '#1A1A1A' },
                { key: 'ma28', label: '28日MA', type: 'line', yAxisId: 'left', color: '#666666' },
              ]}
              xKey="date"
              yFormatter={fmtYenMan}
              height={260}
            />
          </CardContent>
        </Card>
      </div>

      {/* イベントカレンダー */}
      <div className="px-4 lg:px-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold">販促イベントカレンダー</CardTitle>
            <CardDescription>直近のイベント・販促施策</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border bg-muted/40">
                    <th className="px-3 py-2 text-left font-medium text-muted-foreground">日付</th>
                    <th className="px-3 py-2 text-left font-medium text-muted-foreground">イベント</th>
                    <th className="px-3 py-2 text-left font-medium text-muted-foreground">備考</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {EVENTS.map((ev) => (
                    <tr key={ev.date} className="hover:bg-muted/30 transition-colors">
                      <td className="px-3 py-2 tabular-nums font-medium">{ev.date}</td>
                      <td className="px-3 py-2 text-foreground">{ev.label}</td>
                      <td className="px-3 py-2 text-muted-foreground">—</td>
                    </tr>
                  ))}
                  <tr className="hover:bg-muted/30 transition-colors">
                    <td className="px-3 py-2 tabular-nums font-medium">3/3</td>
                    <td className="px-3 py-2 text-foreground">ひなまつり</td>
                    <td className="px-3 py-2 text-muted-foreground">限定商品販売予定</td>
                  </tr>
                  <tr className="hover:bg-muted/30 transition-colors">
                    <td className="px-3 py-2 tabular-nums font-medium">3/14</td>
                    <td className="px-3 py-2 text-foreground">ホワイトデー</td>
                    <td className="px-3 py-2 text-muted-foreground">ギフト特集ページ公開</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
