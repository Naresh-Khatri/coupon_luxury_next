"use client";

import Link from "next/link";
import { useState } from "react";
import { Copy, Check, ArrowUpRight, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type Props = {
  slug: string;
  couponCode: string;
  storeName: string;
  storeURL?: string | null;
  verified?: boolean;
};

export default function CouponReveal({
  slug,
  couponCode,
  storeName,
  storeURL,
  verified,
}: Props) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(couponCode);
      setCopied(true);
      toast.success("Code copied");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Couldn't copy — please copy manually");
    }
  };

  return (
    <div className="mx-auto w-full max-w-2xl rounded-2xl border border-emerald-500/30 bg-card p-6 shadow-sm md:p-8">
      <p className="text-sm text-muted-foreground">Use this coupon code at checkout:</p>

      <div
        className={cn(
          "mt-4 flex items-stretch overflow-hidden rounded-lg border-2 border-dashed transition-all",
          copied ? "border-teal bg-teal/5" : "border-gold/50 bg-gold/5"
        )}
      >
        <span className="flex flex-1 items-center justify-center px-4 py-6 font-mono text-3xl font-extrabold tracking-wider text-foreground md:text-4xl">
          {couponCode}
        </span>
        <button
          type="button"
          onClick={copy}
          className={cn(
            "flex items-center gap-2 px-6 text-sm font-bold uppercase tracking-wider text-white transition-colors",
            copied ? "bg-teal" : "bg-gold hover:bg-gold-light"
          )}
        >
          {copied ? (
            <>
              <Check className="size-4" /> Copied
            </>
          ) : (
            <>
              <Copy className="size-4" /> Copy Code
            </>
          )}
        </button>
      </div>

      <div className="mt-6 flex flex-col items-center gap-3 text-center">
        <Link
          href={`/redeem/${slug}`}
          className="inline-flex items-center gap-1.5 text-base font-semibold text-gold underline-offset-4 hover:underline"
        >
          Go To {storeName}
          <ArrowUpRight className="size-4" />
        </Link>
        {storeURL ? null : null}
        {verified && (
          <div className="flex items-center gap-1.5 text-sm text-emerald-600">
            <ShieldCheck className="size-4" />
            <span>Verified</span>
          </div>
        )}
      </div>
    </div>
  );
}
