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
    title: "合計売上（4チャネル）",
    target: "¥85,000,000",
    active: "¥72,340,000",
    activePct: 0.85, activeTrend: 12.3,
    baseline: "¥64,420,000",
    baselinePct: 0.76,
    color: "#1A1A1A",
  },
  {
    title: "目標達成率",
    target: "100%",
    active: "85.1%",
    activePct: 0.85, activeTrend: 3.2,
    baseline: "78.5%",
    baselinePct: 0.79,
    color: "#404040",
  },
  {
    title: "前年同月比",
    target: "+15.0%",
    active: "+12.3%",
    activePct: 0.82, activeTrend: 2.1,
    baseline: "+8.7%",
    baselinePct: 0.58,
    color: "#666666",
  },
  {
    title: "注文件数",
    target: "12,000 件",
    active: "10,847 件",
    activePct: 0.90, activeTrend: 8.5,
    baseline: "9,987 件",
    baselinePct: 0.83,
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
            <p className="text-xs text-muted-foreground mb-0.5">前年同月</p>
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
