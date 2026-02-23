'use client'

import { useRef, useEffect, useMemo } from 'react'
import type { EChartsOption } from 'echarts'
import * as echarts from 'echarts/core'
import { LineChart, BarChart, PieChart, HeatmapChart, GaugeChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  DataZoomComponent,
  MarkLineComponent,
  MarkAreaComponent,
  VisualMapComponent,
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'

// 必要なコンポーネントのみ登録
echarts.use([
  LineChart, BarChart, PieChart, HeatmapChart, GaugeChart,
  TitleComponent, TooltipComponent, LegendComponent, GridComponent,
  DataZoomComponent, MarkLineComponent, MarkAreaComponent, VisualMapComponent,
  CanvasRenderer,
])

type EChartWrapperProps = {
  option: EChartsOption
  height?: number | string
  loading?: boolean
  className?: string
  /** sr-only テキスト（アクセシビリティ） */
  srDescription?: string
  onEvents?: Record<string, (params: unknown) => void>
}

export function EChartWrapper({
  option,
  height = 280,
  loading = false,
  className,
  srDescription,
  onEvents,
}: EChartWrapperProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<ReturnType<typeof echarts.init> | null>(null)

  // オプションをメモ化
  const memoOption = useMemo(() => option, [JSON.stringify(option)])

  useEffect(() => {
    if (!containerRef.current) {
      return
    }

    // チャート初期化
    if (!chartRef.current) {
      chartRef.current = echarts.init(containerRef.current)
    }

    const chart = chartRef.current
    chart.setOption(memoOption, true)

    // ローディング表示
    if (loading) {
      chart.showLoading('default', {
        text: '',
        color: '#6b7280',
        maskColor: 'rgba(255, 255, 255, 0.8)',
      })
    } else {
      chart.hideLoading()
    }

    // イベントハンドラ登録
    if (onEvents) {
      for (const [eventName, handler] of Object.entries(onEvents)) {
        chart.on(eventName, handler as () => void)
      }
    }

    return () => {
      if (onEvents && chartRef.current) {
        for (const eventName of Object.keys(onEvents)) {
          chartRef.current.off(eventName)
        }
      }
    }
  }, [memoOption, loading, onEvents])

  // リサイズ対応
  useEffect(() => {
    const handleResize = () => chartRef.current?.resize()
    window.addEventListener('resize', handleResize)

    const observer = new ResizeObserver(() => chartRef.current?.resize())
    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => {
      window.removeEventListener('resize', handleResize)
      observer.disconnect()
      chartRef.current?.dispose()
      chartRef.current = null
    }
  }, [])

  return (
    <div className={className} style={{ position: 'relative' }}>
      <div
        ref={containerRef}
        style={{ width: '100%', height: typeof height === 'number' ? `${height}px` : height }}
      />
      {srDescription && (
        <span className="sr-only">{srDescription}</span>
      )}
    </div>
  )
}

export { echarts }
export type { EChartsOption }
