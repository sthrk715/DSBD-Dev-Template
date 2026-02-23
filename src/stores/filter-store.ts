import { create } from 'zustand'

export interface FilterState {
  dateRange: { from: Date; to: Date }
  preset: string
  channel: string
  categoryL1: string
  regions: string[]
  period: 'daily' | 'weekly' | 'monthly'
}

interface FilterActions {
  setDateRange: (range: { from: Date; to: Date }) => void
  setPreset: (preset: string) => void
  setChannel: (channel: string) => void
  setCategoryL1: (category: string) => void
  setRegions: (regions: string[]) => void
  setPeriod: (period: 'daily' | 'weekly' | 'monthly') => void
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
  categoryL1: '',
  regions: [],
  period: 'daily',
}

export const useFilterStore = create<FilterState & FilterActions>((set) => ({
  ...initialState,

  setDateRange: (range) => {
    set({ dateRange: range })
  },

  setPreset: (preset) => {
    set({ preset })
  },

  setChannel: (channel) => {
    set({ channel })
  },

  setCategoryL1: (category) => {
    set({ categoryL1: category })
  },

  setRegions: (regions) => {
    set({ regions })
  },

  setPeriod: (period) => {
    set({ period })
  },

  reset: () => {
    set(initialState)
  },
}))
