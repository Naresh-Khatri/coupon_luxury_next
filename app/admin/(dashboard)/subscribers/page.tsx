"use client";

import { trpc } from "@/lib/trpc/client";
import { toast } from "sonner";
import ResourceTable from "../_components/ResourceTable";
import { PageHeader } from "../_components/FormKit";

export default function SubscribersAdminPage() {
  const utils = trpc.useUtils();
  const { data = [], isLoading } = trpc.admin.subscribers.list.useQuery();
  const del = trpc.admin.subscribers.delete.useMutation({
    onSuccess: () => {
      toast.success("Deleted");
      utils.admin.subscribers.list.invalidate();
    },
    onError: () => toast.error("Delete failed"),
  });

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Audience"
        title="Subscribers"
        description="Newsletter and email list."
      />
      {isLoading ? (
        <div className="py-8 text-center text-sm text-muted-foreground">
          Loading…
        </div>
      ) : (
        <ResourceTable
          rows={data}
          emptyLabel="No subscribers yet"
          columns={[
            {
              key: "email",
              label: "Email",
              render: (r) => (
                <span className="font-mono text-sm">{r.email}</span>
              ),
            },
            {
              key: "date",
              label: "Subscribed",
              render: (r) => (
                <span className="tabular-nums text-sm text-muted-foreground">
                  {new Date(r.createdAt).toLocaleDateString()}
                </span>
              ),
            },
          ]}
          onDelete={(id) => del.mutate(id)}
          deleting={del.isPending}
        />
      )}
    </div>
  );
}
