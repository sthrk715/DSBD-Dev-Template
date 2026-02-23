import { Suspense } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { DashboardFilterBar } from "@/components/dashboard/DashboardFilterBar"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="px-4 pt-4 lg:px-6">
              <Suspense fallback={<div className="h-10" />}>
                <DashboardFilterBar />
              </Suspense>
            </div>
            {children}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
