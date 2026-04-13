"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc/client";
import { toast } from "sonner";
import ResourceTable, { BoolCell } from "../_components/ResourceTable";

export default function BlogsAdminPage() {
  const utils = trpc.useUtils();
  const { data = [], isLoading } = trpc.admin.blogs.list.useQuery();
  const del = trpc.admin.blogs.delete.useMutation({
    onSuccess: () => {
      toast.success("Deleted");
      utils.admin.blogs.list.invalidate();
    },
    onError: () => toast.error("Delete failed"),
  });

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Blogs</h1>
        <Button asChild>
          <Link href="/admin/blogs/new">
            <Plus className="size-4" /> New Blog
          </Link>
        </Button>
      </div>
      {isLoading ? (
        <div>Loading…</div>
      ) : (
        <ResourceTable
          rows={data}
          columns={[
            { key: "title", label: "Title", render: (r) => r.title },
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
          editHref={(r) => `/admin/blogs/${r.id}`}
          onDelete={(id) => del.mutate(id)}
          deleting={del.isPending}
        />
      )}
    </div>
  );
}
