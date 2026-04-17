"use client";

import * as React from "react";
import { useState } from "react";
import { Plus, Text, ToggleLeft, Tag } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { trpc } from "@/lib/trpc/client";
import { PageHeader, Field } from "../_components/FormKit";
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

const schema = z.object({
  subCategoryName: z.string().min(1),
  slug: z.string().min(1),
  categoryId: z.number().int(),
  description: z.string().nullish(),
  active: z.boolean().default(false),
  featured: z.boolean().default(false),
});
type FormValues = z.infer<typeof schema>;

function SubCategoryDialog({
  initial,
  id,
  trigger,
}: {
  initial?: Partial<FormValues>;
  id?: number;
  trigger: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const utils = trpc.useUtils();
  const { data: cats = [] } = trpc.admin.categories.list.useQuery();
  const form = useForm<FormValues>({
    resolver: zodResolver(schema) as any,
    defaultValues: {
      subCategoryName: "",
      slug: "",
      active: false,
      featured: false,
      ...initial,
    } as FormValues,
  });
  const create = trpc.admin.subCategories.create.useMutation({
    onSuccess: () => {
      toast.success("Created");
      utils.admin.subCategories.table.invalidate();
      utils.admin.subCategories.list.invalidate();
      setOpen(false);
      form.reset();
    },
    onError: (e) => toast.error(e.message),
  });
  const update = trpc.admin.subCategories.update.useMutation({
    onSuccess: () => {
      toast.success("Updated");
      utils.admin.subCategories.table.invalidate();
      utils.admin.subCategories.list.invalidate();
      setOpen(false);
    },
    onError: (e) => toast.error(e.message),
  });

  function onSubmit(values: FormValues) {
    if (id) update.mutate({ id, data: values });
    else create.mutate(values);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-display text-xl">
            {id ? "Edit" : "New"} sub-category
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <Field label="Name">
            <Input {...form.register("subCategoryName")} />
          </Field>
          <Field label="Slug">
            <Input {...form.register("slug")} />
          </Field>
          <Field label="Category">
            <Controller
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <Select
                  value={field.value ? String(field.value) : ""}
                  onValueChange={(v) => field.onChange(Number(v))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {cats.map((c) => (
                      <SelectItem key={c.id} value={String(c.id)}>
                        {c.categoryName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </Field>
          <Field label="Description">
            <Textarea
              className="min-h-[80px]"
              {...form.register("description")}
            />
          </Field>
          <div className="flex items-center gap-6">
            <Controller
              control={form.control}
              name="active"
              render={({ field }) => (
                <label className="flex items-center gap-2 text-sm">
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                  Active
                </label>
              )}
            />
            <Controller
              control={form.control}
              name="featured"
              render={({ field }) => (
                <label className="flex items-center gap-2 text-sm">
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                  Featured
                </label>
              )}
            />
          </div>
          <DialogFooter>
            <Button type="submit" className="w-full">
              {id ? "Save changes" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

type Row = {
  id: number;
  subCategoryName: string;
  slug: string;
  categoryId: number;
  description: string | null;
  active: boolean;
  featured: boolean;
  category?: { id: number; categoryName: string } | null;
};

const COL_IDS = [
  "subCategoryName",
  "slug",
  "categoryId",
  "active",
  "featured",
];

export default function SubCategoriesAdminPage() {
  const qs = useTableQuery(COL_IDS);
  const utils = trpc.useUtils();
  const { data, isFetching } = trpc.admin.subCategories.table.useQuery(qs, {
    placeholderData: (prev) => prev,
  });
  const { data: cats = [] } = trpc.admin.categories.list.useQuery();

  const del = trpc.admin.subCategories.delete.useMutation({
    onSuccess: () => {
      toast.success("Deleted");
      utils.admin.subCategories.table.invalidate();
      utils.admin.subCategories.list.invalidate();
    },
    onError: () => toast.error("Delete failed"),
  });

  const catOptions = React.useMemo(
    () =>
      cats.map((c: any) => ({ label: c.categoryName, value: String(c.id) })),
    [cats],
  );

  const columns = React.useMemo<ColumnDef<Row>[]>(
    () => [
      {
        id: "subCategoryName",
        accessorKey: "subCategoryName",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Name" />
        ),
        cell: ({ row }) => (
          <span className="font-medium">{row.original.subCategoryName}</span>
        ),
        meta: {
          label: "Name",
          placeholder: "Search sub-categories…",
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
          <div className="flex items-center justify-end gap-1">
            <SubCategoryDialog
              id={row.original.id}
              initial={row.original as any}
              trigger={
                <Button variant="ghost" size="sm">
                  Edit
                </Button>
              }
            />
            <RowActions
              onDelete={() => del.mutate(row.original.id)}
              deleting={del.isPending}
            />
          </div>
        ),
        size: 140,
        enableSorting: false,
        enableHiding: false,
      },
    ],
    [catOptions, del],
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
        title="Sub-categories"
        description="Second-level groupings within each category."
        actions={
          <SubCategoryDialog
            trigger={
              <Button>
                <Plus className="size-4" /> Add sub-category
              </Button>
            }
          />
        }
      />
      {!data ? (
        <DataTableSkeleton columnCount={5} rowCount={10} />
      ) : (
        <DataTable table={table}>
          <DataTableAdvancedToolbar table={table}>
            <TableSearch placeholder="Search name, slug…" loading={isFetching} />
            <DataTableFilterList table={table} />
            <DataTableSortList table={table} />
          </DataTableAdvancedToolbar>
        </DataTable>
      )}
    </div>
  );
}
