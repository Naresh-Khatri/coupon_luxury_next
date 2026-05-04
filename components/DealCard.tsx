"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import transformPath from "@/utils/transformImagePath";

export default function DealCard({
  storeImg,
  storeName,
  storeSlug,
  dealSlug,
  title,
  code,
  type,
}: {
  affURL?: string;
  storeImg: string;
  storeName: string;
  storeSlug: string;
  dealSlug: string;
  code?: string | null;
  title: string;
  type?: string | null;
  endDate?: string | null;
  showValidTill?: boolean;
}) {
  const isCoupon = type === "coupon" || !!code;
  const eyebrow = isCoupon ? "Coupon\nCode" : "Best\nPrice";

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, ease: "easeOut" as const }}
      whileHover={{
        y: -4,
        transition: { duration: 0.2, ease: "easeOut" as const },
      }}
      className="group relative flex h-full w-full flex-col overflow-hidden rounded-2xl border border-border bg-card transition-colors hover:border-gold/40"
    >
      <div className="grid grid-cols-[minmax(84px,0.45fr)_1fr] gap-3 px-4 pt-4 pb-3">
        <div className="flex items-center justify-center border-r border-dashed border-border/80 pr-3">
          <span className="whitespace-pre-line text-center text-[12px] font-extrabold uppercase leading-[1.15] tracking-[0.14em] text-gold">
            {eyebrow}
          </span>
        </div>
        <Link
          href={`/deals/${dealSlug}`}
          className="block min-w-0"
          title={title}
        >
          <h3 className="line-clamp-3 text-[13.5px] font-medium leading-[1.35] text-foreground/90 group-hover:text-foreground">
            {title}
          </h3>
        </Link>
      </div>

      <div
        aria-hidden
        className="mx-4 border-t border-dashed border-border/70"
      />

      <div className="flex items-center justify-between gap-3 px-4 py-3">
        <Link
          href={`/stores/${storeSlug}`}
          className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-md bg-white p-1.5 ring-1 ring-black/5 transition-transform hover:scale-[1.04]"
          title={`Open ${storeName} store`}
        >
          <Image
            width={72}
            height={72}
            className="max-h-full w-auto max-w-full object-contain"
            alt={`${storeName} logo`}
            src={transformPath(storeImg, 160)}
          />
        </Link>

        <Link
          href={`/deals/${dealSlug}`}
          className="cta-shimmer group/cta inline-flex items-center gap-1.5 rounded-md border border-gold/30 bg-gold/10 px-3 py-1.5 text-[11.5px] font-bold uppercase tracking-[0.14em] text-gold transition-colors hover:border-gold/60 hover:bg-gold/15"
        >
          View Deal
          <ArrowUpRight className="size-3.5 transition-transform group-hover/cta:translate-x-0.5 group-hover/cta:-translate-y-0.5" />
        </Link>
      </div>
    </motion.article>
  );
}
