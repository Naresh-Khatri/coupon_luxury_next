import type { Metadata } from "next";
import Link from "next/link";
import Banner from "@/components/Banner";
import { domain } from "@/lib/lib";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Sitemap - CouponLuxury",
  description: "The complete directory of everything we have on our website.",
  alternates: { canonical: "https://www.couponluxury.com/sitemap" },
};

type Category = {
  id: string | number;
  slug: string;
  categoryName: string;
  subCategories: Array<{ id: string | number; subCategoryName: string }>;
};

async function getData(): Promise<Category[]> {
  const res = await fetch(`${domain}/misc/sitemap`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) return [];
  return res.json();
}

export default async function SitemapPage() {
  const sitemapData = await getData();

  return (
    <>
      <h1 hidden>Sitemap - CouponLuxury</h1>
      <Banner title="Sitemap" subTitle="Your guide to CouponLuxury" />
      <div className="mx-auto w-full max-w-[1240px]">
        <div className="my-10 grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {sitemapData.map((category) => (
            <div
              key={category.id}
              className="h-fit rounded-xl p-5 shadow-xl transition-all duration-100 hover:scale-[1.02] hover:shadow-2xl"
            >
              <Link href={`/categories/${category.slug}`}>
                <p className="text-4xl transition-colors duration-100 hover:text-brand-900">
                  {category.categoryName}
                </p>
              </Link>
              {category.subCategories.map((subCat) => (
                <Link key={subCat.id} href="#" className="block">
                  <p className="pb-1">{subCat.subCategoryName}</p>
                </Link>
              ))}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
