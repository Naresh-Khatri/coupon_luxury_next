"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { trpc } from "@/lib/trpc/client";
import ResourceTable, { BoolCell } from "../_components/ResourceTable";

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
          <DialogTitle>{id ? "Edit" : "New"} Sub-category</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4"
        >
          <div className="space-y-1.5">
            <Label>Name</Label>
            <Input {...form.register("subCategoryName")} />
          </div>
          <div className="space-y-1.5">
            <Label>Slug</Label>
            <Input {...form.register("slug")} />
          </div>
          <div className="space-y-1.5">
            <Label>Category</Label>
            <select
              className="h-10 w-full rounded-md border px-3"
              {...form.register("categoryId", { valueAsNumber: true })}
            >
              <option value="">Select</option>
              {cats.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.categoryName}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-1.5">
            <Label>Description</Label>
            <textarea
              className="min-h-[80px] w-full rounded-md border p-3"
              {...form.register("description")}
            />
          </div>
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2">
              <input type="checkbox" {...form.register("active")} /> Active
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" {...form.register("featured")} /> Featured
            </label>
          </div>
          <Button type="submit" className="w-full">
            {id ? "Update" : "Create"}
          </Button>
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
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Sub-categories</h1>
        <SubCategoryDialog
          trigger={
            <Button>
              <Plus className="size-4" /> Add Sub-category
            </Button>
          }
        />
      </div>
      {isLoading ? (
        <div>Loading…</div>
      ) : (
        <ResourceTable
          rows={data as any[]}
          columns={[
            {
              key: "name",
              label: "Name",
              render: (r: any) => r.subCategoryName,
            },
            { key: "slug", label: "Slug", render: (r: any) => r.slug },
            {
              key: "cat",
              label: "Category",
              render: (r: any) => r.category?.categoryName ?? "",
            },
            {
              key: "active",
              label: "Active",
              render: (r: any) => <BoolCell value={r.active} />,
            },
            {
              key: "edit",
              label: "",
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
