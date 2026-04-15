"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Text, Hash, ToggleLeft } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc/client";
import { toast } from "sonner";
import { PageHeader } from "../_components/FormKit";
import { BoolCell, RowActions } from "../_components/TableKit";
import { useTableQuery } from "../_components/useTableQuery";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableAdvancedToolbar } from "@/components/data-table/data-table-advanced-toolbar";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { DataTableFilterList } from "@/components/data-table/data-table-filter-list";
import { DataTableSortList } from "@/components/data-table/data-table-sort-list";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { useDataTable } from "@/hooks/use-data-table";

type Row = {
  id: number;
  title: string;
  order: number;
  imgURL: string;
  imgAlt: string;
  active: boolean;
  featured: boolean;
};

const COL_IDS = ["title", "order", "active", "featured"];

export default function SlidesAdminPage() {
  const qs = useTableQuery(COL_IDS);
  const utils = trpc.useUtils();
  const { data, isLoading } = trpc.admin.slides.table.useQuery(qs);
  const del = trpc.admin.slides.delete.useMutation({
    onSuccess: () => {
      toast.success("Deleted");
      utils.admin.slides.table.invalidate();
    },
    onError: () => toast.error("Delete failed"),
  });

  const columns = React.useMemo<ColumnDef<Row>[]>(
    () => [
      {
        id: "image",
        accessorKey: "imgURL",
        header: "Image",
        cell: ({ row }) => (
          <Image
            src={row.original.imgURL}
            alt={row.original.imgAlt}
            width={80}
            height={40}
            className="rounded border border-border/60"
          />
        ),
        enableSorting: false,
      },
      {
        id: "title",
        accessorKey: "title",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Title" />
        ),
        cell: ({ row }) => (
          <span className="font-medium">{row.original.title}</span>
        ),
        meta: {
          label: "Title",
          placeholder: "Search slides…",
          variant: "text",
          icon: Text,
        },
        enableColumnFilter: true,
      },
      {
        id: "order",
        accessorKey: "order",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Order" />
        ),
        cell: ({ row }) => (
          <span className="font-mono tabular-nums text-sm">
            {row.original.order}
          </span>
        ),
        meta: { label: "Order", variant: "number", icon: Hash },
        enableColumnFilter: true,
      },
      {
        id: "active",
        accessorKey: "active",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Status" />
        ),
        cell: ({ row }) => <BoolCell value={row.original.active} />,
        meta: { label: "Status", variant: "boolean", icon: ToggleLeft },
        enableColumnFilter: true,
      },
      {
        id: "featured",
        accessorKey: "featured",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Featured" />
        ),
        cell: ({ row }) => (
          <BoolCell
            value={row.original.featured}
            label={{ on: "Featured", off: "Normal" }}
          />
        ),
        meta: { label: "Featured", variant: "boolean", icon: ToggleLeft },
        enableColumnFilter: true,
      },
      {
        id: "actions",
        cell: ({ row }) => (
          <RowActions
            editHref={`/admin/slides/${row.original.id}`}
            onDelete={() => del.mutate(row.original.id)}
            deleting={del.isPending}
          />
        ),
        size: 80,
        enableSorting: false,
        enableHiding: false,
      },
    ],
    [del],
  );

  const { table } = useDataTable<Row>({
    data: (data?.rows ?? []) as Row[],
    columns,
    pageCount: data?.pageCount ?? 0,
    enableAdvancedFilter: true,
    getRowId: (r) => String(r.id),
    initialState: { pagination: { pageSize: 10, pageIndex: 0 } },
  });

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Content"
        title="Slides"
        description="Homepage hero carousel."
        actions={
          <Button asChild>
            <Link href="/admin/slides/new">
              <Plus className="size-4" /> Add slide
            </Link>
          </Button>
        }
      />
      {isLoading ? (
        <DataTableSkeleton columnCount={5} rowCount={10} />
      ) : (
        <DataTable table={table}>
          <DataTableAdvancedToolbar table={table}>
            <DataTableFilterList table={table} />
            <DataTableSortList table={table} />
          </DataTableAdvancedToolbar>
        </DataTable>
      )}
    </div>
  );
}
