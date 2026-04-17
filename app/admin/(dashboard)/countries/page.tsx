"use client";

import * as React from "react";
import { useState } from "react";
import { Plus, Text, ToggleLeft, Flag } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { trpc } from "@/lib/trpc/client";
import { PageHeader, Field, FieldGrid } from "../_components/FormKit";
import { BoolCell, RowActions } from "../_components/TableKit";
import { DataTable } from "@/components/data-table/data-table";
import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { useDataTable } from "@/hooks/use-data-table";

const schema = z.object({
  code: z
    .string()
    .min(2)
    .max(16)
    .regex(/^[a-z0-9-]+$/, "lowercase letters, digits and dashes only"),
  name: z.string().min(1),
  flagEmoji: z.string().nullish(),
  currency: z.string().nullish(),
  sortOrder: z.number().int().default(0),
  active: z.boolean().default(true),
});
type FormValues = z.infer<typeof schema>;

function CountryDialog({
  initial,
  code,
  trigger,
}: {
  initial?: Partial<FormValues>;
  code?: string;
  trigger: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const utils = trpc.useUtils();
  const form = useForm<FormValues>({
    resolver: zodResolver(schema) as any,
    defaultValues: {
      code: "",
      name: "",
      flagEmoji: "",
      currency: "",
      sortOrder: 0,
      active: true,
      ...initial,
    } as FormValues,
  });
  const create = trpc.admin.countries.create.useMutation({
    onSuccess: () => {
      toast.success("Created");
      utils.admin.countries.list.invalidate();
      setOpen(false);
      form.reset();
    },
    onError: (e) => toast.error(e.message),
  });
  const update = trpc.admin.countries.update.useMutation({
    onSuccess: () => {
      toast.success("Updated");
      utils.admin.countries.list.invalidate();
      setOpen(false);
    },
    onError: (e) => toast.error(e.message),
  });

  function onSubmit(values: FormValues) {
    if (code) update.mutate({ code, data: values });
    else create.mutate(values);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-display text-xl">
            {code ? "Edit" : "New"} country
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FieldGrid>
            <Field label="Code" hint="lowercase, e.g. in / us / ae / global">
              <Input
                {...form.register("code")}
                disabled={!!code}
                placeholder="in"
              />
            </Field>
            <Field label="Name">
              <Input {...form.register("name")} placeholder="India" />
            </Field>
            <Field label="Flag emoji">
              <Input {...form.register("flagEmoji")} placeholder="🇮🇳" />
            </Field>
            <Field label="Currency" hint="ISO code, optional">
              <Input {...form.register("currency")} placeholder="INR" />
            </Field>
            <Field label="Sort order" hint="Lower shows first">
              <Input
                type="number"
                {...form.register("sortOrder", { valueAsNumber: true })}
              />
            </Field>
          </FieldGrid>
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
          <DialogFooter>
            <Button type="submit" className="w-full">
              {code ? "Save changes" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

type Row = {
  code: string;
  name: string;
  flagEmoji: string | null;
  currency: string | null;
  sortOrder: number;
  active: boolean;
};

export default function CountriesAdminPage() {
  const utils = trpc.useUtils();
  const { data, isLoading } = trpc.admin.countries.list.useQuery();

  const del = trpc.admin.countries.delete.useMutation({
    onSuccess: () => {
      toast.success("Deleted");
      utils.admin.countries.list.invalidate();
    },
    onError: (e) => toast.error(e.message),
  });

  const columns = React.useMemo<ColumnDef<Row>[]>(
    () => [
      {
        id: "flagEmoji",
        accessorKey: "flagEmoji",
        header: "Flag",
        cell: ({ row }) => (
          <span className="text-lg">{row.original.flagEmoji ?? "—"}</span>
        ),
        size: 60,
        enableSorting: false,
      },
      {
        id: "code",
        accessorKey: "code",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Code" />
        ),
        cell: ({ row }) => (
          <span className="font-mono text-xs text-muted-foreground">
            {row.original.code}
          </span>
        ),
        meta: { label: "Code", variant: "text", icon: Text },
      },
      {
        id: "name",
        accessorKey: "name",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Name" />
        ),
        cell: ({ row }) => (
          <span className="font-medium">{row.original.name}</span>
        ),
        meta: { label: "Name", variant: "text", icon: Flag },
      },
      {
        id: "currency",
        accessorKey: "currency",
        header: "Currency",
        cell: ({ row }) => row.original.currency ?? "—",
      },
      {
        id: "sortOrder",
        accessorKey: "sortOrder",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="Order" />
        ),
        cell: ({ row }) => row.original.sortOrder,
        size: 80,
      },
      {
        id: "active",
        accessorKey: "active",
        header: "Status",
        cell: ({ row }) => <BoolCell value={row.original.active} />,
        meta: { label: "Status", variant: "boolean", icon: ToggleLeft },
      },
      {
        id: "actions",
        cell: ({ row }) => (
          <div className="flex items-center justify-end gap-1">
            <CountryDialog
              code={row.original.code}
              initial={row.original as any}
              trigger={
                <Button variant="ghost" size="sm">
                  Edit
                </Button>
              }
            />
            <RowActions
              onDelete={() => del.mutate(row.original.code)}
              deleting={del.isPending}
            />
          </div>
        ),
        size: 140,
        enableSorting: false,
        enableHiding: false,
      },
    ],
    [del]
  );

  const rows = (data ?? []) as Row[];
  const { table } = useDataTable<Row>({
    data: rows,
    columns,
    pageCount: 1,
    getRowId: (r) => r.code,
    initialState: { pagination: { pageSize: 50, pageIndex: 0 } },
  });

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Catalog"
        title="Countries"
        description="Master list of countries used to geo-filter stores and offers."
        actions={
          <CountryDialog
            trigger={
              <Button>
                <Plus className="size-4" /> Add country
              </Button>
            }
          />
        }
      />
      {isLoading ? (
        <DataTableSkeleton columnCount={6} rowCount={6} />
      ) : (
        <DataTable table={table} />
      )}
    </div>
  );
}
