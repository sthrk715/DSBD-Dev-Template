'use client'

import { useEffect, useRef } from 'react'
import {
  useQueryState,
  parseAsString,
  parseAsStringLiteral,
} from 'nuqs'
import { useFilterStore } from '@/stores/filter-store'

const periodOptions = ['daily', 'weekly', 'monthly'] as const
const compareModeOptions = ['calendar', 'same_dow'] as const

export function useFilterUrlSync() {
  const store = useFilterStore()
  const isInitialized = useRef(false)

  const [urlFrom, setUrlFrom] = useQueryState('from', parseAsString.withDefault(''))
  const [urlTo, setUrlTo] = useQueryState('to', parseAsString.withDefault(''))
  const [urlPreset, setUrlPreset] = useQueryState('preset', parseAsString.withDefault('last30d'))
  const [urlChannel, setUrlChannel] = useQueryState('channel', parseAsString.withDefault(''))
  const [urlPeriod, setUrlPeriod] = useQueryState('period', parseAsStringLiteral(periodOptions).withDefault('daily'))
  const [urlCompareMode, setUrlCompareMode] = useQueryState('compareMode', parseAsStringLiteral(compareModeOptions).withDefault('calendar'))
  const [urlGiftSeason, setUrlGiftSeason] = useQueryState('giftSeason', parseAsString.withDefault(''))

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
    if (urlPreset) { store.setPreset(urlPreset) }
    if (urlChannel) { store.setChannel(urlChannel) }
    if (urlPeriod) { store.setPeriod(urlPeriod) }
    if (urlCompareMode) { store.setCompareMode(urlCompareMode) }
    if (urlGiftSeason) { store.setGiftSeason(urlGiftSeason) }
  }, []) // init once

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
    void setUrlPeriod(store.period)
    void setUrlCompareMode(store.compareMode)
    void setUrlGiftSeason(store.giftSeason || null)
  }, [
    store.dateRange,
    store.preset,
    store.channel,
    store.period,
    store.compareMode,
    store.giftSeason,
    setUrlFrom,
    setUrlTo,
    setUrlPreset,
    setUrlChannel,
    setUrlPeriod,
    setUrlCompareMode,
    setUrlGiftSeason,
  ])

  return store
}
