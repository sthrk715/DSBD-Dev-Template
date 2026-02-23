'use client'

import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
} from '@tanstack/react-table'
import { useState } from 'react'
import { DataTable } from '@/components/ui/table/data-table'
import { DataTableToolbar } from '@/components/ui/table/data-table-toolbar'
import { columns, type DashboardRow } from './columns'

interface DashboardDataTableProps {
  data: DashboardRow[]
}

export function DashboardDataTable({ data }: DashboardDataTableProps) {
  const [sorting, setSorting] = useState<SortingState>([])

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  return (
    <div className="h-[500px]">
      <DataTable table={table}>
        <DataTableToolbar table={table} />
      </DataTable>
    </div>
  )
}
