"use client";

import * as React from "react";
import Link from "next/link";
import { Plus, Text, ToggleLeft, Store as StoreIcon } from "lucide-react";
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
  slug: string;
  blogType: string | null;
  storeId: number | null;
  active: boolean;
  featured: boolean;
  store?: { id: number; storeName: string } | null;
};

const COL_IDS = [
  "title",
  "slug",
  "blogType",
  "storeId",
  "active",
  "featured",
];

export default function BlogsAdminPage() {
  const qs = useTableQuery(COL_IDS);
  const utils = trpc.useUtils();
  const { data, isLoading } = trpc.admin.blogs.table.useQuery(qs);
  const { data: storesAll = [] } = trpc.admin.stores.list.useQuery();

  const del = trpc.admin.blogs.delete.useMutation({
    onSuccess: () => {
      toast.success("Deleted");
      utils.admin.blogs.table.invalidate();
    },
    onError: () => toast.error("Delete failed"),
  });

  const storeOptions = React.useMemo(
    () =>
      storesAll.map((s: any) => ({ label: s.storeName, value: String(s.id) })),
    [storesAll],
  );

  const columns = React.useMemo<ColumnDef<Row>[]>(
    () => [
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
          placeholder: "Search posts…",
          variant: "text",
          icon: Text,
        },
        enableColumnFilter: true,
      },
      {
        id: "slug",
        accessorKey: "slug",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Slug" />
        ),
        cell: ({ row }) => (
          <span className="font-mono text-xs text-muted-foreground">
            {row.original.slug}
          </span>
        ),
        meta: { label: "Slug", variant: "text", icon: Text },
        enableColumnFilter: true,
      },
      {
        id: "storeId",
        accessorKey: "storeId",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Store" />
        ),
        cell: ({ row }) => row.original.store?.storeName ?? "—",
        meta: {
          label: "Store",
          variant: "multiSelect",
          options: storeOptions,
          icon: StoreIcon,
        },
        enableColumnFilter: true,
      },
      {
        id: "blogType",
        accessorKey: "blogType",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Type" />
        ),
        cell: ({ row }) => row.original.blogType ?? "—",
        meta: { label: "Type", variant: "text", icon: Text },
        enableColumnFilter: true,
      },
      {
        id: "active",
        accessorKey: "active",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Status" />
        ),
        cell: ({ row }) => (
          <BoolCell
            value={row.original.active}
            label={{ on: "Published", off: "Draft" }}
          />
        ),
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
            editHref={`/admin/blogs/${row.original.id}`}
            onDelete={() => del.mutate(row.original.id)}
            deleting={del.isPending}
          />
        ),
        size: 80,
        enableSorting: false,
        enableHiding: false,
      },
    ],
    [storeOptions, del],
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
        title="Blogs"
        description="Editorial posts and store guides."
        actions={
          <Button asChild>
            <Link href="/admin/blogs/new">
              <Plus className="size-4" /> New post
            </Link>
          </Button>
        }
      />
      {isLoading ? (
        <DataTableSkeleton columnCount={6} rowCount={10} />
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
