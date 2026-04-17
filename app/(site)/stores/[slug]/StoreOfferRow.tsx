"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ChevronDown,
  ShieldCheck,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type StoreOfferRowData = {
  id: number | string;
  slug: string;
  title: string;
  description?: string | null;
  couponCode?: string | null;
  offerType: string;
  discountType?: string | null;
  discountValue?: number | null;
  endDate?: string | null;
  uses?: number | null;
  verifiedAt?: Date | string | null;
  featured?: boolean | null;
};

function formatEnd(d?: string | null): string | null {
  if (!d) return null;
  const date = new Date(d);
  if (Number.isNaN(date.getTime())) return null;
  const diff = Math.ceil((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  if (diff < 0) return "Expired";
  if (diff === 0) return "Ends today";
  if (diff === 1) return "1 day left";
  if (diff <= 60) return `${diff} days left`;
  return `Valid till ${date.toLocaleDateString("en", { month: "short", day: "numeric" })}`;
}

function discountParts(o: StoreOfferRowData): {
  prefix: string;
  value: string;
  suffix: string;
} {
  const v = o.discountValue;
  if (!v || v <= 0) {
    return { prefix: "", value: o.offerType === "coupon" ? "CODE" : "DEAL", suffix: "" };
  }
  if (o.discountType === "percentage") {
    return { prefix: "Up To", value: `${v}%`, suffix: "Off" };
  }
  return { prefix: "Flat", value: `₹${v.toLocaleString("en-IN")}`, suffix: "Off" };
}

export default function StoreOfferRow({
  offer,
  storeSlug,
}: {
  offer: StoreOfferRowData;
  storeSlug: string;
}) {
  const [expanded, setExpanded] = useState(false);

  const isCoupon = offer.offerType === "coupon" && !!offer.couponCode;
  const parts = discountParts(offer);
  const ends = formatEnd(offer.endDate);
  const uses = offer.uses ?? 0;
  const isVerified = !!offer.verifiedAt;
  const isExclusive = !!offer.featured;

  return (
    <article
      className={cn(
        "group relative overflow-hidden rounded-xl border bg-white transition-colors",
        isExclusive
          ? "border-emerald-400/70 ring-1 ring-emerald-300/50"
          : "border-gray-200 hover:border-gold/60"
      )}
    >
      {isExclusive && (
        <div className="absolute left-0 top-0 z-10 rounded-br-md bg-emerald-500 px-2 py-0.5 text-[9.5px] font-bold uppercase tracking-[0.14em] text-white">
          Exclusive
        </div>
      )}

      <div className="grid grid-cols-[96px_1fr] items-stretch md:grid-cols-[160px_1fr_auto]">
        {/* Discount badge */}
        <div
          className={cn(
            "flex flex-col items-center justify-center gap-0.5 border-r border-dashed border-gray-200 px-2 py-5 text-center",
            isExclusive ? "bg-emerald-50" : "bg-gold/5"
          )}
        >
          {parts.prefix && (
            <span className="text-[9.5px] font-semibold uppercase tracking-[0.14em] text-gray-500">
              {parts.prefix}
            </span>
          )}
          <span className="text-xl font-extrabold leading-none text-navy md:text-2xl">
            {parts.value}
          </span>
          {parts.suffix && (
            <span className="text-[9.5px] font-semibold uppercase tracking-[0.14em] text-gray-500">
              {parts.suffix}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="flex min-w-0 flex-col justify-center gap-1.5 px-4 py-4 md:py-5">
          <h3 className="text-[14.5px] font-semibold leading-snug text-navy md:text-[15.5px]">
            {offer.title}
          </h3>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11.5px] text-gray-500">
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              className="inline-flex items-center gap-1 font-medium text-brand-900 hover:text-brand-1000"
              aria-expanded={expanded}
            >
              Show Details
              <ChevronDown
                className={cn(
                  "size-3.5 transition-transform",
                  expanded && "rotate-180"
                )}
              />
            </button>

            {isVerified && (
              <span className="inline-flex items-center gap-1 text-emerald-600">
                <ShieldCheck className="size-3.5" />
                Verified
              </span>
            )}

            {uses > 0 && (
              <span className="inline-flex items-center gap-1">
                <Users className="size-3.5 text-gray-400" />
                {uses.toLocaleString()}
              </span>
            )}
          </div>

          {expanded && (
            <div className="mt-2 rounded-md border border-gray-100 bg-gray-50/60 px-3 py-2 text-[12.5px] leading-relaxed text-gray-700">
              {offer.description ? (
                <p className="whitespace-pre-line">{offer.description}</p>
              ) : (
                <p className="text-gray-500">
                  Click the button to activate this offer at checkout.
                </p>
              )}
              <Link
                href={isCoupon ? `/deals/${offer.slug}` : `/redeem/${offer.slug}`}
                className="mt-2 inline-block text-[12px] font-medium text-brand-900 hover:text-brand-1000"
              >
                View full offer details &rarr;
              </Link>
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="col-span-2 flex flex-col items-stretch gap-1.5 border-t border-gray-100 px-4 py-3 md:col-span-1 md:items-end md:justify-center md:border-l md:border-t-0 md:px-5">
          {isCoupon ? (
            <Link
              href={`/deals/${offer.slug}`}
              className="inline-flex items-center justify-center rounded-md bg-brand-900 px-6 py-2.5 text-[12px] font-bold uppercase tracking-wider text-white transition-colors hover:bg-brand-1000 md:min-w-[150px]"
            >
              Get Code
            </Link>
          ) : (
            <Link
              href={`/redeem/${offer.slug}`}
              className="inline-flex items-center justify-center rounded-md bg-brand-900 px-6 py-2.5 text-[12px] font-bold uppercase tracking-wider text-white transition-colors hover:bg-brand-1000 md:min-w-[150px]"
            >
              Get Deal
            </Link>
          )}
          {ends && (
            <span className="text-center text-[11px] text-gray-500 md:text-right">
              {ends}
            </span>
          )}
          <Link
            href={`/deals/${offer.slug}`}
            className="hidden text-[11px] text-gray-500 underline-offset-2 hover:text-brand-900 hover:underline md:block md:text-right"
          >
            More details
          </Link>
        </div>
      </div>
    </article>
  );
}
