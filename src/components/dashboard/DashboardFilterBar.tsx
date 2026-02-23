'use client'

import { FilterBar } from '@/components/organisms/filter-bar'
import { EC_CHANNELS } from '@/lib/design-tokens'

const CHANNEL_OPTIONS = [
  { value: '', label: 'すべて' },
  ...EC_CHANNELS.map((ch) => ({ value: ch.key, label: ch.label })),
]

export function DashboardFilterBar() {
  return <FilterBar channelOptions={CHANNEL_OPTIONS} />
}
