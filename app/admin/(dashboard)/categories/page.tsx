"use client";

import * as React from "react";
import Link from "next/link";
import { Plus, Text, ToggleLeft } from "lucide-react";
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
  categoryName: string;
  slug: string;
  active: boolean;
  featured: boolean;
};

const COL_IDS = ["categoryName", "slug", "active", "featured"];

export default function CategoriesAdminPage() {
  const qs = useTableQuery(COL_IDS);
  const utils = trpc.useUtils();
  const { data, isLoading } = trpc.admin.categories.table.useQuery(qs);
  const del = trpc.admin.categories.delete.useMutation({
    onSuccess: () => {
      toast.success("Deleted");
      utils.admin.categories.table.invalidate();
    },
    onError: () => toast.error("Delete failed"),
  });

  const columns = React.useMemo<ColumnDef<Row>[]>(
    () => [
      {
        id: "categoryName",
        accessorKey: "categoryName",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Name" />
        ),
        cell: ({ row }) => (
          <span className="font-medium">{row.original.categoryName}</span>
        ),
        meta: {
          label: "Name",
          placeholder: "Search categories…",
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
            editHref={`/admin/categories/${row.original.id}`}
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
        eyebrow="Catalog"
        title="Categories"
        description="Top-level taxonomy."
        actions={
          <Button asChild>
            <Link href="/admin/categories/new">
              <Plus className="size-4" /> Add category
            </Link>
          </Button>
        }
      />
      {isLoading ? (
        <DataTableSkeleton columnCount={4} rowCount={10} />
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
