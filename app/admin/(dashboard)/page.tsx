"use client";

import { Store, Tag, Box, Ticket, Newspaper } from "lucide-react";
import { trpc } from "@/lib/trpc/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminDashboardPage() {
  const { data, isLoading } = trpc.admin.stats.useQuery();

  const stats = [
    { label: "Stores", value: data?.stores ?? 0, icon: Store },
    { label: "Categories", value: data?.categories ?? 0, icon: Box },
    { label: "Deals", value: data?.deals ?? 0, icon: Tag },
    { label: "Coupons", value: data?.coupons ?? 0, icon: Ticket },
    { label: "Blogs", value: data?.blogs ?? 0, icon: Newspaper },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {s.label}
              </CardTitle>
              <s.icon className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {isLoading ? "…" : s.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
