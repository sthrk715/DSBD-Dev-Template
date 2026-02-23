import { create } from 'zustand'

export interface FilterState {
  dateRange: { from: Date; to: Date }
  preset: string
  channel: string
  period: 'daily' | 'weekly' | 'monthly'
  compareMode: 'calendar' | 'same_dow'
  giftSeason: string
}

interface FilterActions {
  setDateRange: (range: { from: Date; to: Date }) => void
  setPreset: (preset: string) => void
  setChannel: (channel: string) => void
  setPeriod: (period: 'daily' | 'weekly' | 'monthly') => void
  setCompareMode: (mode: 'calendar' | 'same_dow') => void
  setGiftSeason: (season: string) => void
  reset: () => void
}

function getDefaultDateRange(): { from: Date; to: Date } {
  const to = new Date()
  to.setHours(0, 0, 0, 0)
  const from = new Date(to.getTime() - 30 * 86400000)
  return { from, to }
}

const initialState: FilterState = {
  dateRange: getDefaultDateRange(),
  preset: 'last30d',
  channel: '',
  period: 'daily',
  compareMode: 'calendar',
  giftSeason: '',
}

export const useFilterStore = create<FilterState & FilterActions>((set) => ({
  ...initialState,
  setDateRange: (range) => { set({ dateRange: range }) },
  setPreset: (preset) => { set({ preset }) },
  setChannel: (channel) => { set({ channel }) },
  setPeriod: (period) => { set({ period }) },
  setCompareMode: (mode) => { set({ compareMode: mode }) },
  setGiftSeason: (season) => { set({ giftSeason: season }) },
  reset: () => { set(initialState) },
}))
