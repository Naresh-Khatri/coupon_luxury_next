"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc/client";
import { toast } from "sonner";
import ResourceTable, { BoolCell } from "../_components/ResourceTable";
import { PageHeader } from "../_components/FormKit";

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
    <div className="space-y-6">
      <PageHeader
        eyebrow="Catalog"
        title="Offers"
        description="Deals and coupons across every store."
        actions={
          <Button asChild>
            <Link href="/admin/offers/new">
              <Plus className="size-4" /> Add offer
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
          rows={data as any[]}
          emptyLabel="No offers yet"
          columns={[
            {
              key: "title",
              label: "Title",
              render: (r: any) => (
                <span className="font-medium">{r.title}</span>
              ),
            },
            {
              key: "store",
              label: "Store",
              render: (r: any) => r.store?.storeName ?? "—",
            },
            {
              key: "type",
              label: "Type",
              render: (r: any) => (
                <Badge
                  variant="outline"
                  className="font-mono text-[10px] uppercase tracking-wider"
                >
                  {r.offerType}
                </Badge>
              ),
            },
            {
              key: "code",
              label: "Code",
              render: (r: any) =>
                r.couponCode ? (
                  <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
                    {r.couponCode}
                  </code>
                ) : (
                  <span className="text-muted-foreground">—</span>
                ),
            },
            {
              key: "active",
              label: "Status",
              render: (r: any) => <BoolCell value={r.active} />,
            },
            {
              key: "featured",
              label: "Featured",
              render: (r: any) => (
                <BoolCell
                  value={r.featured}
                  label={{ on: "Featured", off: "Normal" }}
                />
              ),
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
