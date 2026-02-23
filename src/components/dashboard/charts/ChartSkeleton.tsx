import { cn } from '@/lib/utils'

type ChartSkeletonProps = {
  variant?: 'line' | 'bar' | 'pie' | 'area' | 'radar'
  height?: number
  className?: string
}

function BarSkeleton() {
  return (
    <div className="flex h-full items-end gap-2 px-8 pb-8 pt-4">
      {[40, 65, 50, 80, 55, 70, 45, 75].map((h, i) => (
        <div
          key={i}
          className="flex-1 animate-pulse rounded-t-sm bg-muted"
          style={{ height: `${h}%` }}
        />
      ))}
    </div>
  )
}

function LineSkeleton() {
  return (
    <div className="flex h-full flex-col justify-center px-8">
      <svg viewBox="0 0 400 120" className="w-full text-muted">
        <path
          d="M0,80 C50,60 100,90 150,50 C200,10 250,70 300,40 C350,10 400,60 400,30"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          className="animate-pulse"
        />
      </svg>
    </div>
  )
}

function PieSkeleton() {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="h-36 w-36 animate-pulse rounded-full border-[24px] border-muted bg-card" />
    </div>
  )
}

function RadarSkeleton() {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="h-36 w-36 animate-pulse rounded-full bg-muted/50" />
    </div>
  )
}

const variants = {
  line: LineSkeleton,
  area: LineSkeleton,
  bar: BarSkeleton,
  pie: PieSkeleton,
  radar: RadarSkeleton,
}

export function ChartSkeleton({
  variant = 'bar',
  height = 280,
  className,
}: ChartSkeletonProps) {
  const Variant = variants[variant]
  return (
    <div
      className={cn('w-full rounded-lg border bg-card', className)}
      style={{ height }}
    >
      <Variant />
    </div>
  )
}
