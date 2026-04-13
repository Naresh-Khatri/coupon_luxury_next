"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc/client";
import { toast } from "sonner";
import ResourceTable, { BoolCell } from "../_components/ResourceTable";

export default function CategoriesAdminPage() {
  const utils = trpc.useUtils();
  const { data = [], isLoading } = trpc.admin.categories.list.useQuery();
  const del = trpc.admin.categories.delete.useMutation({
    onSuccess: () => {
      toast.success("Deleted");
      utils.admin.categories.list.invalidate();
    },
    onError: () => toast.error("Delete failed"),
  });

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Categories</h1>
        <Button asChild>
          <Link href="/admin/categories/new">
            <Plus className="size-4" /> Add Category
          </Link>
        </Button>
      </div>
      {isLoading ? (
        <div>Loading…</div>
      ) : (
        <ResourceTable
          rows={data}
          columns={[
            { key: "name", label: "Name", render: (r) => r.categoryName },
            { key: "slug", label: "Slug", render: (r) => r.slug },
            {
              key: "active",
              label: "Active",
              render: (r) => <BoolCell value={r.active} />,
            },
            {
              key: "featured",
              label: "Featured",
              render: (r) => <BoolCell value={r.featured} />,
            },
          ]}
          editHref={(r) => `/admin/categories/${r.id}`}
          onDelete={(id) => del.mutate(id)}
          deleting={del.isPending}
        />
      )}
    </div>
  );
}
