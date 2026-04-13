"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc/client";
import ResourceTable, { BoolCell } from "../_components/ResourceTable";
import { toast } from "sonner";

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
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Stores</h1>
        <Button asChild>
          <Link href="/admin/stores/new">
            <Plus className="size-4" /> Add Store
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <div>Loading…</div>
      ) : (
        <ResourceTable
          rows={data}
          columns={[
            { key: "name", label: "Name", render: (r) => r.storeName },
            { key: "slug", label: "Slug", render: (r) => r.slug },
            {
              key: "cat",
              label: "Category",
              render: (r) => r.category?.categoryName ?? "",
            },
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
          editHref={(r) => `/admin/stores/${r.id}`}
          onDelete={(id) => del.mutate(id)}
          deleting={del.isPending}
        />
      )}
    </div>
  );
}
