"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc/client";
import ResourceTable, { BoolCell } from "../_components/ResourceTable";
import { toast } from "sonner";
import { PageHeader } from "../_components/FormKit";

export default function StoresAdminPage() {
  const utils = trpc.useUtils();
  const { data = [], isLoading } = trpc.admin.stores.list.useQuery();
  const del = trpc.admin.stores.delete.useMutation({
    onSuccess: () => {
      toast.success("Deleted");
      utils.admin.stores.list.invalidate();
    },
    onError: () => toast.error("Delete failed"),
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
        <div className="py-8 text-center text-sm text-muted-foreground">
          Loading…
        </div>
      ) : (
        <ResourceTable
          rows={data}
          emptyLabel="No stores yet"
          columns={[
            {
              key: "name",
              label: "Name",
              render: (r) => (
                <span className="font-medium">{r.storeName}</span>
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
              key: "cat",
              label: "Category",
              render: (r) => r.category?.categoryName ?? "",
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
          editHref={(r) => `/admin/stores/${r.id}`}
          onDelete={(id) => del.mutate(id)}
          deleting={del.isPending}
        />
      )}
    </div>
  );
}
