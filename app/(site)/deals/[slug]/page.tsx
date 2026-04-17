import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, ChevronRight, ShieldCheck, Tag } from "lucide-react";
import DealCard from "@/components/DealCard";
import DealCTA from "./DealCTA";
import CouponReveal from "./CouponReveal";
import { getOfferBySlug, getPublicOffers } from "@/server/db/queries/offers";
import { breadcrumbJsonLd, offerJsonLd, renderJsonLd, SITE_URL } from "@/lib/seo";
import transformPath from "@/utils/transformImagePath";

async function getData(slug: string) {
  const dealInfo = await getOfferBySlug(slug);
  if (!dealInfo) return null;
  const recs = await getPublicOffers({
    offerType: "deal",
    categoryId: dealInfo.categoryId,
    featured: true,
    limit: 20,
  });
  const recommendedDeals = recs.filter((d) => d.id !== dealInfo.id);
  return { dealInfo, recommendedDeals };
}

export async function generateMetadata(
  props: {
    params: Promise<{ slug: string }>;
  }
): Promise<Metadata> {
  const params = await props.params;
  const data = await getData(params.slug);
  if (!data) return {};
  const { dealInfo } = data;
  const url = `https://www.couponluxury.com/deals/${dealInfo.slug}`;
  return {
    title: dealInfo.title,
    description: dealInfo.metaDescription ?? undefined,
    alternates: { canonical: url },
    openGraph: {
      url,
      title: dealInfo.title,
      description: dealInfo.metaDescription ?? undefined,
    },
  };
}

export default async function DealPage(
  props: {
    params: Promise<{ slug: string }>;
  }
) {
  const params = await props.params;
  const data = await getData(params.slug);
  if (!data) notFound();
  const { dealInfo, recommendedDeals } = data;
  const { store, affURL, title } = dealInfo;
  const isCoupon = dealInfo.offerType === "coupon" && !!dealInfo.couponCode;
  const dealUrl = `${SITE_URL}/deals/${dealInfo.slug}`;
  const breadcrumb = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Deals", path: "/deals" },
    { name: store.storeName, path: `/stores/${store.slug}` },
    { name: dealInfo.title, path: `/deals/${dealInfo.slug}` },
  ]);
  const offerLd = offerJsonLd({
    name: dealInfo.title,
    description: dealInfo.metaDescription ?? null,
    url: dealUrl,
    priceSpecification:
      dealInfo.discountValue != null
        ? {
            discount: dealInfo.discountValue,
            discountType:
              dealInfo.discountType === "percentage" ? "percentage" : "flat",
          }
        : undefined,
    validFrom: dealInfo.startDate,
    validThrough: dealInfo.endDate,
    seller: {
      name: store.storeName,
      url: store.storeURL ?? undefined,
      logo: store.image,
    },
  });

  const discountLabel =
    dealInfo.discountValue != null
      ? dealInfo.discountType === "percentage"
        ? `${dealInfo.discountValue}% OFF`
        : `${dealInfo.discountValue} OFF`
      : isCoupon
      ? "Coupon code"
      : "Best price";

  const sidebarDeals = recommendedDeals.slice(0, 4);

  return (
    <>
      <div
        hidden
        dangerouslySetInnerHTML={{ __html: dealInfo.description }}
      />

      <main className="relative overflow-hidden bg-background">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-[radial-gradient(ellipse_at_top,rgba(196,154,60,0.18),transparent_60%)]"
        />

        <div className="relative mx-auto w-full max-w-[1200px] px-4 py-6 md:py-10">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center justify-between gap-2 text-[12.5px] text-muted-foreground"
          >
            <Link
              href="/deals"
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card/60 px-3 py-1.5 font-medium text-foreground/80 transition-colors hover:border-gold/40 hover:text-gold"
            >
              <ChevronLeft className="size-3.5" />
              Back to deals
            </Link>
            <ol className="hidden items-center gap-1.5 sm:flex">
              <li>
                <Link href="/" className="hover:text-gold">
                  Home
                </Link>
              </li>
              <ChevronRight className="size-3 text-border" />
              <li>
                <Link href="/deals" className="hover:text-gold">
                  Deals
                </Link>
              </li>
              <ChevronRight className="size-3 text-border" />
              <li>
                <Link
                  href={`/stores/${store.slug}`}
                  className="hover:text-gold"
                >
                  {store.storeName}
                </Link>
              </li>
              <ChevronRight className="size-3 text-border" />
              <li className="max-w-[240px] truncate text-foreground/80">
                {dealInfo.title}
              </li>
            </ol>
          </nav>

          <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
            <section className="relative overflow-hidden rounded-2xl border border-border bg-card">
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(196,154,60,0.10),transparent_55%)]"
              />
              <div className="relative grid gap-6 p-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:gap-10 md:p-10">
                <div className="flex flex-col items-start gap-5">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-[10.5px] font-bold uppercase tracking-[0.2em] text-gold">
                    <Tag className="size-3" />
                    {discountLabel}
                  </span>

                  <div className="flex items-center gap-4">
                    <div className="flex size-16 shrink-0 items-center justify-center rounded-xl bg-white p-2 shadow-[0_8px_24px_-12px_rgba(0,0,0,0.8)]">
                      <Image
                        src={transformPath(store.image, 240)}
                        alt={`${store.storeName} logo`}
                        width={56}
                        height={56}
                        className="max-h-full w-auto max-w-full object-contain"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                        {store.storeName}
                      </p>
                      <p className="mt-1 text-[11px] text-muted-foreground/80">
                        {isCoupon
                          ? "Copy the code and apply at checkout"
                          : "No coupon code required"}
                      </p>
                    </div>
                  </div>

                  <h1 className="text-2xl font-semibold leading-[1.2] text-foreground md:text-3xl">
                    {title}
                  </h1>

                  {dealInfo.verifiedAt && (
                    <div className="flex items-center gap-1.5 text-[12.5px] text-emerald-400/90">
                      <ShieldCheck className="size-4" />
                      <span>Verified by CouponLuxury</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center">
                  {isCoupon ? (
                    <CouponReveal
                      slug={dealInfo.slug}
                      couponCode={dealInfo.couponCode!}
                      storeName={store.storeName}
                      storeURL={store.storeURL}
                      verified={!!dealInfo.verifiedAt}
                    />
                  ) : (
                    <DealCTA affURL={affURL} />
                  )}
                </div>
              </div>

              {dealInfo.TnC && (
                <div className="relative border-t border-border bg-background/40 p-6 md:p-10">
                  <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-gold/80">
                    Terms &amp; Conditions
                  </h2>
                  <div
                    className="page-html mt-3 text-sm leading-relaxed text-foreground/80"
                    dangerouslySetInnerHTML={{ __html: dealInfo.TnC }}
                  />
                </div>
              )}
            </section>

            {sidebarDeals.length > 0 && (
              <aside className="lg:sticky lg:top-24 lg:self-start">
                <div className="rounded-2xl border border-border bg-card p-5">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-gold/80">
                      Related Coupons
                    </h3>
                    <span className="h-px flex-1 ml-3 bg-gradient-to-r from-gold/30 to-transparent" />
                  </div>
                  <ul className="divide-y divide-border">
                    {sidebarDeals.map((deal) => (
                      <li key={deal.id}>
                        <Link
                          href={`/deals/${deal.slug}`}
                          className="group block py-3 first:pt-0 last:pb-0"
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-white p-1.5">
                              <Image
                                src={transformPath(deal.store.image, 160)}
                                alt={deal.store.storeName}
                                width={32}
                                height={32}
                                className="max-h-full w-auto max-w-full object-contain"
                              />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-[10.5px] font-semibold uppercase tracking-[0.16em] text-gold/80">
                                {deal.store.storeName}
                              </p>
                              <p className="mt-0.5 line-clamp-2 text-[13px] font-medium leading-snug text-foreground/90 group-hover:text-gold">
                                {deal.title}
                              </p>
                            </div>
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </aside>
            )}
          </div>

          {recommendedDeals.length > 0 && (
            <section className="mt-12">
              <div className="mb-6 flex items-end justify-between">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-gold/80">
                    Keep shopping
                  </p>
                  <h2 className="mt-1 text-xl font-semibold text-foreground md:text-2xl">
                    More deals you&apos;ll love
                  </h2>
                </div>
                <Link
                  href="/deals"
                  className="hidden text-[12.5px] font-medium text-muted-foreground hover:text-gold sm:block"
                >
                  View all →
                </Link>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {recommendedDeals.slice(0, 9).map((deal) => (
                  <DealCard
                    key={deal.id}
                    affURL={deal.affURL}
                    storeName={deal.store.storeName}
                    storeSlug={deal.store.slug}
                    dealSlug={deal.slug}
                    title={deal.title}
                    code={deal.couponCode || ""}
                    type={deal.offerType}
                    endDate={deal.endDate}
                    showValidTill={false}
                    storeImg={deal.store.image}
                  />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: renderJsonLd(breadcrumb) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: renderJsonLd(offerLd) }}
      />
    </>
  );
}
