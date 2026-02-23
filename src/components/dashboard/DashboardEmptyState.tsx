import { InboxIcon } from 'lucide-react'

type DashboardEmptyStateProps = {
  message?: string
}

export function DashboardEmptyState({
  message = 'データがありません',
}: DashboardEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <InboxIcon className="h-10 w-10 text-muted-foreground mb-3" />
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  )
}
