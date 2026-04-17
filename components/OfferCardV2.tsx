"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import {
  ChevronDown,
  ChevronUp,
  Info,
  CheckCircle2,
  Flame,
  ShieldCheck,
} from "lucide-react";

type OfferDetails = {
  id?: number;
  title: string;
  couponCode: string;
  affURL: string;
  slug: string;
  discountType: "percentage" | string;
  discountValue: string | number;
  description: string;
  TnC: string;
  image: string;
  endDate: string;
  offerType: "coupon" | "deal";
  fromPage?: "stores" | "categories";
  storeName: string;
  uses?: number | null;
  verifiedAt?: Date | string | null;
  store?: { slug: string; image: string };
};

function formatVerified(v?: Date | string | null): string | null {
  if (!v) return null;
  const d = v instanceof Date ? v : new Date(v);
  if (Number.isNaN(d.getTime())) return null;
  const days = Math.floor((Date.now() - d.getTime()) / (1000 * 60 * 60 * 24));
  if (days <= 0) return "Verified today";
  if (days === 1) return "Verified yesterday";
  if (days <= 7) return `Verified ${days}d ago`;
  return `Verified ${d.toLocaleDateString("en", { month: "short", day: "numeric" })}`;
}

export default function OfferCardV2({
  offerDetails,
}: {
  offerDetails: OfferDetails;
}) {
  const {
    title,
    slug,
    discountType,
    discountValue,
    TnC,
    endDate,
    offerType,
    fromPage,
    uses,
    verifiedAt,
  } = offerDetails;
  const [isOpen, setIsOpen] = useState(false);
  const usesCount = uses ?? 0;
  const verified = formatVerified(verifiedAt);

  return (
    <div
      onClick={() => setIsOpen((v) => !v)}
      className="rounded-[15px] bg-card border border-border transition-all duration-100 hover:-translate-y-2 hover:scale-[1.02]"
    >
      <div className="flex h-[160px]">
        <div className="flex h-full items-center justify-center p-3">
          <div className="flex min-w-[70px] items-center justify-center">
            {fromPage === "categories" && offerDetails.store ? (
              <Link href={`/stores/${offerDetails.store.slug}`}>
                <div className="hidden sm:flex">
                  <Image
                    src={offerDetails.store.image}
                    alt="logo"
                    width={140}
                    height={70}
                  />
                </div>
                <div className="flex sm:hidden">
                  <Image
                    src={offerDetails.store.image}
                    alt="logo"
                    width={100}
                    height={50}
                  />
                </div>
              </Link>
            ) : (
              <div className="banner-bg flex size-[100px] items-center justify-center rounded-[15px] p-2 text-center text-3xl font-extrabold leading-none text-white">
                {discountType === "percentage"
                  ? `${discountValue}% OFF`
                  : `$${discountValue}`}
              </div>
            )}
          </div>
        </div>
        <div className="flex w-full flex-col justify-between p-3 sm:flex-row sm:p-5">
          <div>
            <p className="line-clamp-2 text-base font-semibold leading-[1.4] sm:text-[1.375rem]">
              {title}
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 text-green-500">
                <CheckCircle2 className="size-4" />
                <span className="text-[13px] text-foreground/80 sm:text-sm">
                  valid Till: <span className="text-green-400">{endDate}</span>
                </span>
              </div>
              {usesCount > 0 && (
                <div className="flex items-center gap-1 rounded-full bg-gold/10 px-2 py-0.5 text-[11px] font-semibold text-navy">
                  <Flame className="size-3 text-gold" />
                  <span>
                    Used {usesCount.toLocaleString()}
                    {usesCount >= 1000 ? "+" : ""}
                  </span>
                </div>
              )}
              {verified && (
                <div className="flex items-center gap-1 text-[11px] font-medium text-emerald-600">
                  <ShieldCheck className="size-3.5" />
                  <span>{verified}</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex w-[170px] items-center justify-end">
            {offerType === "coupon" ? (
              <Link
                href={`/deals/${slug}`}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  className="inline-flex h-9 items-center justify-center rounded-md bg-brand-900 px-7 text-white shadow-lg transition-colors hover:bg-brand-800 sm:h-12"
                >
                  Get Code
                </button>
              </Link>
            ) : (
              <Link
                href={`/redeem/${slug}`}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  className="inline-flex h-9 items-center justify-center rounded-md bg-brand-900 px-7 text-white shadow-lg transition-colors hover:bg-brand-800 sm:h-12"
                >
                  Get Deal
                </button>
              </Link>
            )}
          </div>
        </div>
      </div>
      <button
        type="button"
        className="flex w-full items-center justify-between rounded-b-[15px] bg-card border-t border-border px-4 py-2 text-sm font-normal text-foreground/80"
      >
        <span className="flex items-center">
          {isOpen ? (
            <ChevronUp className="size-6" />
          ) : (
            <ChevronDown className="size-6" />
          )}
          <span className="ml-10 text-[14px] font-medium">Show Details</span>
        </span>
        <Info className="size-4" />
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="rounded-md px-10 pb-5 shadow-md bg-muted">
              <div
                className="page-html mt-4 text-foreground/80"
                dangerouslySetInnerHTML={{ __html: TnC }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
