"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc/client";

type ActivateInput = {
  offerId?: number;
  slug: string;
  affURL: string;
  couponCode?: string | null;
};

export function useActivateOffer() {
  const router = useRouter();
  const trackClick = trpc.public.trackOfferClick.useMutation();

  return useCallback(
    async ({ offerId, slug, affURL, couponCode }: ActivateInput) => {
      const dealHref = `/deals/${slug}`;

      if (couponCode) {
        try {
          await navigator.clipboard.writeText(couponCode);
          toast.success("Code copied", {
            description: "Paste it at checkout in the new tab",
          });
        } catch {
          toast.message("Opening store…", {
            description: "Copy the code from the deal page if needed",
          });
        }
      }

      if (offerId) trackClick.mutate({ offerId });

      window.open(affURL, "_blank", "noopener,noreferrer");
      router.push(dealHref);
    },
    [router, trackClick]
  );
}
