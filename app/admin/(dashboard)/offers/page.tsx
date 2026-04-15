"use client";

import * as React from "react";
import Link from "next/link";
import { Plus, Text, Hash, ToggleLeft, Tag, Store, Ticket } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc/client";
import { toast } from "sonner";
import { PageHeader } from "../_components/FormKit";
import { BoolCell, RowActions } from "../_components/TableKit";
import { useTableQuery } from "../_components/useTableQuery";
import { TableSearch } from "../_components/TableSearch";
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
  offerType: string;
  discountType: string;
  discountValue: number;
  couponCode: string | null;
  country: string;
  storeId: number;
  active: boolean;
  featured: boolean;
  store?: { id: number; storeName: string; slug: string } | null;
};

const COL_IDS = [
  "title",
  "slug",
  "offerType",
  "couponCode",
  "country",
  "storeId",
  "discountValue",
  "active",
  "featured",
];

export default function OffersAdminPage() {
  const qs = useTableQuery(COL_IDS);
  const utils = trpc.useUtils();
  const { data, isFetching } = trpc.admin.offers.table.useQuery(qs, {
    placeholderData: (prev) => prev,
  });
  const { data: storesAll = [] } = trpc.admin.stores.list.useQuery();

  const del = trpc.admin.offers.delete.useMutation({
    onSuccess: () => {
      toast.success("Deleted");
      utils.admin.offers.table.invalidate();
    },
    onError: () => toast.error("Delete failed"),
  });

  const storeOptions = React.useMemo(
    () =>
      storesAll.map((s: any) => ({
        label: s.storeName,
        value: String(s.id),
      })),
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
          <Link
            href={`/admin/offers/${row.original.id}`}
            className="block max-w-[320px] truncate font-medium hover:underline underline-offset-4"
            title={row.original.title}
          >
            {row.original.title}
          </Link>
        ),
        meta: {
          label: "Title",
          placeholder: "Search titles…",
          variant: "text",
          icon: Text,
        },
        size: 320,
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
          icon: Store,
        },
        enableColumnFilter: true,
      },
      {
        id: "offerType",
        accessorKey: "offerType",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Type" />
        ),
        cell: ({ row }) => (
          <Badge
            variant="outline"
            className="font-mono text-[10px] uppercase tracking-wider"
          >
            {row.original.offerType}
          </Badge>
        ),
        meta: {
          label: "Type",
          variant: "multiSelect",
          options: [
            { label: "Deal", value: "deal" },
            { label: "Coupon", value: "coupon" },
          ],
          icon: Tag,
        },
        enableColumnFilter: true,
      },
      {
        id: "couponCode",
        accessorKey: "couponCode",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Code" />
        ),
        cell: ({ row }) =>
          row.original.couponCode ? (
            <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
              {row.original.couponCode}
            </code>
          ) : (
            <span className="text-muted-foreground">—</span>
          ),
        meta: { label: "Code", variant: "text", icon: Ticket },
        enableColumnFilter: true,
      },
      {
        id: "country",
        accessorKey: "country",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Country" />
        ),
        cell: ({ row }) => row.original.country,
        meta: { label: "Country", variant: "text", icon: Text },
        enableColumnFilter: true,
      },
      {
        id: "discountValue",
        accessorKey: "discountValue",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Discount" />
        ),
        cell: ({ row }) => row.original.discountValue,
        meta: { label: "Discount", variant: "number", icon: Hash },
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
            editHref={`/admin/offers/${row.original.id}`}
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
    getRowId: (row) => String(row.id),
    initialState: { pagination: { pageSize: 10, pageIndex: 0 } },
  });

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Catalog"
        title="Offers"
        description="Deals and coupons across every store."
        actions={
          <Button asChild>
            <Link href="/admin/offers/new">
              <Plus className="size-4" /> Add offer
            </Link>
          </Button>
        }
      />
      {!data ? (
        <DataTableSkeleton columnCount={8} rowCount={10} />
      ) : (
        <DataTable table={table}>
          <DataTableAdvancedToolbar table={table}>
            <DataTableFilterList table={table} />
            <DataTableSortList table={table} />
            <TableSearch placeholder="Search title, slug, code, country…" loading={isFetching} />
          </DataTableAdvancedToolbar>
        </DataTable>
      )}
    </div>
  );
}
