"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
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
import ResourceTable, { BoolCell } from "../_components/ResourceTable";
import { PageHeader, Field } from "../_components/FormKit";

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
      utils.admin.subCategories.list.invalidate();
      setOpen(false);
      form.reset();
    },
    onError: (e) => toast.error(e.message),
  });
  const update = trpc.admin.subCategories.update.useMutation({
    onSuccess: () => {
      toast.success("Updated");
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

export default function SubCategoriesAdminPage() {
  const utils = trpc.useUtils();
  const { data = [], isLoading } = trpc.admin.subCategories.list.useQuery();
  const del = trpc.admin.subCategories.delete.useMutation({
    onSuccess: () => {
      toast.success("Deleted");
      utils.admin.subCategories.list.invalidate();
    },
    onError: () => toast.error("Delete failed"),
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
      {isLoading ? (
        <div className="py-8 text-center text-sm text-muted-foreground">
          Loading…
        </div>
      ) : (
        <ResourceTable
          rows={data as any[]}
          emptyLabel="No sub-categories yet"
          columns={[
            {
              key: "name",
              label: "Name",
              render: (r: any) => (
                <span className="font-medium">{r.subCategoryName}</span>
              ),
            },
            {
              key: "slug",
              label: "Slug",
              render: (r: any) => (
                <span className="font-mono text-xs text-muted-foreground">
                  {r.slug}
                </span>
              ),
            },
            {
              key: "cat",
              label: "Category",
              render: (r: any) => r.category?.categoryName ?? "",
            },
            {
              key: "active",
              label: "Status",
              render: (r: any) => <BoolCell value={r.active} />,
            },
            {
              key: "edit",
              label: "",
              align: "right",
              render: (r: any) => (
                <SubCategoryDialog
                  id={r.id}
                  initial={r}
                  trigger={
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  }
                />
              ),
            },
          ]}
          onDelete={(id) => del.mutate(id)}
          deleting={del.isPending}
        />
      )}
    </div>
  );
}
