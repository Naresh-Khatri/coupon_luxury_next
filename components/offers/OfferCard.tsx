"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import {
  ArrowUpRight,
  Clock,
  Tag,
  Flame,
  ShieldCheck,
  Share2,
  Ticket,
} from "lucide-react";
import { toast } from "sonner";
import transformPath from "@/utils/transformImagePath";
import { useActivateOffer } from "@/lib/useActivateOffer";

export type OfferCardData = {
  id: number | string;
  slug: string;
  title: string;
  affURL: string;
  couponCode?: string | null;
  offerType: string;
  discountType?: string | null;
  discountValue?: number | null;
  endDate?: string | null;
  uses?: number | null;
  verifiedAt?: Date | string | null;
  store: { storeName: string; slug: string; image: string };
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
  const discount = formatDiscount(offer);
  const ends = formatEnd(offer.endDate);
  const isCoupon = offer.offerType === "coupon" && !!offer.couponCode;
  const uses = offer.uses ?? 0;
  const verified = formatVerified(offer.verifiedAt);
  const activate = useActivateOffer();
  const offerNumericId =
    typeof offer.id === "number" ? offer.id : Number(offer.id);
  const handleActivate = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    activate({
      offerId: Number.isFinite(offerNumericId) ? offerNumericId : undefined,
      slug: offer.slug,
      affURL: offer.affURL,
      couponCode: isCoupon ? offer.couponCode : null,
    });
  };

  const shareOffer = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const url =
      typeof window !== "undefined"
        ? `${window.location.origin}/deals/${offer.slug}`
        : `/deals/${offer.slug}`;
    const shareData = {
      title: offer.title,
      text: `${offer.title} at ${offer.store.storeName}`,
      url,
    };
    try {
      if (navigator.share && navigator.canShare?.(shareData)) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(url);
        toast.success("Link copied");
      }
    } catch (err) {
      if ((err as Error).name === "AbortError") return;
      toast.error("Couldn't share — try copying the URL");
    }
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.35, ease: "easeOut" as const }}
      whileHover={{ y: -4 }}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-shadow hover:shadow-xl hover:shadow-black/20"
    >
      {/* Discount ribbon */}
      {discount && (
        <div className="absolute right-3 top-3 z-10">
          <div className="rounded-full bg-gradient-to-br from-gold to-gold-light px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-navy shadow-md">
            {discount}
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={shareOffer}
        aria-label="Share offer"
        className="absolute left-3 top-3 z-10 flex size-7 items-center justify-center rounded-full bg-card/90 text-muted-foreground opacity-0 shadow-sm backdrop-blur transition-all hover:bg-card hover:text-foreground group-hover:opacity-100"
      >
        <Share2 className="size-3.5" />
      </button>

      <Link
        href={`/stores/${offer.store.slug}`}
        className="flex h-[140px] items-center justify-center overflow-hidden border-b border-border bg-white/95 transition-colors"
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
          className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:text-gold"
        >
          {offer.store.storeName}
        </Link>

        <Link href={`/deals/${offer.slug}`} className="group/title">
          <h3 className="line-clamp-2 min-h-[2.4em] text-[13.5px] font-semibold leading-snug text-foreground transition-colors group-hover/title:text-gold lg:text-[14.5px]">
            {offer.title}
          </h3>
        </Link>

        {verified && (
          <div className="flex items-center gap-1 text-[10.5px] font-medium text-emerald-600">
            <ShieldCheck className="size-3" />
            <span>{verified}</span>
          </div>
        )}

        <div className="mt-auto flex items-center justify-between gap-2">
          {ends ? (
            <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
              <Clock className="size-3" />
              <span>{ends}</span>
            </div>
          ) : (
            <span />
          )}
          {uses > 0 && (
            <div className="flex items-center gap-1 rounded-full bg-gold/10 px-2 py-0.5 text-[10px] font-semibold text-gold">
              <Flame className="size-3 text-gold" />
              <span>
                Used {uses.toLocaleString()}
                {uses >= 1000 ? "+" : ""}
              </span>
            </div>
          )}
        </div>

        <div className="mt-1 pt-1">
          {isCoupon ? (
            <button
              type="button"
              onClick={handleActivate}
              className="group/code flex w-full items-stretch overflow-hidden rounded-lg border-2 border-dashed border-gold/40 bg-gold/5 transition-all hover:border-gold hover:bg-gold/10"
            >
              <span className="flex flex-1 items-center justify-center gap-1.5 px-2 py-2 font-mono text-[12px] font-bold uppercase tracking-wider text-foreground">
                <Ticket className="size-3.5 text-gold" />
                {(offer.couponCode ?? "").slice(0, 3)}
                <span className="tracking-[0.2em]">••••</span>
              </span>
              <span className="flex items-center gap-1 bg-gold px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-navy transition-colors">
                Show Code
                <ArrowUpRight className="size-3" />
              </span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleActivate}
              className="inline-flex w-full items-center justify-center gap-1 rounded-lg bg-muted py-2 text-[11px] font-bold uppercase tracking-wider text-foreground transition-all hover:bg-white/5 hover:gap-1.5"
            >
              <Tag className="size-3" />
              View deal
              <ArrowUpRight className="size-3" />
            </button>
          )}
        </div>
      </div>
    </motion.article>
  );
}
