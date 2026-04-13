"use client";

import Link from "next/link";
import Image from "next/image";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc/client";
import { toast } from "sonner";
import ResourceTable, { BoolCell } from "../_components/ResourceTable";

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
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Slides</h1>
        <Button asChild>
          <Link href="/admin/slides/new">
            <Plus className="size-4" /> Add Slide
          </Link>
        </Button>
      </div>
      {isLoading ? (
        <div>Loading…</div>
      ) : (
        <ResourceTable
          rows={data}
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
                  className="rounded"
                />
              ),
            },
            { key: "title", label: "Title", render: (r) => r.title },
            { key: "order", label: "Order", render: (r) => r.order },
            {
              key: "active",
              label: "Active",
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
