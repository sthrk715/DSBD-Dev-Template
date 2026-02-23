'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { DashboardErrorState } from '@/components/dashboard/DashboardErrorState'

type ChartContainerProps = {
  title: string
  description?: string
  isLoading?: boolean
  isError?: boolean
  onRetry?: () => void
  className?: string
  noPadding?: boolean
  children: React.ReactNode
}

export function ChartContainer({
  title,
  description,
  isLoading,
  isError,
  onRetry,
  className,
  noPadding,
  children,
}: ChartContainerProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-sm font-semibold">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className={noPadding ? 'p-0' : undefined}>
        {isLoading ? (
          <Skeleton className="h-[280px] w-full rounded-md" />
        ) : isError ? (
          <DashboardErrorState onRetry={onRetry} />
        ) : (
          children
        )}
      </CardContent>
    </Card>
  )
}
