"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboardIcon,
  BarChart2Icon,
  RepeatIcon,
  UsersIcon,
  UserCircleIcon,
  SettingsIcon,
  LogOutIcon,
  MousePointerClickIcon,
  GiftIcon,
  PackageIcon,
  MailIcon,
  CalendarRangeIcon,
} from "lucide-react"

import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
} from "@/components/ui/sidebar"

const NAV_DASHBOARD = [
  { title: "エグゼクティブサマリ",  href: "/dashboard",              icon: LayoutDashboardIcon },
  { title: "チャネル別詳細",        href: "/dashboard/channels",     icon: BarChart2Icon },
  { title: "サブスク分析",          href: "/dashboard/subscription", icon: RepeatIcon },
  { title: "顧客分析",             href: "/dashboard/customers",    icon: UsersIcon },
  { title: "アクセス・CVR分析",     href: "/dashboard/access",       icon: MousePointerClickIcon },
  { title: "ギフト売上",            href: "/dashboard/gift",         icon: GiftIcon },
  { title: "商品カテゴリ別売上",     href: "/dashboard/products",     icon: PackageIcon },
  { title: "メルマガ分析",          href: "/dashboard/email",        icon: MailIcon },
  { title: "時系列比較",            href: "/dashboard/timeseries",   icon: CalendarRangeIcon },
]

const NAV_SETTINGS = [
  { title: "Users",      href: "/settings/users",   icon: UsersIcon },
  { title: "Profile",    href: "/settings/profile", icon: UserCircleIcon },
  { title: "Settings",   href: "/settings",         icon: SettingsIcon },
]

const user = {
  name: "User Name",
  email: "user@example.com",
  avatar: "",
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      {/* ── ロゴ ─────────────────────────────────────── */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:!p-2">
              <Link href="/dashboard" className="flex items-center gap-2">
                <svg width="24" height="24" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
                  <rect x="2" y="2" width="28" height="28" rx="6" fill="#1A1A1A" />
                  <path d="M9 22V14l7-4 7 4v8l-7 4-7-4z" fill="white" fillOpacity="0.9" />
                  <path d="M16 10v12M9 14l7 4 7-4" stroke="#1A1A1A" strokeWidth="1.5" fill="none" />
                </svg>
                <span className="text-base font-bold tracking-tight">Soup Stock Tokyo</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* ── ナビゲーション ─────────────────────────── */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>ダッシュボード</SidebarGroupLabel>
          <SidebarMenu>
            {NAV_DASHBOARD.map((item) => {
              const Icon = item.icon
              const active =
                item.href === "/dashboard"
                  ? pathname === "/dashboard"
                  : pathname === item.href || pathname.startsWith(item.href + "/")
              return (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={active}>
                    <Link href={item.href}>
                      <Icon className="size-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>管理</SidebarGroupLabel>
          <SidebarMenu>
            {NAV_SETTINGS.map((item) => {
              const Icon = item.icon
              const active = pathname === item.href
              return (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={active}>
                    <Link href={item.href}>
                      <Icon className="size-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            })}
          </SidebarMenu>
        </SidebarGroup>

        {/* ── ログアウト ─────────────────────────────── */}
        <SidebarGroup className="mt-auto">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/login">
                  <LogOutIcon className="size-4" />
                  <span>Logout</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  )
}
