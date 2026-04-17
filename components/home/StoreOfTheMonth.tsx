import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Crown, Ticket, Tag } from "lucide-react";
import transformPath from "@/utils/transformImagePath";

type Props = {
  store: {
    id: number;
    storeName: string;
    slug: string;
    image: string;
    storeURL: string;
    category?: { categoryName: string; slug: string } | null;
    offers: Array<{ id: number; offerType: string }>;
  };
};

export default function StoreOfTheMonth({ store }: Props) {
  const couponCount = store.offers.filter((o) => o.offerType === "coupon").length;
  const dealCount = store.offers.length - couponCount;

  return (
    <section className="mx-auto w-full max-w-[1400px] px-4 py-8">
      <Link
        href={`/stores/${store.slug}`}
        className="group relative block overflow-hidden rounded-2xl border border-gold/40 bg-gradient-to-br from-navy via-navy-mid to-navy shadow-xl transition-all hover:shadow-2xl"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(212,175,55,0.25),transparent_60%)]" />
        <div className="relative flex flex-col gap-6 px-6 py-8 md:flex-row md:items-center md:gap-10 md:px-10 md:py-10">
          <div className="flex size-24 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white shadow-lg md:size-32">
            <Image
              src={transformPath(store.image, 320)}
              alt={`${store.storeName} logo`}
              width={140}
              height={80}
              className="max-h-[72px] w-auto max-w-[75%] object-contain md:max-h-[96px]"
            />
          </div>

          <div className="flex-1">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-gold/50 bg-gold/15 px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-[0.16em] text-gold">
              <Crown className="size-3" />
              Store of the Month
            </div>
            <h2 className="mt-2 text-2xl font-bold text-white md:text-3xl">
              {store.storeName}
            </h2>
            {store.category && (
              <p className="mt-1 text-[13px] text-white/60">
                {store.category.categoryName}
              </p>
            )}
            <div className="mt-4 flex flex-wrap gap-2">
              {couponCount > 0 && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[12px] text-white/80">
                  <Ticket className="size-3.5 text-gold" />
                  <span className="font-semibold text-white">{couponCount}</span>
                  coupons
                </span>
              )}
              {dealCount > 0 && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[12px] text-white/80">
                  <Tag className="size-3.5 text-gold" />
                  <span className="font-semibold text-white">{dealCount}</span>
                  deals
                </span>
              )}
            </div>
          </div>

          <div className="shrink-0">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-gold px-5 py-2 text-[13px] font-bold text-navy transition-all group-hover:gap-2.5">
              View all offers
              <ArrowRight className="size-4" />
            </div>
          </div>
        </div>
      </Link>
    </section>
  );
}
