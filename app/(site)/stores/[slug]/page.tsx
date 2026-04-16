import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ChevronRight,
  ExternalLink,
  Home as HomeIcon,
  Ticket,
  Tag,
} from "lucide-react";
import RecommendedStores from "@/components/RecommendedStores";
import StoreOffers from "./StoreOffers";
import { getStoreBySlug, getPublicStores } from "@/server/db/queries/stores";
import transformPath from "@/utils/transformImagePath";

async function getData(slug: string) {
  const [storeInfo, featuredStores] = await Promise.all([
    getStoreBySlug(slug),
    getPublicStores({ featured: true, limit: 8 }),
  ]);
  if (!storeInfo) return null;
  return { storeInfo, featuredStores };
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

function hostFromUrl(url: string): string {
  try {
    return new URL(url).host.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export default async function StorePage(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;
  const data = await getData(params.slug);
  if (!data) notFound();
  const { storeInfo, featuredStores } = data;

  const couponCount = storeInfo.offers.filter(
    (o) => o.offerType === "coupon"
  ).length;
  const dealCount = storeInfo.offers.length - couponCount;

  return (
    <div className="bg-cream">
      {/* Hero */}
      <section className="banner-bg relative overflow-hidden">
        <div className="relative mx-auto max-w-[1280px] px-4 py-10 md:px-6 md:py-14">
          <nav
            aria-label="Breadcrumb"
            className="mb-6 flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.14em] text-white/70"
          >
            <Link
              href="/"
              className="inline-flex items-center gap-1 transition-colors hover:text-gold"
            >
              <HomeIcon className="size-3" />
              Home
            </Link>
            <ChevronRight className="size-3 text-white/40" />
            <Link
              href="/stores"
              className="transition-colors hover:text-gold"
            >
              Stores
            </Link>
            <ChevronRight className="size-3 text-white/40" />
            <span className="text-gold">{storeInfo.storeName}</span>
          </nav>

          <div className="flex flex-col gap-6 md:flex-row md:items-center md:gap-8">
            <div className="flex size-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/15 bg-white shadow-xl md:size-28">
              <Image
                src={transformPath(storeInfo.image, 240)}
                alt={`${storeInfo.storeName} logo`}
                width={120}
                height={120}
                priority
                className="max-h-[72px] w-auto max-w-[80%] object-contain md:max-h-[80px]"
              />
            </div>

            <div className="min-w-0 flex-1">
              {storeInfo.category?.categoryName && (
                <Link
                  href={`/categories/${storeInfo.category.slug}`}
                  className="inline-flex items-center gap-1 rounded-full border border-gold/40 bg-gold/10 px-2.5 py-0.5 text-[10.5px] font-medium uppercase tracking-[0.16em] text-gold transition-colors hover:bg-gold/20"
                >
                  {storeInfo.category.categoryName}
                </Link>
              )}
              <h1 className="mt-2 text-3xl font-bold tracking-tight text-white md:text-4xl">
                {storeInfo.storeName} Coupons & Deals
              </h1>
              <p className="mt-1 text-[13px] text-white/60">
                Updated for {monthYear()}
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <Stat icon={<Ticket className="size-3.5" />} label="Coupons" value={couponCount} />
                <Stat icon={<Tag className="size-3.5" />} label="Deals" value={dealCount} />
                {storeInfo.storeURL && (
                  <a
                    href={storeInfo.storeURL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full bg-gold px-3.5 py-1 text-[12px] font-semibold text-navy transition-colors hover:bg-gold-light"
                  >
                    Visit {hostFromUrl(storeInfo.storeURL)}
                    <ExternalLink className="size-3" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Offers */}
      <div className="mx-auto max-w-[1280px] px-4 py-8 md:px-6">
        <StoreOffers
          offers={storeInfo.offers as React.ComponentProps<typeof StoreOffers>["offers"]}
          store={{
            storeName: storeInfo.storeName,
            slug: storeInfo.slug,
            image: storeInfo.image,
          }}
        />

        {/* About */}
        {storeInfo.pageHTML?.trim() && (
          <section className="mt-12 overflow-hidden rounded-2xl border border-gray-200 bg-white">
            <div className="border-b border-gray-100 px-6 py-4 md:px-8">
              <h2 className="text-[11px] font-bold uppercase tracking-[0.18em] text-gray-500">
                About {storeInfo.storeName}
              </h2>
            </div>
            <div
              className="page-html px-6 py-6 md:px-8 md:py-8"
              dangerouslySetInnerHTML={{ __html: storeInfo.pageHTML }}
            />
          </section>
        )}

        {/* Recommended */}
        {featuredStores.length > 0 && (
          <div className="mt-12">
            <RecommendedStores stores={featuredStores} />
          </div>
        )}
      </div>
    </div>
  );
}

function Stat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[12px] text-white/80 backdrop-blur-sm">
      <span className="text-gold">{icon}</span>
      <span className="font-semibold text-white">{value}</span>
      <span className="text-white/60">{label}</span>
    </span>
  );
}
