"use client"

import { useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PlusIcon, ChevronsUpDownIcon } from "lucide-react"

// ── 型定義 ────────────────────────────────────────────────────
type User = {
  id: string
  name: string
  email: string
  lastActive: string
  createdAt: string
}

// ── サンプルデータ ─────────────────────────────────────────────
const USERS: User[] = [
  { id: "u1",  name: "Nuttapon Chansuksai", email: "nuttapon.c@anymindgroup.com", lastActive: "May 07, 2025", createdAt: "Apr 21, 2025" },
  { id: "u2",  name: "Aisha Thompson",      email: "aisha.t@anymindgroup.com",    lastActive: "Jun 15, 2025", createdAt: "May 30, 2025" },
  { id: "u3",  name: "Raj Patel",           email: "raj.p@anymindgroup.com",      lastActive: "Jul 20, 2025", createdAt: "Jun 05, 2025" },
  { id: "u4",  name: "Clara Gomez",         email: "clara.g@anymindgroup.com",    lastActive: "Aug 12, 2025", createdAt: "Jul 28, 2025" },
  { id: "u5",  name: "Omar Farooq",         email: "omar.f@anymindgroup.com",     lastActive: "Sep 09, 2025", createdAt: "Aug 25, 2025" },
  { id: "u6",  name: "Lena Zhao",           email: "lena.z@anymindgroup.com",     lastActive: "Oct 01, 2025", createdAt: "Sep 15, 2025" },
  { id: "u7",  name: "Ethan Kim",           email: "ethan.k@anymindgroup.com",    lastActive: "Nov 18, 2025", createdAt: "Oct 30, 2025" },
  { id: "u8",  name: "Sofia Martinez",      email: "sofia.m@anymindgroup.com",    lastActive: "Dec 05, 2025", createdAt: "Nov 20, 2025" },
  { id: "u9",  name: "Nuttapon Chansuksai", email: "nuttapon.c@anymindgroup.com", lastActive: "May 07, 2025", createdAt: "Apr 21, 2025" },
  { id: "u10", name: "Aisha Thompson",      email: "aisha.t@anymindgroup.com",    lastActive: "Jun 15, 2025", createdAt: "May 30, 2025" },
  { id: "u11", name: "Raj Patel",           email: "raj.p@anymindgroup.com",      lastActive: "Jul 20, 2025", createdAt: "Jun 05, 2025" },
  { id: "u12", name: "Clara Gomez",         email: "clara.g@anymindgroup.com",    lastActive: "Aug 12, 2025", createdAt: "Jul 28, 2025" },
  { id: "u13", name: "Omar Farooq",         email: "omar.f@anymindgroup.com",     lastActive: "Sep 09, 2025", createdAt: "Aug 25, 2025" },
  { id: "u14", name: "Lena Zhao",           email: "lena.z@anymindgroup.com",     lastActive: "Oct 01, 2025", createdAt: "Sep 15, 2025" },
  { id: "u15", name: "Ethan Kim",           email: "ethan.k@anymindgroup.com",    lastActive: "Nov 18, 2025", createdAt: "Oct 30, 2025" },
]

const PAGE_SIZE = 15

type SortKey = "email" | "lastActive" | "createdAt"
type SortDir = "asc" | "desc"

// ── ソータブルヘッダー ────────────────────────────────────────
function SortableHeader({
  label, sortKey, currentKey, onSort,
}: {
  label: string
  sortKey: SortKey
  currentKey: SortKey | null
  currentDir: SortDir
  onSort: (k: SortKey) => void
}) {
  const active = currentKey === sortKey
  return (
    <th className="px-4 py-3 text-left">
      <button
        onClick={() => onSort(sortKey)}
        className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
      >
        {label}
        <ChevronsUpDownIcon className={`size-3 ${active ? "text-foreground" : "text-muted-foreground/40"}`} />
      </button>
    </th>
  )
}

// ── メインページ ─────────────────────────────────────────────
export default function UsersPage() {
  const [page, setPage]         = useState(0)
  const [sortKey, setSortKey]   = useState<SortKey | null>(null)
  const [sortDir, setSortDir]   = useState<SortDir>("asc")

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(d => d === "asc" ? "desc" : "asc")
    } else {
      setSortKey(key)
      setSortDir("asc")
    }
  }

  const sorted = [...USERS].sort((a, b) => {
    if (!sortKey) { return 0 }
    const cmp = a[sortKey] < b[sortKey] ? -1 : a[sortKey] > b[sortKey] ? 1 : 0
    return sortDir === "asc" ? cmp : -cmp
  })

  const totalPages = Math.ceil(sorted.length / PAGE_SIZE)
  const pageData   = sorted.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)
  const startRow   = page * PAGE_SIZE + 1
  const endRow     = Math.min((page + 1) * PAGE_SIZE, sorted.length)

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col p-4 md:p-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3 pt-4 px-4">
              <CardTitle className="text-base font-semibold">Users</CardTitle>
              <Button size="sm" className="h-8 gap-1.5 text-sm">
                <PlusIcon className="size-3.5" />
                Add User
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              {/* テーブル */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Name</th>
                      <SortableHeader label="Email Address" sortKey="email"      currentKey={sortKey} currentDir={sortDir} onSort={handleSort} />
                      <SortableHeader label="Last Active"   sortKey="lastActive" currentKey={sortKey} currentDir={sortDir} onSort={handleSort} />
                      <SortableHeader label="Created At"    sortKey="createdAt"  currentKey={sortKey} currentDir={sortDir} onSort={handleSort} />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {pageData.map((user) => (
                      <tr key={user.id} className="hover:bg-muted/20 transition-colors">
                        <td className="px-4 py-3">
                          <button className="text-sm text-blue-600 hover:text-blue-700 hover:underline transition-colors text-left font-medium">
                            {user.name}
                          </button>
                        </td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">{user.email}</td>
                        <td className="px-4 py-3 text-sm text-muted-foreground tabular-nums">{user.lastActive}</td>
                        <td className="px-4 py-3 text-sm text-muted-foreground tabular-nums">{user.createdAt}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* ページネーション */}
              <div className="flex items-center gap-2 px-4 py-3 border-t border-border">
                <button
                  onClick={() => setPage(p => Math.max(0, p - 1))}
                  disabled={page === 0}
                  className="flex h-7 w-7 items-center justify-center rounded-md border border-input text-muted-foreground hover:bg-accent hover:text-accent-foreground disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
                </button>
                <button
                  onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                  disabled={page >= totalPages - 1}
                  className="flex h-7 w-7 items-center justify-center rounded-md border border-input text-muted-foreground hover:bg-accent hover:text-accent-foreground disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
                </button>
                <Badge variant="outline" className="text-xs font-normal text-muted-foreground">
                  {startRow}-{endRow}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
