export interface SelectOption {
  value: string
  label: string
  description?: string
  disabled?: boolean
  group?: string
  icon?: string
  badge?: string | number
}

export interface FilterSelectProps {
  label: string
  options: SelectOption[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
  showAllOption?: boolean
  disabled?: boolean
  loading?: boolean
  size?: 'sm' | 'md' | 'lg'
  error?: string
}

export interface FilterMultiSelectProps {
  label: string
  options: SelectOption[]
  value: string[]
  onChange: (value: string[]) => void
  placeholder?: string
  maxSelections?: number
  disabled?: boolean
  loading?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export interface DateRangePickerProps {
  label: string
  value: { from: Date; to: Date }
  onChange: (range: { from: Date; to: Date }) => void
  showPresets?: boolean
  minDate?: Date
  maxDate?: Date
  maxRange?: number
  disabled?: boolean
}

export interface PeriodSelectorProps {
  value: 'daily' | 'weekly' | 'monthly'
  onChange: (period: 'daily' | 'weekly' | 'monthly') => void
  disabled?: boolean
}

export interface SearchableSelectProps {
  label: string
  value: string
  onChange: (value: string) => void
  onSearch: (query: string) => Promise<SelectOption[]>
  placeholder?: string
  debounceMs?: number
  minQueryLength?: number
  disabled?: boolean
  emptyMessage?: string
}
