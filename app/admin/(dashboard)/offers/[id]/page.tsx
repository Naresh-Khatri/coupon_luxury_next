"use client";

import { useParams } from "next/navigation";
import { trpc } from "@/lib/trpc/client";
import OfferForm from "../OfferForm";

export default function EditOfferPage() {
  const { id } = useParams<{ id: string }>();
  const offerId = Number(id);
  const { data, isLoading } = trpc.admin.offers.byId.useQuery(offerId);

  if (isLoading) return <div>Loading…</div>;
  if (!data) return <div>Not found</div>;

  return (
    <OfferForm
      id={offerId}
      initial={{
        ...data,
        offerType: data.offerType as "deal" | "coupon",
      }}
    />
  );
}
