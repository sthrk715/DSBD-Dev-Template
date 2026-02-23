import { TrendingUpIcon, TrendingDownIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

// ── 円形プログレス ────────────────────────────────────────────
function CircularProgress({
  pct,
  size = 44,
  color = "#1A1A1A",
}: {
  pct: number
  size?: number
  color?: string
}) {
  const r = (size - 5) / 2
  const circ = 2 * Math.PI * r
  const offset = circ * (1 - Math.min(Math.max(pct, 0), 1))
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="shrink-0 -rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--muted)" strokeWidth={3.5} />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke={color} strokeWidth={3.5}
        strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round"
      />
    </svg>
  )
}

// ── トレンドバッジ ─────────────────────────────────────────────
function TrendBadge({ rate }: { rate: number }) {
  const up = rate >= 0
  return (
    <Badge
      variant="outline"
      className={`flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-xs font-semibold tabular-nums ${
        up ? "border-neutral-300 bg-neutral-100 text-neutral-800" : "border-neutral-200 bg-neutral-50 text-neutral-500"
      }`}
    >
      {up
        ? <TrendingUpIcon className="size-2.5" />
        : <TrendingDownIcon className="size-2.5" />}
      {Math.abs(rate)}%
    </Badge>
  )
}

// ── KPI カードデータ型 ─────────────────────────────────────────
type KpiData = {
  title: string
  target: string
  active: string
  activePct: number
  activeTrend: number
  baseline: string
  baselinePct: number
  color: string
}

const KPI_CARDS: KpiData[] = [
  {
    title: "総売上",
    target: "¥15,000,000",
    active: "¥12,500,000",
    activePct: 0.83, activeTrend: 5.2,
    baseline: "¥11,880,000",
    baselinePct: 0.79,
    color: "#1A1A1A",
  },
  {
    title: "注文件数",
    target: "2,000 件",
    active: "1,847 件",
    activePct: 0.92, activeTrend: -2.1,
    baseline: "1,887 件",
    baselinePct: 0.94,
    color: "#404040",
  },
  {
    title: "ユニーク顧客数",
    target: "1,500 人",
    active: "1,203 人",
    activePct: 0.80, activeTrend: 8.7,
    baseline: "1,107 人",
    baselinePct: 0.74,
    color: "#666666",
  },
  {
    title: "平均注文単価",
    target: "¥8,000",
    active: "¥6,768",
    activePct: 0.85, activeTrend: 0.3,
    baseline: "¥6,748",
    baselinePct: 0.84,
    color: "#8C8C8C",
  },
]

// ── 個別カード ────────────────────────────────────────────────
function KpiCard({ data }: { data: KpiData }) {
  return (
    <Card className="@container/card shadow-xs">
      <CardHeader className="pb-2 pt-4 px-4">
        <CardTitle className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          {data.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-4 space-y-3">
        {/* Target */}
        <div>
          <p className="text-xs text-muted-foreground mb-0.5">Target</p>
          <p className="text-lg font-bold text-foreground leading-tight tabular-nums">
            {data.target}
          </p>
        </div>

        {/* Active */}
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0 flex-1">
            <p className="text-xs text-muted-foreground mb-0.5">Active</p>
            <div className="flex items-center gap-1.5 flex-wrap">
              <p className="text-base font-semibold text-foreground truncate tabular-nums">
                {data.active}
              </p>
              <TrendBadge rate={data.activeTrend} />
            </div>
          </div>
          <CircularProgress pct={data.activePct} color={data.color} />
        </div>

        {/* Baseline */}
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0 flex-1">
            <p className="text-xs text-muted-foreground mb-0.5">Baseline</p>
            <p className="text-base font-semibold text-foreground truncate tabular-nums">
              {data.baseline}
            </p>
          </div>
          <CircularProgress pct={data.baselinePct} color="#8C8C8C" />
        </div>
      </CardContent>
    </Card>
  )
}

// ── メインコンポーネント ──────────────────────────────────────
export function SectionCards() {
  return (
    <div className="*:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4 grid grid-cols-1 gap-4 px-4 lg:px-6">
      {KPI_CARDS.map((card, i) => (
        <KpiCard key={i} data={card} />
      ))}
    </div>
  )
}
