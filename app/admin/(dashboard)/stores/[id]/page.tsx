"use client";

import { useParams } from "next/navigation";
import { trpc } from "@/lib/trpc/client";
import StoreForm from "../StoreForm";

export default function EditStorePage() {
  const { id } = useParams<{ id: string }>();
  const storeId = Number(id);
  const { data, isLoading } = trpc.admin.stores.byId.useQuery(storeId);

  if (isLoading) return <div>Loading…</div>;
  if (!data) return <div>Not found</div>;

  return (
    <StoreForm
      storeId={storeId}
      initial={{
        storeName: data.storeName,
        slug: data.slug,
        storeURL: data.storeURL,
        image: data.image,
        pageHTML: data.pageHTML,
        howToUse: (data.howToUse ?? []).map((value: string) => ({ value })),
        faqs: data.faqs ?? [],
        country: data.country,
        categoryId: data.categoryId,
        subCategoryId: data.subCategoryId,
        active: data.active,
        featured: data.featured,
        storeOfTheMonth: data.storeOfTheMonth,
        metaTitle: data.metaTitle,
        metaDescription: data.metaDescription,
        metaKeywords: data.metaKeywords,
        metaSchema: data.metaSchema,
      }}
    />
  );
}
