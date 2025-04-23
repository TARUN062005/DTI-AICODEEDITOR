"use client"

import { type FC, type ReactNode, useCallback, useState } from "react"
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "@/components/ui/use-toast"
import { MoreHorizontal } from "lucide-react"
import { Icons } from "@/components/icons"

export type File = {
  id: string
  name: string
  type: "file" | "folder"
  size: string
  lastModified: string
}

interface DataTableProps {
  columns: ColumnDef<File>[]
  data: File[]
}

const ContextMenuItem = ({
  children,
  onClick,
}: {
  children: ReactNode
  onClick?: () => void
}) => {
  return (
    <DropdownMenuItem onClick={onClick} className="cursor-pointer">
      {children}
    </DropdownMenuItem>
  )
}

const FileExplorer: FC<DataTableProps> = ({ columns, data }) => {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<string>("")

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
  })

  const handleDownload = useCallback((item: File) => {
    toast({
      title: "Download",
      description: `Downloading ${item.name}`,
    })
  }, [])

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter names..."
          value={columnFilters}
          onChange={(e) => setColumnFilters(e.target.value)}
          className="ml-auto w-1/4"
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                ))}
                <TableCell className="w-[80px]">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <ContextMenuItem
                        onClick={() => {
                          toast({
                            title: "Download",
                            description: `Downloading ${row.original.name}`,
                          })
                        }}
                      >
                        <Icons.download className="mr-2 h-4 w-4" />
                        Download
                      </ContextMenuItem>
                      <ContextMenuItem
                        onClick={() => {
                          toast({
                            title: "Preview",
                            description: `Preview functionality for ${row.original.name}`,
                          })
                        }}
                      >
                        <Icons.fileCode className="mr-2 h-4 w-4" />
                        Preview
                      </ContextMenuItem>
                      <DropdownMenuSeparator />
                      <ContextMenuItem
                        onClick={() => {
                          toast({
                            title: "Delete",
                            description: `Deleting ${row.original.name}`,
                          })
                        }}
                      >
                        <Icons.trash className="mr-2 h-4 w-4" />
                        Delete
                      </ContextMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export default FileExplorer
