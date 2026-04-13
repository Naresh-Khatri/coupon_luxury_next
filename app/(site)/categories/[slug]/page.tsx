import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, Home as HomeIcon, Box, ShoppingBag } from "lucide-react";
import Banner from "@/components/Banner";
import RecommendedStores from "@/components/RecommendedStores";
import CategoryFilter from "./CategoryFilter";
import { domain } from "@/lib/lib";

export const revalidate = 60;

type CategoryInfo = {
  slug: string;
  categoryName: string;
  image: string;
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string;
  offers: Array<{
    id: string | number;
    offerType: "coupon" | "deal";
    store?: { storeName: string };
    [key: string]: any;
  }>;
};

async function getData(slug: string) {
  const [cRes, fRes] = await Promise.all([
    fetch(`${domain}/categories/getUsingSlug/${slug}`, {
      next: { revalidate: 60 },
    }),
    fetch(`${domain}/stores?featured=true`, {
      next: { revalidate: 60 },
    }),
  ]);
  if (!cRes.ok) return null;
  const categoryInfo: CategoryInfo = await cRes.json();
  const featuredStores = fRes.ok ? await fRes.json() : [];
  return { categoryInfo, featuredStores };
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const data = await getData(params.slug);
  if (!data) return {};
  const { categoryInfo } = data;
  const url = `https://www.couponluxury.com/categories/${categoryInfo.slug}`;
  return {
    title: categoryInfo.metaTitle,
    description: categoryInfo.metaDescription,
    keywords: categoryInfo.keywords,
    alternates: { canonical: url },
  };
}

function getMonthAndYear() {
  const d = new Date();
  return `${d.toLocaleString("default", { month: "long" })} ${d.getFullYear()}`;
}

export default async function CategoryPage({
  params,
}: {
  params: { slug: string };
}) {
  const data = await getData(params.slug);
  if (!data) notFound();
  const { categoryInfo, featuredStores } = data;

  return (
    <div className="bg-[#e0e0e0] pb-5">
      <Banner
        title={`${categoryInfo.categoryName} Coupons & Deals For ${getMonthAndYear()}`}
        titleAsH1
      />
      <div className="flex flex-col items-center">
        <div className="w-screen max-w-[1200px]">
          <div className="p-4">
            <nav
              aria-label="Breadcrumb"
              className="flex items-center gap-2 rounded-xl bg-white p-4 text-sm font-semibold text-brand-900"
            >
              <Link href="/" className="flex items-center gap-2 hover:text-teal">
                <HomeIcon className="size-4" /> Home
              </Link>
              <ChevronRight className="size-4 text-gray-500" />
              <Link href="/categories" className="flex items-center gap-2 hover:text-teal">
                <Box className="size-4" /> Categories
              </Link>
              <ChevronRight className="size-4 text-gray-500" />
              <span className="flex items-center gap-2">
                <ShoppingBag className="size-4" /> {categoryInfo.categoryName}
              </span>
            </nav>
          </div>

          <div className="grid md:grid-cols-7">
            <aside className="col-span-7 px-4 md:col-span-2">
              <div className="rounded-xl bg-white">
                <Image
                  src={categoryInfo.image}
                  alt={`${categoryInfo.categoryName} - Logo`}
                  priority
                  width={200}
                  height={100}
                  className="w-full rounded-xl"
                />
              </div>
              <div className="hidden md:block">
                <RecommendedStores stores={featuredStores} />
              </div>
            </aside>
            <CategoryFilter
              categoryInfo={categoryInfo}
              className="col-span-5 px-4"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
