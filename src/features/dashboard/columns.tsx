'use client'

import type { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header'

export interface DashboardRow {
  id: number
  orderId: string
  orderDate: string
  customerName: string
  category: string
  amount: number
  status: string
}

const statusVariant = (
  status: string
): 'default' | 'secondary' | 'outline' | 'destructive' => {
  switch (status) {
    case '出荷済':
      return 'default'
    case '処理中':
      return 'secondary'
    case 'キャンセル':
      return 'destructive'
    default:
      return 'outline'
  }
}

export const columns: ColumnDef<DashboardRow>[] = [
  {
    accessorKey: 'orderId',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="注文ID" />
    ),
    meta: {
      label: '注文ID',
    },
  },
  {
    accessorKey: 'orderDate',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="注文日" />
    ),
    meta: {
      label: '注文日',
    },
  },
  {
    accessorKey: 'customerName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="顧客名" />
    ),
    meta: {
      label: '顧客名',
    },
  },
  {
    accessorKey: 'category',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="カテゴリ" />
    ),
    meta: {
      label: 'カテゴリ',
      variant: 'select' as const,
    },
  },
  {
    accessorKey: 'amount',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="金額" />
    ),
    cell: ({ row }) => {
      const amount = row.getValue<number>('amount')
      return (
        <span className="tabular-nums">
          ¥{amount.toLocaleString()}
        </span>
      )
    },
    meta: {
      label: '金額',
    },
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ステータス" />
    ),
    cell: ({ row }) => {
      const status = row.getValue<string>('status')
      return <Badge variant={statusVariant(status)}>{status}</Badge>
    },
    meta: {
      label: 'ステータス',
      variant: 'select' as const,
    },
  },
]
