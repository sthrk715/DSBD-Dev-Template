'use client'

import * as React from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

// ── 型定義 ──────────────────────────────────────────────────────

export interface CohortRow {
  cohort: string
  values: number[]
}

export interface CohortChartProps {
  data: CohortRow[]
  headers: string[]
  title?: string
  description?: string
  colorScale?: { min: string; max: string }
  formatValue?: (value: number) => string
  className?: string
}

// ── ユーティリティ ──────────────────────────────────────────────

const defaultFormat = (value: number): string =>
  `${(value * 100).toFixed(1)}%`

function getMinMax(data: CohortRow[]): { min: number; max: number } {
  let min = Infinity
  let max = -Infinity
  for (const row of data) {
    for (const v of row.values) {
      if (v < min) { min = v }
      if (v > max) { max = v }
    }
  }
  if (min === Infinity) { return { min: 0, max: 0 } }
  return { min, max }
}

function valueToOpacity(
  value: number,
  min: number,
  max: number
): number {
  if (max === min) { return 0.5 }
  return 0.08 + 0.82 * ((value - min) / (max - min))
}

// ── セルコンポーネント ──────────────────────────────────────────

interface CohortCellProps {
  cohort: string
  header: string
  value: number
  opacity: number
  bgColor: string
  formatValue: (v: number) => string
}

function CohortCell({
  cohort,
  header,
  value,
  opacity,
  bgColor,
  formatValue,
}: CohortCellProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <TableCell
          className="text-center tabular-nums text-xs font-medium p-0"
        >
          <div
            className="flex h-9 items-center justify-center transition-opacity"
            style={{
              backgroundColor: bgColor,
              opacity,
            }}
          >
            <span className="text-foreground mix-blend-normal">
              {formatValue(value)}
            </span>
          </div>
        </TableCell>
      </TooltipTrigger>
      <TooltipContent side="top" className="text-xs">
        <div className="grid gap-0.5">
          <span className="font-medium">{cohort}</span>
          <span className="text-muted-foreground">{header}</span>
          <span className="font-mono font-semibold">
            {formatValue(value)}
          </span>
        </div>
      </TooltipContent>
    </Tooltip>
  )
}

// ── メインコンポーネント ────────────────────────────────────────

export function CohortChart({
  data,
  headers,
  title,
  description,
  colorScale,
  formatValue = defaultFormat,
  className,
}: CohortChartProps) {
  const { min, max } = React.useMemo(() => getMinMax(data), [data])

  const bgColor = colorScale?.max ?? 'var(--chart-1)'

  return (
    <Card className={cn(className)}>
      {(title || description) && (
        <CardHeader>
          {title && <CardTitle>{title}</CardTitle>}
          {description && (
            <CardDescription>{description}</CardDescription>
          )}
        </CardHeader>
      )}
      <CardContent className="overflow-x-auto p-0 px-6 pb-6">
        <TooltipProvider delayDuration={100}>
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="sticky left-0 z-10 bg-card min-w-[120px]">
                  コホート
                </TableHead>
                {headers.map((h) => (
                  <TableHead
                    key={h}
                    className="text-center text-xs min-w-[72px]"
                  >
                    {h}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((row) => (
                <TableRow
                  key={row.cohort}
                  className="hover:bg-transparent border-0"
                >
                  <TableCell className="sticky left-0 z-10 bg-card text-xs font-medium whitespace-nowrap">
                    {row.cohort}
                  </TableCell>
                  {headers.map((header, colIdx) => {
                    const value = row.values[colIdx]
                    if (value === undefined) {
                      return (
                        <TableCell
                          key={header}
                          className="p-0"
                        >
                          <div className="h-9" />
                        </TableCell>
                      )
                    }
                    return (
                      <CohortCell
                        key={header}
                        cohort={row.cohort}
                        header={header}
                        value={value}
                        opacity={valueToOpacity(value, min, max)}
                        bgColor={bgColor}
                        formatValue={formatValue}
                      />
                    )
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TooltipProvider>

        {/* 凡例 */}
        <div className="mt-3 flex items-center justify-end gap-2 text-xs text-muted-foreground">
          <span>{formatValue(min)}</span>
          <div className="flex h-3 w-24 rounded-sm overflow-hidden">
            {Array.from({ length: 10 }, (_, i) => (
              <div
                key={i}
                className="flex-1"
                style={{
                  backgroundColor: bgColor,
                  opacity: valueToOpacity(
                    min + ((max - min) * i) / 9,
                    min,
                    max
                  ),
                }}
              />
            ))}
          </div>
          <span>{formatValue(max)}</span>
        </div>
      </CardContent>
    </Card>
  )
}
