import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ChevronRight,
  Home as HomeIcon,
  ShieldCheck,
  Star,
} from "lucide-react";
import RecommendedStores from "@/components/RecommendedStores";
import StoreOffers from "./StoreOffers";
import StoreHowToUse from "./StoreHowToUse";
import StoreFaqs from "./StoreFaqs";
import SimilarStores from "./SimilarStores";
import StoreCodesSummary from "./StoreCodesSummary";
import {
  getStoreBySlug,
  getPublicStores,
  getSimilarStores,
} from "@/server/db/queries/stores";
import transformPath from "@/utils/transformImagePath";
import { breadcrumbJsonLd, renderJsonLd } from "@/lib/seo";

async function getData(slug: string) {
  const storeInfo = await getStoreBySlug(slug);
  if (!storeInfo) return null;
  const [featuredStores, similarStores] = await Promise.all([
    getPublicStores({ featured: true, limit: 8 }),
    getSimilarStores({
      categoryId: storeInfo.categoryId,
      excludeId: storeInfo.id,
      country: storeInfo.country,
      limit: 8,
    }),
  ]);
  return { storeInfo, featuredStores, similarStores };
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const data = await getData(params.slug);
  if (!data) return {};
  const { storeInfo } = data;
  const url = `https://www.couponluxury.com/stores/${storeInfo.slug}`;
  return {
    title: storeInfo.metaTitle ?? storeInfo.storeName,
    description: storeInfo.metaDescription ?? undefined,
    keywords: storeInfo.metaKeywords ?? undefined,
    alternates: { canonical: url },
    openGraph: {
      url,
      title: storeInfo.metaTitle ?? storeInfo.storeName,
      description: storeInfo.metaDescription ?? undefined,
    },
  };
}

function monthYear() {
  const d = new Date();
  return `${d.toLocaleString("default", { month: "long" })} ${d.getFullYear()}`;
}

export default async function StorePage(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const data = await getData(params.slug);
  if (!data) notFound();
  const { storeInfo, featuredStores, similarStores } = data;
  const howToUse = storeInfo.howToUse ?? [];
  const faqs = storeInfo.faqs ?? [];
  const faqJsonLd = faqs.length
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      }
    : null;
  const breadcrumb = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Stores", path: "/stores" },
    { name: storeInfo.storeName, path: `/stores/${storeInfo.slug}` },
  ]);

  const couponCount = storeInfo.offers.filter(
    (o) => o.offerType === "coupon"
  ).length;
  const dealCount = storeInfo.offers.length - couponCount;

  const lastVerifiedAt = storeInfo.offers.reduce<Date | null>((acc, o) => {
    if (!o.verifiedAt) return acc;
    const d = o.verifiedAt instanceof Date ? o.verifiedAt : new Date(o.verifiedAt);
    if (Number.isNaN(d.getTime())) return acc;
    return !acc || d > acc ? d : acc;
  }, null);
  const lastValidatedLabel = lastVerifiedAt
    ? lastVerifiedAt.toLocaleDateString("en", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : null;

  return (
    <div className="bg-cream">
      {/* Hero */}
      <section className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-[1280px] px-4 py-6 md:px-6 md:py-8">
          <nav
            aria-label="Breadcrumb"
            className="mb-4 flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.14em] text-gray-500"
          >
            <Link
              href="/"
              className="inline-flex items-center gap-1 transition-colors hover:text-brand-900"
            >
              <HomeIcon className="size-3" />
              Home
            </Link>
            <ChevronRight className="size-3 text-gray-300" />
            <Link
              href="/stores"
              className="transition-colors hover:text-brand-900"
            >
              Stores
            </Link>
            <ChevronRight className="size-3 text-gray-300" />
            <span className="text-navy">{storeInfo.storeName}</span>
          </nav>

          <div className="flex flex-col gap-5 md:flex-row md:items-center md:gap-6">
            <div className="flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm md:size-24">
              <Image
                src={transformPath(storeInfo.image, 240)}
                alt={`${storeInfo.storeName} logo`}
                width={120}
                height={120}
                priority
                className="max-h-[64px] w-auto max-w-[80%] object-contain md:max-h-[72px]"
              />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight text-navy md:text-3xl">
                  {storeInfo.storeName} Coupons &amp; Offers
                </h1>
                {storeInfo.category?.categoryName && (
                  <Link
                    href={`/categories/${storeInfo.category.slug}`}
                    className="inline-flex items-center gap-1 rounded-full border border-gold/40 bg-gold/10 px-2.5 py-0.5 text-[10.5px] font-medium uppercase tracking-[0.14em] text-navy transition-colors hover:bg-gold/20"
                  >
                    {storeInfo.category.categoryName}
                  </Link>
                )}
              </div>

              <p className="mt-2 text-[13px] text-gray-600">
                Best{" "}
                <span className="font-semibold text-navy">
                  {storeInfo.offers.length}
                </span>{" "}
                coupons &amp; offers
                {lastValidatedLabel ? (
                  <>
                    {" "}validated on{" "}
                    <span className="font-semibold text-navy">
                      {lastValidatedLabel}
                    </span>
                  </>
                ) : (
                  <> for {monthYear()}</>
                )}
              </p>

              <div className="mt-3 flex flex-wrap items-center gap-4">
                <div className="inline-flex items-center gap-1.5">
                  <Stars value={4.5} />
                  <span className="text-[12px] font-medium text-gray-600">
                    4.5 &middot; Rate this store
                  </span>
                </div>
                <span className="inline-flex items-center gap-1 text-[12px] text-gray-500">
                  <Pill>{couponCount} Coupons</Pill>
                  <Pill>{dealCount} Deals</Pill>
                </span>
                {lastValidatedLabel && (
                  <span className="inline-flex items-center gap-1 text-[11.5px] font-medium text-emerald-600">
                    <ShieldCheck className="size-3.5" />
                    Verified today
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Body */}
      <div className="mx-auto max-w-[1280px] px-4 py-8 md:px-6">
        <StoreOffers
          offers={
            storeInfo.offers as React.ComponentProps<typeof StoreOffers>["offers"]
          }
          store={{
            storeName: storeInfo.storeName,
            slug: storeInfo.slug,
            image: storeInfo.image,
          }}
        />

        {storeInfo.offers.length > 0 && (
          <div className="mt-12">
            <StoreCodesSummary
              offers={storeInfo.offers}
              storeName={storeInfo.storeName}
            />
          </div>
        )}

        {howToUse.length > 0 && (
          <div className="mt-12">
            <StoreHowToUse steps={howToUse} storeName={storeInfo.storeName} />
          </div>
        )}

        {storeInfo.pageHTML?.trim() && (
          <section className="mt-12 overflow-hidden rounded-2xl border border-gray-200 bg-white">
            <div className="border-b border-gray-100 px-6 py-4 md:px-8">
              <h2 className="text-[14px] font-bold text-navy">
                About {storeInfo.storeName}
              </h2>
            </div>
            <div
              className="page-html px-6 py-6 md:px-8 md:py-8"
              dangerouslySetInnerHTML={{ __html: storeInfo.pageHTML }}
            />
          </section>
        )}

        {faqs.length > 0 && (
          <div className="mt-12">
            <StoreFaqs faqs={faqs} storeName={storeInfo.storeName} />
          </div>
        )}

        {similarStores.length > 0 && (
          <div className="mt-12">
            <SimilarStores
              stores={similarStores}
              categoryName={storeInfo.category?.categoryName}
            />
          </div>
        )}

        {featuredStores.length > 0 && (
          <div className="mt-12">
            <RecommendedStores stores={featuredStores} />
          </div>
        )}
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: renderJsonLd(breadcrumb) }}
      />
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: renderJsonLd(faqJsonLd) }}
        />
      )}
    </div>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-white px-2.5 py-0.5 text-[11.5px] font-medium text-gray-700">
      {children}
    </span>
  );
}

function Stars({ value }: { value: number }) {
  const full = Math.floor(value);
  const half = value - full >= 0.5;
  return (
    <span className="inline-flex items-center">
      {Array.from({ length: 5 }).map((_, i) => {
        const filled = i < full || (i === full && half);
        return (
          <Star
            key={i}
            className={
              filled
                ? "size-3.5 fill-gold text-gold"
                : "size-3.5 fill-gray-200 text-gray-200"
            }
          />
        );
      })}
    </span>
  );
}
