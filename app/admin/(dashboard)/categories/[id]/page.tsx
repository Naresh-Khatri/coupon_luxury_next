"use client";

import { useParams } from "next/navigation";
import { trpc } from "@/lib/trpc/client";
import CategoryForm from "../CategoryForm";

export default function EditCategoryPage() {
  const { id } = useParams<{ id: string }>();
  const categoryId = Number(id);
  const { data, isLoading } = trpc.admin.categories.byId.useQuery(categoryId);

  if (isLoading) return <div>Loading…</div>;
  if (!data) return <div>Not found</div>;

  return <CategoryForm id={categoryId} initial={data as any} />;
}
