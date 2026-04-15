"use client";

import Link from "next/link";
import Image from "next/image";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc/client";
import { toast } from "sonner";
import ResourceTable, { BoolCell } from "../_components/ResourceTable";
import { PageHeader } from "../_components/FormKit";

export default function SlidesAdminPage() {
  const utils = trpc.useUtils();
  const { data = [], isLoading } = trpc.admin.slides.list.useQuery();
  const del = trpc.admin.slides.delete.useMutation({
    onSuccess: () => {
      toast.success("Deleted");
      utils.admin.slides.list.invalidate();
    },
    onError: () => toast.error("Delete failed"),
  });

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Content"
        title="Slides"
        description="Homepage hero carousel."
        actions={
          <Button asChild>
            <Link href="/admin/slides/new">
              <Plus className="size-4" /> Add slide
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
          emptyLabel="No slides yet"
          columns={[
            {
              key: "img",
              label: "Image",
              render: (r) => (
                <Image
                  src={r.imgURL}
                  alt={r.imgAlt}
                  width={80}
                  height={40}
                  className="rounded border border-border/60"
                />
              ),
            },
            {
              key: "title",
              label: "Title",
              render: (r) => <span className="font-medium">{r.title}</span>,
            },
            {
              key: "order",
              label: "Order",
              render: (r) => (
                <span className="font-mono tabular-nums text-sm">
                  {r.order}
                </span>
              ),
            },
            {
              key: "active",
              label: "Status",
              render: (r) => <BoolCell value={r.active} />,
            },
          ]}
          editHref={(r) => `/admin/slides/${r.id}`}
          onDelete={(id) => del.mutate(id)}
          deleting={del.isPending}
        />
      )}
    </div>
  );
}
