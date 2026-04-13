"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc/client";
import { toast } from "sonner";
import ResourceTable, { BoolCell } from "../_components/ResourceTable";

export default function OffersAdminPage() {
  const utils = trpc.useUtils();
  const { data = [], isLoading } = trpc.admin.offers.list.useQuery();
  const del = trpc.admin.offers.delete.useMutation({
    onSuccess: () => {
      toast.success("Deleted");
      utils.admin.offers.list.invalidate();
    },
    onError: () => toast.error("Delete failed"),
  });

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Offers</h1>
        <Button asChild>
          <Link href="/admin/offers/new">
            <Plus className="size-4" /> Add Offer
          </Link>
        </Button>
      </div>
      {isLoading ? (
        <div>Loading…</div>
      ) : (
        <ResourceTable
          rows={data as any[]}
          columns={[
            { key: "title", label: "Title", render: (r: any) => r.title },
            {
              key: "store",
              label: "Store",
              render: (r: any) => r.store?.storeName ?? "",
            },
            { key: "type", label: "Type", render: (r: any) => r.offerType },
            {
              key: "code",
              label: "Code",
              render: (r: any) => r.couponCode ?? "-",
            },
            {
              key: "active",
              label: "Active",
              render: (r: any) => <BoolCell value={r.active} />,
            },
            {
              key: "featured",
              label: "Featured",
              render: (r: any) => <BoolCell value={r.featured} />,
            },
          ]}
          editHref={(r) => `/admin/offers/${r.id}`}
          onDelete={(id) => del.mutate(id)}
          deleting={del.isPending}
        />
      )}
    </div>
  );
}
