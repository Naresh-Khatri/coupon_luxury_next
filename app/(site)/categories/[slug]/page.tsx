import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, Sparkles } from "lucide-react";
import CategoryFilter from "./CategoryFilter";
import {
  getCategoryBySlug,
} from "@/server/db/queries/categories";
import { getPublicStores } from "@/server/db/queries/stores";
import { getSelectedCountry } from "@/lib/country";
import { breadcrumbJsonLd, renderJsonLd } from "@/lib/seo";

async function getData(slug: string, country: string | null) {
  const [categoryInfo, featuredStores] = await Promise.all([
    getCategoryBySlug(slug, country),
    getPublicStores({ featured: true, country }),
  ]);
  if (!categoryInfo) return null;
  return { categoryInfo, featuredStores };
}

export async function generateMetadata(
  props: {
    params: Promise<{ slug: string }>;
  }
): Promise<Metadata> {
  const params = await props.params;
  const country = await getSelectedCountry();
  const data = await getData(params.slug, country);
  if (!data) return {};
  const { categoryInfo } = data;
  const url = `https://www.couponluxury.com/categories/${categoryInfo.slug}`;
  return {
    title: categoryInfo.metaTitle ?? categoryInfo.categoryName,
    description: categoryInfo.metaDescription ?? undefined,
    keywords: categoryInfo.metaKeywords ?? undefined,
    alternates: { canonical: url },
  };
}

function getMonthAndYear() {
  const d = new Date();
  return `${d.toLocaleString("default", { month: "long" })} ${d.getFullYear()}`;
}

function formatToday() {
  return new Date().toLocaleDateString("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default async function CategoryPage(
  props: {
    params: Promise<{ slug: string }>;
  }
) {
  const params = await props.params;
  const country = await getSelectedCountry();
  const data = await getData(params.slug, country);
  if (!data) notFound();
  const { categoryInfo, featuredStores } = data;
  const breadcrumb = breadcrumbJsonLd([
    { name: "Home", path: "/" },
    { name: "Categories", path: "/categories" },
    { name: categoryInfo.categoryName, path: `/categories/${categoryInfo.slug}` },
  ]);

  const offerCount = categoryInfo.offers?.length ?? 0;
  const couponCount =
    categoryInfo.offers?.filter((o: any) => o.offerType === "coupon").length ?? 0;

  return (
    <main className="relative overflow-hidden bg-background pb-16">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[380px] bg-[radial-gradient(ellipse_at_20%_0%,rgba(196,154,60,0.14),transparent_55%)]"
      />

      <div className="relative mx-auto w-full max-w-[1200px] px-4 py-6 md:py-8">
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-1.5 text-[12.5px] text-muted-foreground"
        >
          <Link href="/" className="hover:text-gold">
            Home
          </Link>
          <ChevronRight className="size-3 text-border" />
          <Link href="/categories" className="hover:text-gold">
            Categories
          </Link>
          <ChevronRight className="size-3 text-border" />
          <span className="text-foreground/80">{categoryInfo.categoryName}</span>
        </nav>

        <section className="relative mt-5 overflow-hidden rounded-2xl border border-border bg-card p-6 md:p-8">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(196,154,60,0.12),transparent_55%)]"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-gold/60 via-gold/30 to-transparent"
          />
          <div className="relative">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-[10.5px] font-bold uppercase tracking-[0.2em] text-gold">
              <Sparkles className="size-3" />
              {getMonthAndYear()}
            </span>
            <h1 className="mt-3 text-2xl font-semibold leading-[1.15] text-foreground md:text-[34px]">
              {categoryInfo.categoryName} Coupons &amp; Deals
            </h1>
            <p className="mt-2 text-[13.5px] text-muted-foreground">
              Best{" "}
              <span className="font-semibold text-foreground/90">
                {offerCount}
              </span>{" "}
              offers — last validated on {formatToday()}
              <span className="mx-2 text-border">•</span>
              <span className="font-medium text-foreground/80">
                {couponCount} coupons
              </span>{" "}
              ·{" "}
              <span className="font-medium text-foreground/80">
                {offerCount - couponCount} deals
              </span>
            </p>
          </div>
        </section>

        <CategoryFilter
          categoryInfo={categoryInfo}
          featuredStores={featuredStores}
          className="mt-6"
        />
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: renderJsonLd(breadcrumb) }}
      />
    </main>
  );
}
