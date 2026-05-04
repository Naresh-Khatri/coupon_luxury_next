"use client";

import * as React from "react";
import Link from "next/link";
import { useQueryState } from "nuqs";
import { Check, Plus, PlusCircle, Text, Hash, ToggleLeft, Tag, Store, Ticket, ShieldCheck, XCircle } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { generateId } from "@/lib/id";
import { getFiltersStateParser } from "@/lib/parsers";
import type { ExtendedColumnFilter } from "@/types/data-table";
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
  storeId: number;
  active: boolean;
  featured: boolean;
  trending: boolean;
  verifiedAt: string | Date | null;
  store?: { id: number; storeName: string; slug: string } | null;
};

const COL_IDS = [
  "title",
  "slug",
  "offerType",
  "couponCode",
  "storeId",
  "discountValue",
  "active",
  "featured",
  "trending",
];

type StoreOption = { label: string; value: string };

function StoreFilter({ options }: { options: StoreOption[] }) {
  const [filters, setFilters] = useQueryState(
    "filters",
    getFiltersStateParser<Row>(COL_IDS)
      .withDefault([])
      .withOptions({ clearOnDefault: true, shallow: true }),
  );
  const [, setPage] = useQueryState("page");
  const [open, setOpen] = React.useState(false);

  const current = filters.find((f) => f.id === "storeId");
  const selected = React.useMemo(() => {
    const v = current?.value;
    return new Set(Array.isArray(v) ? v : v ? [v] : []);
  }, [current]);

  const apply = (next: Set<string>) => {
    const others = filters.filter((f) => f.id !== "storeId");
    const arr = Array.from(next);
    const updated: ExtendedColumnFilter<Row>[] = arr.length
      ? [
          ...others,
          {
            id: "storeId",
            value: arr,
            variant: "multiSelect",
            operator: "inArray",
            filterId: current?.filterId ?? generateId({ length: 8 }),
          },
        ]
      : others;
    void setPage(null);
    void setFilters(updated);
  };

  const toggle = (val: string) => {
    const next = new Set(selected);
    if (next.has(val)) next.delete(val);
    else next.add(val);
    apply(next);
  };

  const reset = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    apply(new Set());
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="border-dashed font-normal">
          {selected.size > 0 ? (
            <div
              role="button"
              aria-label="Clear store filter"
              tabIndex={0}
              className="rounded-sm opacity-70 transition-opacity hover:opacity-100"
              onClick={reset}
            >
              <XCircle />
            </div>
          ) : (
            <PlusCircle />
          )}
          Store
          {selected.size > 0 && (
            <>
              <Separator
                orientation="vertical"
                className="mx-0.5 data-[orientation=vertical]:h-4"
              />
              <Badge variant="secondary" className="rounded-sm px-1 font-normal lg:hidden">
                {selected.size}
              </Badge>
              <div className="hidden items-center gap-1 lg:flex">
                {selected.size > 2 ? (
                  <Badge variant="secondary" className="rounded-sm px-1 font-normal">
                    {selected.size} selected
                  </Badge>
                ) : (
                  options
                    .filter((o) => selected.has(o.value))
                    .map((o) => (
                      <Badge
                        key={o.value}
                        variant="secondary"
                        className="rounded-sm px-1 font-normal"
                      >
                        {o.label}
                      </Badge>
                    ))
                )}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-0" align="start">
        <Command>
          <CommandInput placeholder="Search stores…" />
          <CommandList className="max-h-full">
            <CommandEmpty>No stores found.</CommandEmpty>
            <CommandGroup className="max-h-[300px] scroll-py-1 overflow-y-auto overflow-x-hidden">
              {options.map((o) => {
                const isSelected = selected.has(o.value);
                return (
                  <CommandItem key={o.value} onSelect={() => toggle(o.value)}>
                    <div
                      className={cn(
                        "flex size-4 items-center justify-center rounded-sm border border-primary",
                        isSelected ? "bg-primary" : "opacity-50 [&_svg]:invisible",
                      )}
                    >
                      <Check />
                    </div>
                    <span className="truncate">{o.label}</span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
            {selected.size > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={() => reset()}
                    className="justify-center text-center"
                  >
                    Clear filter
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

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
  const verify = trpc.admin.offers.verify.useMutation({
    onSuccess: () => {
      toast.success("Marked verified");
      utils.admin.offers.table.invalidate();
    },
    onError: (e) => toast.error(e.message),
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
        id: "trending",
        accessorKey: "trending",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Trending" />
        ),
        cell: ({ row }) => (
          <BoolCell
            value={row.original.trending}
            label={{ on: "Trending", off: "—" }}
          />
        ),
        meta: { label: "Trending", variant: "boolean", icon: ToggleLeft },
        enableColumnFilter: true,
      },
      {
        id: "verifiedAt",
        accessorKey: "verifiedAt",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Verified" />
        ),
        cell: ({ row }) => {
          const v = row.original.verifiedAt;
          if (!v) return <span className="text-muted-foreground">—</span>;
          const d = new Date(v);
          const days = Math.floor(
            (Date.now() - d.getTime()) / (1000 * 60 * 60 * 24)
          );
          return (
            <span
              className={
                days <= 7
                  ? "text-xs text-emerald-600"
                  : days <= 30
                    ? "text-xs text-amber-600"
                    : "text-xs text-muted-foreground"
              }
              title={d.toLocaleString()}
            >
              {days === 0 ? "today" : `${days}d ago`}
            </span>
          );
        },
        size: 100,
      },
      {
        id: "actions",
        cell: ({ row }) => (
          <div className="flex items-center justify-end gap-1">
            <Button
              variant="ghost"
              size="sm"
              disabled={verify.isPending}
              onClick={() => verify.mutate(row.original.id)}
              title="Mark as verified today"
            >
              <ShieldCheck className="size-4" />
            </Button>
            <RowActions
              editHref={`/admin/offers/${row.original.id}`}
              onDelete={() => del.mutate(row.original.id)}
              deleting={del.isPending}
            />
          </div>
        ),
        size: 120,
        enableSorting: false,
        enableHiding: false,
      },
    ],
    [storeOptions, del, verify],
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
        <DataTableSkeleton columnCount={9} rowCount={10} />
      ) : (
        <DataTable table={table}>
          <DataTableAdvancedToolbar table={table}>
            <StoreFilter options={storeOptions} />
            <DataTableFilterList table={table} />
            <DataTableSortList table={table} />
            <TableSearch placeholder="Search title, slug, code…" loading={isFetching} />
          </DataTableAdvancedToolbar>
        </DataTable>
      )}
    </div>
  );
}
