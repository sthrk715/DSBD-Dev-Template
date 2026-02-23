"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import { ChevronUpIcon, ChevronDownIcon, SparklesIcon } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"

const PAGE_TITLES: Record<string, string> = {
  "/dashboard":        "ダッシュボード",
  "/analytics":        "売上分析",
  "/products":         "商品管理",
  "/customers":        "顧客分析",
  "/reports":          "レポート",
  "/settings/users":   "ユーザー管理",
  "/settings/profile": "プロフィール",
  "/settings":         "設定",
}

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
]

// ── 月ナビゲーター ────────────────────────────────────────────
function MonthPicker() {
  const now = new Date()
  const [year, setYear]   = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth())

  const prev = () => {
    if (month === 0) { setYear(y => y - 1); setMonth(11) }
    else { setMonth(m => m - 1) }
  }
  const next = () => {
    if (month === 11) { setYear(y => y + 1); setMonth(0) }
    else { setMonth(m => m + 1) }
  }

  return (
    <div className="flex items-center gap-0.5 rounded-md border border-border bg-background px-2 py-1 text-xs">
      <button onClick={prev} className="text-muted-foreground hover:text-foreground transition-colors p-0.5">
        <ChevronUpIcon className="size-3" />
      </button>
      <span className="w-24 text-center font-medium tabular-nums text-foreground">
        {MONTHS[month]} {year}
      </span>
      <button onClick={next} className="text-muted-foreground hover:text-foreground transition-colors p-0.5">
        <ChevronDownIcon className="size-3" />
      </button>
    </div>
  )
}

// ── メインコンポーネント ─────────────────────────────────────
export function SiteHeader() {
  const pathname = usePathname()
  const pageTitle = PAGE_TITLES[pathname] ?? "ダッシュボード"

  return (
    <header className="flex h-12 shrink-0 items-center gap-2 border-b bg-background px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
      <div className="flex w-full items-center justify-between">
        {/* 左: トリガー + セパレーター + ページ名 */}
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mx-1 data-[orientation=vertical]:h-4" />
          <span className="text-sm font-semibold text-foreground">{pageTitle}</span>
        </div>

        {/* 右: 月ピッカー + 言語 + AI */}
        <div className="flex items-center gap-2">
          <MonthPicker />

          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7 rounded-md text-purple-500 hover:text-purple-600 hover:bg-purple-50 border-border"
            aria-label="AI assistant"
          >
            <SparklesIcon className="size-3.5" />
          </Button>
        </div>
      </div>
    </header>
  )
}
