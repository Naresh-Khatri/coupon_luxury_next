"use client";

import { trpc } from "@/lib/trpc/client";
import { toast } from "sonner";
import ResourceTable from "../_components/ResourceTable";

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
    <div className="space-y-5">
      <h1 className="text-2xl font-bold">Subscribers</h1>
      {isLoading ? (
        <div>Loading…</div>
      ) : (
        <ResourceTable
          rows={data}
          columns={[
            { key: "email", label: "Email", render: (r) => r.email },
            {
              key: "date",
              label: "Subscribed",
              render: (r) => new Date(r.createdAt).toLocaleDateString(),
            },
          ]}
          onDelete={(id) => del.mutate(id)}
          deleting={del.isPending}
        />
      )}
    </div>
  );
}
