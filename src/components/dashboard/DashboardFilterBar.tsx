'use client'

import dynamic from 'next/dynamic'
import { FilterBar } from '@/components/organisms/filter-bar'
import { EC_CHANNELS } from '@/lib/design-tokens'

const CHANNEL_OPTIONS = [
  ...EC_CHANNELS.map((ch) => ({ value: ch.key, label: ch.label })),
]

function DashboardFilterBarInner() {
  return <FilterBar channelOptions={CHANNEL_OPTIONS} />
}

export const DashboardFilterBar = dynamic(() => Promise.resolve(DashboardFilterBarInner), {
  ssr: false,
  loading: () => <div className="h-10" />,
})
