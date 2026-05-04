import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Crown, Tag, Ticket } from "lucide-react";
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
    <section className="mx-auto w-full max-w-[1200px] px-4 py-10">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-gold/40 bg-gold/10 px-2.5 py-0.5 text-[10.5px] font-bold uppercase tracking-[0.16em] text-gold">
            <Crown className="size-3" />
            Store of the Month
          </div>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            This month&rsquo;s top brand
          </h2>
        </div>
      </div>

      <Link
        href={`/stores/${store.slug}`}
        aria-label={`View all offers for ${store.storeName}`}
        className="group relative block overflow-hidden rounded-xl border border-border bg-card transition-all hover:-translate-y-0.5 hover:border-gold/40 hover:shadow-md"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(196,154,60,0.10),transparent_55%)]"
        />

        <div className="relative flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:gap-5 sm:p-5">
          <div className="relative flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-md border border-border bg-white/95 sm:size-20">
            <Image
              src={transformPath(store.image, 200)}
              alt={`${store.storeName} logo`}
              width={140}
              height={90}
              className="max-h-[78%] w-auto max-w-[85%] object-contain"
            />
          </div>

          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <h3 className="text-lg font-bold leading-tight text-foreground sm:text-xl">
              {store.storeName}
            </h3>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-muted-foreground">
              {store.category && <span>{store.category.categoryName}</span>}
              {store.category && (couponCount > 0 || dealCount > 0) && (
                <span className="text-border">·</span>
              )}
              {couponCount > 0 && (
                <span className="inline-flex items-center gap-1">
                  <Ticket className="size-3.5 text-gold" />
                  <span className="font-semibold text-foreground">{couponCount}</span>
                  coupons
                </span>
              )}
              {dealCount > 0 && (
                <span className="inline-flex items-center gap-1">
                  <Tag className="size-3.5 text-gold" />
                  <span className="font-semibold text-foreground">{dealCount}</span>
                  deals
                </span>
              )}
            </div>
          </div>

          <div className="shrink-0 self-start sm:self-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-gold px-4 py-2 text-[13px] font-bold text-navy transition-all group-hover:gap-2.5">
              View all offers
              <ArrowRight className="size-4" />
            </span>
          </div>
        </div>
      </Link>
    </section>
  );
}
