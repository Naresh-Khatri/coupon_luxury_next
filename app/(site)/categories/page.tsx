import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, Home as HomeIcon, Box } from "lucide-react";
import Banner from "@/components/Banner";
import { domain } from "@/lib/lib";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "All Deals and discount Offers in different categories",
  description:
    "Shop on all categories using the latest luxury coupon codes and discount offers and grab the best deals on your order. Extra 20% off on different categories",
  alternates: { canonical: "https://www.couponluxury.com/categories" },
};

type Category = {
  id: string | number;
  slug: string;
  categoryName: string;
  image: string;
  imgAlt: string;
  offers: unknown[];
};

async function getData(): Promise<Category[]> {
  const res = await fetch(`${domain}/categories`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) return [];
  return res.json();
}

export default async function CategoriesPage() {
  const featuredCat = await getData();
  if (!featuredCat) notFound();

  return (
    <>
      <h1 hidden>
        Indulge in Luxury: Unlock Savings on Top Brands Across All Categories
      </h1>
      <h2 hidden>
        Find Your bold Style: Discover Exclusive Coupons and Deals for All
        Categories
      </h2>
      <Banner
        title="All Categories"
        subTitle={`${featuredCat.length} Categories available`}
      />
      <div className="flex justify-center bg-[#e0e0e0] pb-5">
        <div className="flex max-w-[1240px] flex-col items-center px-2">
          <nav
            aria-label="Breadcrumb"
            className="my-4 flex items-center gap-2 self-start text-sm font-semibold text-brand-900"
          >
            <Link href="/" className="flex items-center gap-2 hover:text-teal">
              <HomeIcon className="size-4" /> Home
            </Link>
            <ChevronRight className="size-4 text-gray-500" />
            <span className="flex items-center gap-2">
              <Box className="size-4" /> Categories
            </span>
          </nav>
          <div className="grid max-w-[1240px] grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {featuredCat.map((category) => (
              <Link
                key={category.id}
                href={`/categories/${category.slug}`}
                className="group relative block transition-all duration-100 hover:scale-[1.07] hover:opacity-90"
              >
                <Image
                  src={category.image}
                  width={350}
                  height={200}
                  alt={category.imgAlt}
                  className="rounded-xl brightness-50"
                />
                <div className="absolute inset-0 flex h-[200px] w-[350px] flex-col items-center justify-center">
                  <h4 className="text-center text-3xl font-extrabold text-white">
                    {category.categoryName}
                  </h4>
                  <p className="text-center text-white">
                    {`${category.offers.length} Deals / Coupons`}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
