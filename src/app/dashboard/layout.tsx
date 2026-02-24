import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { DashboardFilterBar } from "@/components/dashboard/DashboardFilterBar"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <div className="sticky top-0 z-30 bg-background">
          <SiteHeader />
          <div className="border-b px-4 pb-3 pt-3 lg:px-6">
            <DashboardFilterBar />
          </div>
        </div>
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            {children}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
