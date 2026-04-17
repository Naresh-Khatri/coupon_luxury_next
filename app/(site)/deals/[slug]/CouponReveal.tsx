"use client";

import Link from "next/link";
import { useState } from "react";
import { Copy, Check, ArrowUpRight } from "lucide-react";
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
    <div className="w-full space-y-5">
      <p className="text-center text-[11px] font-bold uppercase tracking-[0.22em] text-gold/80">
        Use this coupon code at checkout
      </p>

      <button
        type="button"
        onClick={copy}
        aria-label="Copy coupon code"
        className={cn(
          "group relative flex w-full items-stretch overflow-hidden rounded-xl border-2 border-dashed transition-all",
          copied
            ? "border-emerald-400/60 bg-emerald-400/5"
            : "border-gold/50 bg-gold/5 hover:border-gold hover:bg-gold/10"
        )}
      >
        <span className="flex flex-1 items-center justify-center px-4 py-7 font-mono text-2xl font-bold tracking-[0.12em] text-foreground md:text-3xl">
          {couponCode}
        </span>
        <span
          className={cn(
            "flex shrink-0 items-center gap-2 px-6 text-[11px] font-bold uppercase tracking-[0.18em] transition-colors",
            copied
              ? "bg-emerald-400/90 text-navy"
              : "bg-gold text-navy group-hover:bg-gold-light"
          )}
        >
          {copied ? (
            <>
              <Check className="size-4" /> Copied
            </>
          ) : (
            <>
              <Copy className="size-4" /> Copy
              <br className="md:hidden" /> code
            </>
          )}
        </span>
      </button>

      <div className="flex flex-col items-center gap-2">
        <Link
          href={`/redeem/${slug}`}
          className="group inline-flex items-center gap-1.5 text-sm font-semibold text-gold underline-offset-4 hover:text-gold-light hover:underline"
        >
          Go to {storeName}
          <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
        {verified && (
          <div className="flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <span className="size-1.5 rounded-full bg-emerald-400" /> Verified
            </span>
            <span className="text-border">•</span>
            <span>All users</span>
          </div>
        )}
      </div>
    </div>
  );
}
