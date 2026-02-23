'use client'

import { AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

type DashboardErrorStateProps = {
  message?: string
  onRetry?: () => void
}

export function DashboardErrorState({
  message = 'データの取得に失敗しました',
  onRetry,
}: DashboardErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <AlertCircle className="h-10 w-10 text-muted-foreground mb-3" />
      <p className="text-sm text-muted-foreground mb-4">{message}</p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          再試行
        </Button>
      )}
    </div>
  )
}
