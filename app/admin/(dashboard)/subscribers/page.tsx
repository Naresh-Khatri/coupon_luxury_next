"use client";

import * as React from "react";
import { Mail, CalendarIcon } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import { trpc } from "@/lib/trpc/client";
import { toast } from "sonner";
import { PageHeader } from "../_components/FormKit";
import { RowActions } from "../_components/TableKit";
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
  email: string;
  phone: string | null;
  createdAt: string | Date;
};

const COL_IDS = ["email", "phone", "createdAt"];

export default function SubscribersAdminPage() {
  const qs = useTableQuery(COL_IDS);
  const utils = trpc.useUtils();
  const { data, isLoading } = trpc.admin.subscribers.table.useQuery(qs);
  const del = trpc.admin.subscribers.delete.useMutation({
    onSuccess: () => {
      toast.success("Deleted");
      utils.admin.subscribers.table.invalidate();
    },
    onError: () => toast.error("Delete failed"),
  });

  const columns = React.useMemo<ColumnDef<Row>[]>(
    () => [
      {
        id: "email",
        accessorKey: "email",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Email" />
        ),
        cell: ({ row }) => (
          <span className="font-mono text-sm">{row.original.email}</span>
        ),
        meta: {
          label: "Email",
          placeholder: "Search emails…",
          variant: "text",
          icon: Mail,
        },
        enableColumnFilter: true,
      },
      {
        id: "phone",
        accessorKey: "phone",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Phone" />
        ),
        cell: ({ row }) => row.original.phone ?? "—",
        meta: { label: "Phone", variant: "text" },
        enableColumnFilter: true,
      },
      {
        id: "createdAt",
        accessorKey: "createdAt",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Subscribed" />
        ),
        cell: ({ row }) => (
          <span className="tabular-nums text-sm text-muted-foreground">
            {new Date(row.original.createdAt).toLocaleDateString()}
          </span>
        ),
        meta: { label: "Subscribed", variant: "date", icon: CalendarIcon },
        enableColumnFilter: true,
      },
      {
        id: "actions",
        cell: ({ row }) => (
          <RowActions
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
        eyebrow="Audience"
        title="Subscribers"
        description="Newsletter and email list."
      />
      {isLoading ? (
        <DataTableSkeleton columnCount={3} rowCount={10} />
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
