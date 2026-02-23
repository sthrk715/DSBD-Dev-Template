/** @deprecated 新DataTableシステム src/components/ui/table/data-table.tsx を使用してください */
'use client'

import { useState, useMemo } from 'react'
import {
  SearchIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  EditIcon,
  TrashIcon,
  MoreHorizontalIcon,
} from '@/components/icons'
import { StatusBadge } from './StatusBadge'
import type { StatusType } from '@/lib/design-tokens'
import { PAGE_SIZE_OPTIONS } from '@/lib/design-tokens'

// ── 型定義 ────────────────────────────────────────────────────────
export type TableColumn<T> = {
  key: keyof T | string
  label: string
  sortable?: boolean
  width?: string
  render?: (row: T) => React.ReactNode
}

export type TableAction<T> = {
  label: string
  icon?: React.ReactNode
  onClick: (row: T) => void
  variant?: 'default' | 'danger'
}

type DataTableProps<T extends { id: string | number }> = {
  columns: TableColumn<T>[]
  data: T[]
  actions?: TableAction<T>[]
  searchable?: boolean
  searchKeys?: (keyof T)[]
  loading?: boolean
  emptyMessage?: string
}

// ── アバター付きセル ──────────────────────────────────────────────
export function AvatarCell({
  name,
  subtitle,
  avatarUrl,
}: {
  name: string
  subtitle?: string
  avatarUrl?: string
}) {
  const initials = name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()
  const colors = ['from-blue-500 to-indigo-500', 'from-teal-500 to-sky-500',
                  'from-purple-500 to-pink-500', 'from-amber-500 to-orange-500']
  const colorIdx = name.charCodeAt(0) % colors.length

  return (
    <div className="flex items-center gap-3">
      {avatarUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={avatarUrl} alt={name} className="w-8 h-8 rounded-full object-cover" />
      ) : (
        <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${colors[colorIdx]} flex items-center justify-center text-white text-xs font-semibold shrink-0`}>
          {initials}
        </div>
      )}
      <div className="min-w-0">
        <p className="text-sm font-medium text-gray-800 truncate">{name}</p>
        {subtitle && <p className="text-xs text-gray-400 truncate">{subtitle}</p>}
      </div>
    </div>
  )
}

// ── ステータスセル ────────────────────────────────────────────────
export function StatusCell({ status }: { status: StatusType }) {
  return <StatusBadge status={status} />
}

// ── スケルトン行 ──────────────────────────────────────────────────
function SkeletonRow({ cols }: { cols: number }) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="table-cell">
          <div className="skeleton h-4 rounded w-3/4" />
        </td>
      ))}
    </tr>
  )
}

// ── ページネーション ──────────────────────────────────────────────
function Pagination({
  total,
  page,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: {
  total: number
  page: number
  pageSize: number
  onPageChange: (p: number) => void
  onPageSizeChange: (s: number) => void
}) {
  const totalPages = Math.ceil(total / pageSize)
  const start = (page - 1) * pageSize + 1
  const end = Math.min(page * pageSize, total)

  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <span>表示:</span>
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          className="border border-gray-200 rounded px-2 py-1 text-xs focus:outline-hidden focus:ring-2 focus:ring-primary-500/30"
        >
          {PAGE_SIZE_OPTIONS.map((s) => (
            <option key={s} value={s}>{s}件</option>
          ))}
        </select>
        <span>{start}–{end} / {total}件</span>
      </div>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="btn-icon disabled:opacity-40"
          aria-label="前のページ"
        >
          <ChevronLeftIcon size={16} />
        </button>
        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
          const p = totalPages <= 5 ? i + 1
            : page <= 3 ? i + 1
            : page >= totalPages - 2 ? totalPages - 4 + i
            : page - 2 + i
          return (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors ${
                p === page
                  ? 'bg-primary-500 text-white'
                  : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              {p}
            </button>
          )
        })}
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="btn-icon disabled:opacity-40"
          aria-label="次のページ"
        >
          <ChevronRightIcon size={16} />
        </button>
      </div>
    </div>
  )
}

// ── メインコンポーネント ──────────────────────────────────────────
export function DataTable<T extends { id: string | number }>({
  columns,
  data,
  actions = [],
  searchable = false,
  searchKeys = [],
  loading = false,
  emptyMessage = 'データがありません',
}: DataTableProps<T>) {
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState<number>(PAGE_SIZE_OPTIONS[0])

  const filtered = useMemo(() => {
    if (!query || searchKeys.length === 0) {return data}
    const q = query.toLowerCase()
    return data.filter((row) =>
      searchKeys.some((k) => String(row[k] ?? '').toLowerCase().includes(q))
    )
  }, [data, query, searchKeys])

  const paginated = useMemo(() => {
    const start = (page - 1) * pageSize
    return filtered.slice(start, start + pageSize)
  }, [filtered, page, pageSize])

  const hasActions = actions.length > 0

  return (
    <div className="bg-white rounded-xl shadow-card border border-gray-100 overflow-hidden">
      {/* 検索バー */}
      {searchable && (
        <div className="p-4 border-b border-gray-100">
          <div className="relative max-w-xs">
            <SearchIcon size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setPage(1) }}
              placeholder="検索..."
              className="input-field pl-9 py-2"
            />
          </div>
        </div>
      )}

      {/* テーブル */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr>
              {columns.map((col) => (
                <th
                  key={String(col.key)}
                  className="table-header-cell"
                  style={col.width ? { width: col.width } : undefined}
                >
                  {col.label}
                </th>
              ))}
              {hasActions && (
                <th className="table-header-cell w-16 text-center">操作</th>
              )}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <SkeletonRow key={i} cols={columns.length + (hasActions ? 1 : 0)} />
              ))
            ) : paginated.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (hasActions ? 1 : 0)}
                  className="py-12 text-center text-sm text-gray-400"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              paginated.map((row) => (
                <tr key={row.id} className="table-row animate-fade-in">
                  {columns.map((col) => (
                    <td key={String(col.key)} className="table-cell">
                      {col.render
                        ? col.render(row)
                        : String(row[col.key as keyof T] ?? '-')}
                    </td>
                  ))}
                  {hasActions && (
                    <td className="table-cell">
                      <div className="flex items-center justify-center gap-1">
                        {actions.map((action) => (
                          <button
                            key={action.label}
                            onClick={() => action.onClick(row)}
                            title={action.label}
                            className={`btn-icon ${action.variant === 'danger' ? 'hover:text-error hover:bg-error-light' : ''}`}
                          >
                            {action.icon ?? <MoreHorizontalIcon size={16} />}
                          </button>
                        ))}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ページネーション */}
      {filtered.length > PAGE_SIZE_OPTIONS[0] && (
        <Pagination
          total={filtered.length}
          page={page}
          pageSize={pageSize}
          onPageChange={setPage}
          onPageSizeChange={(s) => { setPageSize(s); setPage(1) }}
        />
      )}
    </div>
  )
}

// ── アクションアイコンのエクスポート (DataTable使用時のヘルパー) ─
export { EditIcon, TrashIcon }
