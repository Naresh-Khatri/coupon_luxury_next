"use client";

import { useParams } from "next/navigation";
import { trpc } from "@/lib/trpc/client";
import SlideForm from "../SlideForm";

export default function EditSlidePage() {
  const { id } = useParams<{ id: string }>();
  const slideId = Number(id);
  const { data, isLoading } = trpc.admin.slides.byId.useQuery(slideId);

  if (isLoading) return <div>Loading…</div>;
  if (!data) return <div>Not found</div>;
  return <SlideForm id={slideId} initial={data as any} />;
}
