"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc/client";
import { toast } from "sonner";
import ResourceTable, { BoolCell } from "../_components/ResourceTable";
import { PageHeader } from "../_components/FormKit";

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
    <div className="space-y-6">
      <PageHeader
        eyebrow="Content"
        title="Blogs"
        description="Editorial posts and store guides."
        actions={
          <Button asChild>
            <Link href="/admin/blogs/new">
              <Plus className="size-4" /> New post
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
          emptyLabel="No posts yet"
          columns={[
            {
              key: "title",
              label: "Title",
              render: (r) => <span className="font-medium">{r.title}</span>,
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
              render: (r) => (
                <BoolCell
                  value={r.active}
                  label={{ on: "Published", off: "Draft" }}
                />
              ),
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
          editHref={(r) => `/admin/blogs/${r.id}`}
          onDelete={(id) => del.mutate(id)}
          deleting={del.isPending}
        />
      )}
    </div>
  );
}
