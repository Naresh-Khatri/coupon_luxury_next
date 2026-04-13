"use client";

import { useState } from "react";
import Image from "next/image";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type SortingState,
} from "@tanstack/react-table";
import { ChevronDown, ChevronUp, CheckCircle2, XCircle, Pencil } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Blog = {
  id: string | number;
  coverImg: string;
  title: string;
  featured: boolean;
  active: boolean;
};

export default function BlogsTable({ blogs }: { blogs: Blog[] }) {
  const columnHelper = createColumnHelper<Blog>();
  const columns = [
    columnHelper.accessor("id", { header: "ID", cell: (i) => i.getValue() }),
    columnHelper.accessor("coverImg", { header: "Image", cell: (i) => i.getValue() }),
    columnHelper.accessor("title", { header: "Title", cell: (i) => i.getValue() }),
    columnHelper.accessor("featured", { header: "Featured", cell: (i) => i.getValue() }),
    columnHelper.accessor("active", { header: "Active", cell: (i) => i.getValue() }),
    columnHelper.display({ id: "actions", header: "Actions" }),
  ];

  const [sorting, setSorting] = useState<SortingState>([]);
  const table = useReactTable({
    columns,
    data: blogs,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: { sorting },
  });

  return (
    <Table>
      <TableHeader>
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <TableHead
                key={header.id}
                onClick={header.column.getToggleSortingHandler()}
                className="cursor-pointer select-none"
              >
                <div className="flex items-center gap-2">
                  {flexRender(header.column.columnDef.header, header.getContext())}
                  {header.column.getIsSorted() === "desc" ? (
                    <ChevronDown className="size-3" aria-label="sorted descending" />
                  ) : header.column.getIsSorted() === "asc" ? (
                    <ChevronUp className="size-3" aria-label="sorted ascending" />
                  ) : null}
                </div>
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows.length === 0 ? (
          <TableRow>
            <TableCell colSpan={columns.length}>No data</TableCell>
          </TableRow>
        ) : (
          table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.original.id}</TableCell>
              <TableCell className="p-0">
                <Image
                  src={row.original.coverImg}
                  alt="blog cover image"
                  height={90}
                  width={160}
                  className="min-w-[100px] rounded-xl"
                />
              </TableCell>
              <TableCell className="max-w-xs">{row.original.title}</TableCell>
              <TableCell className="max-w-[10px]">
                {row.original.featured ? (
                  <CheckCircle2 className="size-6 text-green-500" />
                ) : (
                  <XCircle className="size-6 text-red-500" />
                )}
              </TableCell>
              <TableCell className="max-w-[10px]">
                {row.original.active ? (
                  <CheckCircle2 className="size-6 text-green-500" />
                ) : (
                  <XCircle className="size-6 text-red-500" />
                )}
              </TableCell>
              <TableCell>
                <button
                  type="button"
                  disabled
                  className="inline-flex size-9 items-center justify-center rounded-md bg-blue-600 text-white disabled:opacity-50"
                >
                  <Pencil className="size-4" />
                </button>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
