"use client";

import * as React from "react";
import Link from "next/link";
import { Plus, Text, ToggleLeft, Tag, Globe } from "lucide-react";
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
  storeName: string;
  slug: string;
  country: string;
  active: boolean;
  featured: boolean;
  categoryId: number;
  subCategoryId: number;
  category?: { id: number; categoryName: string } | null;
  subCategory?: { id: number; subCategoryName: string } | null;
};

const COL_IDS = [
  "storeName",
  "slug",
  "country",
  "categoryId",
  "subCategoryId",
  "active",
  "featured",
];

export default function StoresAdminPage() {
  const qs = useTableQuery(COL_IDS);
  const utils = trpc.useUtils();
  const { data, isLoading } = trpc.admin.stores.table.useQuery(qs);
  const { data: cats = [] } = trpc.admin.categories.list.useQuery();
  const { data: subs = [] } = trpc.admin.subCategories.list.useQuery();

  const del = trpc.admin.stores.delete.useMutation({
    onSuccess: () => {
      toast.success("Deleted");
      utils.admin.stores.table.invalidate();
    },
    onError: () => toast.error("Delete failed"),
  });

  const catOptions = React.useMemo(
    () =>
      cats.map((c: any) => ({ label: c.categoryName, value: String(c.id) })),
    [cats],
  );
  const subOptions = React.useMemo(
    () =>
      subs.map((c: any) => ({ label: c.subCategoryName, value: String(c.id) })),
    [subs],
  );

  const columns = React.useMemo<ColumnDef<Row>[]>(
    () => [
      {
        id: "storeName",
        accessorKey: "storeName",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Name" />
        ),
        cell: ({ row }) => (
          <span className="font-medium">{row.original.storeName}</span>
        ),
        meta: {
          label: "Name",
          placeholder: "Search stores…",
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
        id: "categoryId",
        accessorKey: "categoryId",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Category" />
        ),
        cell: ({ row }) => row.original.category?.categoryName ?? "",
        meta: {
          label: "Category",
          variant: "multiSelect",
          options: catOptions,
          icon: Tag,
        },
        enableColumnFilter: true,
      },
      {
        id: "subCategoryId",
        accessorKey: "subCategoryId",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Sub-category" />
        ),
        cell: ({ row }) => row.original.subCategory?.subCategoryName ?? "",
        meta: {
          label: "Sub-category",
          variant: "multiSelect",
          options: subOptions,
          icon: Tag,
        },
        enableColumnFilter: true,
      },
      {
        id: "country",
        accessorKey: "country",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Country" />
        ),
        cell: ({ row }) => row.original.country,
        meta: { label: "Country", variant: "text", icon: Globe },
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
            editHref={`/admin/stores/${row.original.id}`}
            onDelete={() => del.mutate(row.original.id)}
            deleting={del.isPending}
          />
        ),
        size: 80,
        enableSorting: false,
        enableHiding: false,
      },
    ],
    [catOptions, subOptions, del],
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
        title="Stores"
        description="Retail partners and brands."
        actions={
          <Button asChild>
            <Link href="/admin/stores/new">
              <Plus className="size-4" /> Add store
            </Link>
          </Button>
        }
      />
      {isLoading ? (
        <DataTableSkeleton columnCount={7} rowCount={10} />
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
