import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, ArrowUpRight } from "lucide-react";
import { getPublicCategories } from "@/server/db/queries/categories";

export const metadata: Metadata = {
  title: "All Deals and discount Offers in different categories",
  description:
    "Shop on all categories using the latest luxury coupon codes and discount offers and grab the best deals on your order. Extra 20% off on different categories",
  alternates: { canonical: "https://www.couponluxury.com/categories" },
};

export default async function CategoriesPage() {
  const categories = await getPublicCategories();

  return (
    <main className="relative overflow-hidden bg-background pb-16">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[360px] bg-[radial-gradient(ellipse_at_30%_0%,rgba(196,154,60,0.14),transparent_55%)]"
      />

      <div className="relative mx-auto w-full max-w-[1200px] px-4 py-6 md:py-10">
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-1.5 text-[12.5px] text-muted-foreground"
        >
          <Link href="/" className="hover:text-gold">
            Home
          </Link>
          <ChevronRight className="size-3 text-border" />
          <span className="text-foreground/80">Categories</span>
        </nav>

        <header className="mt-6 max-w-2xl">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-gold/80">
            Browse everything
          </p>
          <h1 className="mt-2 text-3xl font-semibold leading-[1.1] text-foreground md:text-[44px]">
            All Categories
          </h1>
          <p className="mt-3 text-[14px] text-muted-foreground">
            {categories.length} curated categories. Find the one that fits your
            shopping and jump straight to verified coupons and deals.
          </p>
        </header>

        <ul className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => {
            const count = category.offers.length;
            return (
              <li key={category.id}>
                <Link
                  href={`/categories/${category.slug}`}
                  className="group relative flex h-full items-center justify-between gap-4 overflow-hidden rounded-xl border border-border bg-card px-5 py-4 transition-all hover:border-gold/40 hover:bg-card/80"
                >
                  <span
                    aria-hidden
                    className="pointer-events-none absolute left-0 top-0 h-full w-0.5 origin-top scale-y-0 bg-gradient-to-b from-gold to-gold/0 transition-transform duration-300 group-hover:scale-y-100"
                  />
                  <div className="min-w-0">
                    <h2 className="truncate text-[15px] font-semibold text-foreground group-hover:text-gold">
                      {category.categoryName}
                    </h2>
                    <p className="mt-0.5 text-[11.5px] text-muted-foreground">
                      <span className="font-medium text-foreground/70">
                        {count}
                      </span>{" "}
                      {count === 1 ? "offer" : "offers"} available
                    </p>
                  </div>
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors group-hover:border-gold/50 group-hover:text-gold">
                    <ArrowUpRight className="size-4" />
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </main>
  );
}
