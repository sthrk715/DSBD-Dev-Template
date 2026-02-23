"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboardIcon,
  BarChart2Icon,
  FileTextIcon,
  UsersIcon,
  UserCircleIcon,
  SettingsIcon,
  LogOutIcon,
  PackageIcon,
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

const NAV_MAIN = [
  { title: "ダッシュボード", href: "/dashboard",  icon: LayoutDashboardIcon },
  { title: "売上分析",       href: "/analytics",  icon: BarChart2Icon },
  { title: "商品管理",       href: "/products",   icon: PackageIcon },
  { title: "顧客分析",       href: "/customers",  icon: UsersIcon },
  { title: "レポート",       href: "/reports",    icon: FileTextIcon },
]

const NAV_SETTINGS = [
  { title: "Users",      href: "/settings/users",   icon: UsersIcon },
  { title: "Profile",    href: "/settings/profile", icon: UserCircleIcon },
  { title: "Settings",   href: "/settings",         icon: SettingsIcon },
]

const user = {
  name: "User Name",
  email: "user@anymindgroup.com",
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
                  <rect x="2" y="2" width="28" height="28" rx="6" fill="#2563EB" />
                  <path d="M9 22V14l7-4 7 4v8l-7 4-7-4z" fill="white" fillOpacity="0.9" />
                  <path d="M16 10v12M9 14l7 4 7-4" stroke="#2563EB" strokeWidth="1.5" fill="none" />
                </svg>
                <span className="text-base font-bold tracking-tight">EC Store</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* ── ナビゲーション ─────────────────────────── */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarMenu>
            {NAV_MAIN.map((item) => {
              const Icon = item.icon
              const active = pathname === item.href || pathname.startsWith(item.href + "/")
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
          <SidebarGroupLabel>Settings</SidebarGroupLabel>
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
