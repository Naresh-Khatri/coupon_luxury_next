"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc/client";
import { toast } from "sonner";
import ResourceTable, { BoolCell } from "../_components/ResourceTable";
import { PageHeader } from "../_components/FormKit";

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
        <div className="py-8 text-center text-sm text-muted-foreground">
          Loading…
        </div>
      ) : (
        <ResourceTable
          rows={data}
          emptyLabel="No categories yet"
          columns={[
            {
              key: "name",
              label: "Name",
              render: (r) => (
                <span className="font-medium">{r.categoryName}</span>
              ),
            },
            {
              key: "slug",
              label: "Slug",
              render: (r) => (
                <span className="font-mono text-xs text-muted-foreground">
                  {r.slug}
                </span>
              ),
            },
            {
              key: "active",
              label: "Status",
              render: (r) => <BoolCell value={r.active} />,
            },
            {
              key: "featured",
              label: "Featured",
              render: (r) => (
                <BoolCell
                  value={r.featured}
                  label={{ on: "Featured", off: "Normal" }}
                />
              ),
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
