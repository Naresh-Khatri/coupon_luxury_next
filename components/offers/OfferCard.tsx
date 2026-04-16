"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowUpRight, Copy, Check, Clock, Tag } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import transformPath from "@/utils/transformImagePath";

export type OfferCardData = {
  id: number | string;
  slug: string;
  title: string;
  couponCode?: string | null;
  offerType: string;
  discountType?: string | null;
  discountValue?: number | null;
  endDate?: string | null;
  store: { storeName: string; slug: string; image: string };
};

function formatDiscount(o: OfferCardData): string | null {
  if (!o.discountValue) return null;
  return o.discountType === "flat"
    ? `${o.discountValue} OFF`
    : `${o.discountValue}% OFF`;
}

function formatEnd(d?: string | null): string | null {
  if (!d) return null;
  const date = new Date(d);
  if (Number.isNaN(date.getTime())) return null;
  const diff = Math.ceil((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  if (diff < 0) return "Expired";
  if (diff === 0) return "Ends today";
  if (diff === 1) return "Ends tomorrow";
  if (diff <= 7) return `Ends in ${diff} days`;
  return `Valid till ${date.toLocaleDateString("en", { month: "short", day: "numeric" })}`;
}

export default function OfferCard({ offer }: { offer: OfferCardData }) {
  const [copied, setCopied] = useState(false);
  const discount = formatDiscount(offer);
  const ends = formatEnd(offer.endDate);
  const isCoupon = offer.offerType === "coupon" && offer.couponCode;

  const copyCode = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!offer.couponCode) return;
    try {
      await navigator.clipboard.writeText(offer.couponCode);
      setCopied(true);
      toast.success("Code copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Couldn't copy — please copy manually");
    }
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.35, ease: "easeOut" as const }}
      whileHover={{ y: -4 }}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-200/80 bg-white shadow-sm transition-shadow hover:shadow-xl hover:shadow-black/5"
    >
      {/* Discount ribbon */}
      {discount && (
        <div className="absolute right-3 top-3 z-10">
          <div className="rounded-full bg-gradient-to-br from-gold to-gold-light px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-navy shadow-md">
            {discount}
          </div>
        </div>
      )}

      <Link
        href={`/stores/${offer.store.slug}`}
        className="flex h-[140px] items-center justify-center overflow-hidden border-b border-gray-100 bg-gradient-to-br from-gray-50 to-gray-100/60 transition-colors group-hover:from-white group-hover:to-cream"
      >
        <Image
          src={transformPath(offer.store.image, 320)}
          alt={offer.store.storeName}
          width={160}
          height={80}
          className="max-h-[68px] w-auto max-w-[60%] object-contain transition-transform duration-500 group-hover:scale-105"
        />
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <Link
          href={`/stores/${offer.store.slug}`}
          className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.14em] text-brand-900 transition-colors hover:text-brand-1000"
        >
          {offer.store.storeName}
        </Link>

        <Link href={`/deals/${offer.slug}`} className="group/title">
          <h3 className="line-clamp-2 min-h-[2.4em] text-[13.5px] font-semibold leading-snug text-gray-900 transition-colors group-hover/title:text-brand-900 lg:text-[14.5px]">
            {offer.title}
          </h3>
        </Link>

        {ends && (
          <div className="mt-auto flex items-center gap-1 text-[11px] text-gray-500">
            <Clock className="size-3" />
            <span>{ends}</span>
          </div>
        )}

        <div className="mt-1 pt-1">
          {isCoupon ? (
            <button
              type="button"
              onClick={copyCode}
              className={cn(
                "group/code flex w-full items-stretch overflow-hidden rounded-lg border-2 border-dashed transition-all",
                copied
                  ? "border-teal bg-teal/5"
                  : "border-gold/40 bg-gold/5 hover:border-gold hover:bg-gold/10"
              )}
            >
              <span className="flex flex-1 items-center justify-center px-2 py-2 font-mono text-[12px] font-bold uppercase tracking-wider text-navy">
                {offer.couponCode}
              </span>
              <span
                className={cn(
                  "flex items-center gap-1 px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-white transition-colors",
                  copied ? "bg-teal" : "bg-gold"
                )}
              >
                {copied ? (
                  <>
                    <Check className="size-3" /> Copied
                  </>
                ) : (
                  <>
                    <Copy className="size-3" /> Copy
                  </>
                )}
              </span>
            </button>
          ) : (
            <Link
              href={`/deals/${offer.slug}`}
              className="inline-flex w-full items-center justify-center gap-1 rounded-lg bg-navy py-2 text-[11px] font-bold uppercase tracking-wider text-white transition-all hover:bg-navy-mid hover:gap-1.5"
            >
              <Tag className="size-3" />
              View deal
              <ArrowUpRight className="size-3" />
            </Link>
          )}
        </div>
      </div>
    </motion.article>
  );
}
