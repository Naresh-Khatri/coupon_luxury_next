"use client";

import { useEffect, useRef, useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc/client";

type Props = {
  offerId: number;
  storeName: string;
  couponCode: string | null;
  affURL: string;
  offerType: string;
};

const REDIRECT_DELAY_MS = 1800;

export default function RedeemClient({
  offerId,
  storeName,
  couponCode,
  affURL,
  offerType,
}: Props) {
  const isCoupon = offerType === "coupon" && !!couponCode;
  const [copied, setCopied] = useState(false);
  const fired = useRef(false);

  const trackClick = trpc.public.trackOfferClick.useMutation();

  useEffect(() => {
    if (fired.current) return;
    fired.current = true;

    trackClick.mutate({ offerId });

    if (isCoupon && couponCode) {
      navigator.clipboard
        .writeText(couponCode)
        .then(() => setCopied(true))
        .catch(() => toast.error("Couldn't copy code — please copy manually"));
    }

    const t = setTimeout(() => {
      window.location.href = affURL;
    }, REDIRECT_DELAY_MS);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="flex flex-1 items-center justify-center px-4 py-12">
      <div className="w-full max-w-xl rounded-2xl bg-[#111114] border border-white/8 p-8 shadow-sm md:p-12">
        {isCoupon ? (
          <div className="flex flex-col items-center gap-6 text-center">
            <div className="flex items-center gap-2 text-emerald-600">
              <CheckCircle2 className="size-6" />
              <span className="text-lg font-semibold">
                {copied ? "Code Successfully Copied!" : "Copying code…"}
              </span>
            </div>
            <p className="text-sm text-white/60">
              Paste this code at checkout &amp; carry on shopping
            </p>
            <div className="w-full rounded-lg border-2 border-dashed border-gold/50 bg-gold/5 px-6 py-5 text-center font-mono text-2xl font-bold tracking-wider text-white">
              {couponCode}
            </div>
            <div className="my-2 w-full border-t border-white/8" />
            <Opening storeName={storeName} affURL={affURL} />
          </div>
        ) : (
          <div className="flex flex-col items-center gap-6 text-center">
            <Opening storeName={storeName} affURL={affURL} large />
          </div>
        )}
        <div className="mt-8 text-center">
          <button
            type="button"
            onClick={() => history.back()}
            className="text-sm text-white/40 underline-offset-4 hover:text-white hover:underline"
          >
            Go Back
          </button>
        </div>
      </div>
    </section>
  );
}

function Opening({
  storeName,
  affURL,
  large = false,
}: {
  storeName: string;
  affURL: string;
  large?: boolean;
}) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex items-center gap-3 text-gold">
        <Loader2 className={large ? "size-7 animate-spin" : "size-5 animate-spin"} />
        <span className={large ? "text-xl font-semibold" : "text-base font-medium"}>
          Opening {storeName}…
        </span>
      </div>
      <a
        href={affURL}
        className="text-sm font-semibold text-gold underline-offset-4 hover:underline"
      >
        Continue to store
      </a>
    </div>
  );
}
