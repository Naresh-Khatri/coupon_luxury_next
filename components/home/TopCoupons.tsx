"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import transformPath from "@/utils/transformImagePath";

type Coupon = {
  id: string | number;
  slug: string;
  title: string;
  affURL: string;
  couponCode?: string | null;
  discountType: string;
  discountValue: number | string;
  offerType?: string;
  categoryId: number;
  endDate?: string;
  store: { id: string | number; storeName: string; slug: string; image: string };
};

type Category = {
  id: number;
  categoryName: string;
  slug: string;
};

const MAX_PER_TAB = 6;

function discountLabel(c: Coupon) {
  const v = c.discountValue;
  if (!v) return "SPECIAL OFFER";
  if (c.discountType === "percentage") return `UP TO ${v}% OFF`;
  return `$${v} OFF`;
}

export default function TopCoupons({
  coupons,
  categories,
}: {
  coupons: Coupon[];
  categories: Category[];
}) {
  const tabs = useMemo(() => {
    const counts = new Map<number, number>();
    for (const c of coupons)
      counts.set(c.categoryId, (counts.get(c.categoryId) ?? 0) + 1);
    const activeCats = categories
      .filter((c) => counts.get(c.id))
      .sort((a, b) => (counts.get(b.id) ?? 0) - (counts.get(a.id) ?? 0))
      .slice(0, 6);
    return [
      { id: 0, name: "Most Used" },
      ...activeCats.map((c) => ({ id: c.id, name: c.categoryName })),
    ];
  }, [coupons, categories]);

  const [active, setActive] = useState<number>(0);

  const visible = useMemo(() => {
    const list =
      active === 0 ? coupons : coupons.filter((c) => c.categoryId === active);
    return list.slice(0, MAX_PER_TAB);
  }, [coupons, active]);

  if (!coupons.length) return null;

  return (
    <section className="bg-background px-4 py-12 md:py-16">
      <div className="mx-auto max-w-[1200px]">
        <h2 className="mb-6 text-2xl font-bold tracking-tight text-foreground md:text-3xl">
          Today&apos;s Top Coupons &amp; Offers
        </h2>

        <div className="mb-6 flex flex-wrap gap-2">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setActive(t.id)}
              className={
                active === t.id
                  ? "rounded-full bg-gold px-4 py-1.5 text-[13px] font-semibold text-navy shadow-sm"
                  : "rounded-full border border-border bg-muted px-4 py-1.5 text-[13px] font-medium text-foreground/80 transition-colors hover:bg-white/5"
              }
            >
              {t.name}
            </button>
          ))}
        </div>

        <motion.div layout className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {visible.map((c) => (
            <motion.div
              key={c.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className="flex items-stretch overflow-hidden rounded-xl border border-border bg-card transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex w-[120px] shrink-0 items-center justify-center border-r border-border bg-muted px-3 py-4 text-center">
                <p className="text-[11px] font-bold uppercase leading-tight tracking-wide text-gold">
                  {discountLabel(c)}
                </p>
              </div>
              <div className="flex flex-1 items-center gap-3 px-4 py-3">
                <p className="line-clamp-2 flex-1 text-[14px] font-medium leading-snug text-foreground/90">
                  {c.title}
                </p>
              </div>
              <Link
                href={`/stores/${c.store.slug}`}
                className="flex w-[140px] shrink-0 flex-col items-center justify-center gap-1.5 border-l border-border bg-card px-2 py-3 text-center transition-colors hover:bg-white/5"
              >
                <Image
                  src={transformPath(c.store.image, 160)}
                  alt={`${c.store.storeName} logo`}
                  width={80}
                  height={32}
                  className="max-h-8 w-auto object-contain"
                />
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-gold">
                  View Coupons <ArrowRight className="size-3" />
                </span>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
