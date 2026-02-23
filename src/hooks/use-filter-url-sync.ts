'use client'

import { useEffect, useRef } from 'react'
import {
  useQueryState,
  parseAsString,
  parseAsArrayOf,
  parseAsStringLiteral,
} from 'nuqs'
import { useFilterStore } from '@/stores/filter-store'

const periodOptions = ['daily', 'weekly', 'monthly'] as const

export function useFilterUrlSync() {
  const store = useFilterStore()
  const isInitialized = useRef(false)

  const [urlFrom, setUrlFrom] = useQueryState(
    'from',
    parseAsString.withDefault('')
  )
  const [urlTo, setUrlTo] = useQueryState(
    'to',
    parseAsString.withDefault('')
  )
  const [urlPreset, setUrlPreset] = useQueryState(
    'preset',
    parseAsString.withDefault('last30d')
  )
  const [urlChannel, setUrlChannel] = useQueryState(
    'channel',
    parseAsString.withDefault('')
  )
  const [urlCategory, setUrlCategory] = useQueryState(
    'category',
    parseAsString.withDefault('')
  )
  const [urlRegions, setUrlRegions] = useQueryState(
    'regions',
    parseAsArrayOf(parseAsString, ',').withDefault([])
  )
  const [urlPeriod, setUrlPeriod] = useQueryState(
    'period',
    parseAsStringLiteral(periodOptions).withDefault('daily')
  )

  // URL → Store (初回のみ)
  useEffect(() => {
    if (isInitialized.current) {
      return
    }
    isInitialized.current = true

    if (urlFrom && urlTo) {
      const from = new Date(urlFrom)
      const to = new Date(urlTo)
      if (!isNaN(from.getTime()) && !isNaN(to.getTime())) {
        store.setDateRange({ from, to })
      }
    }
    if (urlPreset) {
      store.setPreset(urlPreset)
    }
    if (urlChannel) {
      store.setChannel(urlChannel)
    }
    if (urlCategory) {
      store.setCategoryL1(urlCategory)
    }
    if (urlRegions.length > 0) {
      store.setRegions(urlRegions)
    }
    if (urlPeriod) {
      store.setPeriod(urlPeriod)
    }
  }, []) // init once on mount

  // Store → URL
  useEffect(() => {
    if (!isInitialized.current) {
      return
    }
    const fromStr = store.dateRange.from.toISOString().slice(0, 10)
    const toStr = store.dateRange.to.toISOString().slice(0, 10)

    void setUrlFrom(fromStr || null)
    void setUrlTo(toStr || null)
    void setUrlPreset(store.preset || null)
    void setUrlChannel(store.channel || null)
    void setUrlCategory(store.categoryL1 || null)
    void setUrlRegions(store.regions.length > 0 ? store.regions : null)
    void setUrlPeriod(store.period)
  }, [
    store.dateRange,
    store.preset,
    store.channel,
    store.categoryL1,
    store.regions,
    store.period,
    setUrlFrom,
    setUrlTo,
    setUrlPreset,
    setUrlChannel,
    setUrlCategory,
    setUrlRegions,
    setUrlPeriod,
  ])

  return store
}
