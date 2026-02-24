"use client"

import { usePathname } from "next/navigation"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"

const PAGE_TITLES: Record<string, string> = {
  "/dashboard":              "エグゼクティブサマリ",
  "/dashboard/channels":     "チャネル別詳細",
  "/dashboard/subscription": "サブスク分析",
  "/dashboard/customers":    "顧客分析",
  "/dashboard/access":       "アクセス・CVR分析",
  "/dashboard/gift":         "ギフト売上",
  "/dashboard/products":     "商品カテゴリ別売上",
  "/dashboard/email":        "メルマガ分析",
  "/dashboard/timeseries":   "時系列比較",
  "/settings/users":         "ユーザー管理",
  "/settings/profile":       "プロフィール",
  "/settings":               "設定",
}

export function SiteHeader() {
  const pathname = usePathname()
  const pageTitle = PAGE_TITLES[pathname] ?? "ダッシュボード"

  return (
    <header className="flex h-12 shrink-0 items-center gap-2 border-b bg-background px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mx-1 data-[orientation=vertical]:h-4" />
        <span className="text-sm font-semibold text-foreground">{pageTitle}</span>
      </div>
    </header>
  )
}
