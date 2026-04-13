import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, Home as HomeIcon, Store as StoreIcon, ShoppingBag } from "lucide-react";
import Banner from "@/components/Banner";
import RecommendedStores from "@/components/RecommendedStores";
import StoreFilter from "./StoreFilter";
import { domain } from "@/lib/lib";

type StoreInfo = {
  slug: string;
  storeName: string;
  image: string;
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string;
  metaSchema?: string;
  pageHTML: string;
  offers: Array<{
    id: string | number;
    offerType: "coupon" | "deal";
    [key: string]: any;
  }>;
};

async function getData(slug: string) {
  const [sRes, fRes] = await Promise.all([
    fetch(`${domain}/stores/getUsingSlug/${slug}`, {
      next: { revalidate: 60 },
    }),
    fetch(`${domain}/stores?featured=true&limit=16`, {
      next: { revalidate: 60 },
    }),
  ]);
  if (!sRes.ok) return null;
  const storeInfo: StoreInfo = await sRes.json();
  const featuredStores = fRes.ok ? await fRes.json() : [];
  return { storeInfo, featuredStores };
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const data = await getData(params.slug);
  if (!data) return {};
  const { storeInfo } = data;
  const url = `https://www.couponluxury.com/stores/${storeInfo.slug}`;
  return {
    title: storeInfo.metaTitle,
    description: storeInfo.metaDescription,
    keywords: storeInfo.keywords,
    alternates: { canonical: url },
    openGraph: { url, title: storeInfo.metaTitle, description: storeInfo.metaDescription },
  };
}

function getMonthAndYear() {
  const d = new Date();
  return `${d.toLocaleString("default", { month: "long" })} ${d.getFullYear()}`;
}

export default async function StorePage({
  params,
}: {
  params: { slug: string };
}) {
  const data = await getData(params.slug);
  if (!data) notFound();
  const { storeInfo, featuredStores } = data;

  return (
    <div className="bg-[#e0e0e0] pb-5">
      <Banner
        title={`${storeInfo.storeName} Coupons & Deals For ${getMonthAndYear()}`}
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
              <Link href="/stores" className="flex items-center gap-2 hover:text-teal">
                <StoreIcon className="size-4" /> Stores
              </Link>
              <ChevronRight className="size-4 text-gray-500" />
              <span className="flex items-center gap-2">
                <ShoppingBag className="size-4" /> {storeInfo.storeName}
              </span>
            </nav>
          </div>

          <div className="grid md:grid-cols-7">
            <aside className="col-span-7 px-4 md:col-span-2">
              <div className="rounded-xl bg-white">
                <Image
                  src={storeInfo.image}
                  alt={`${storeInfo.storeName} - Logo`}
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

            <StoreFilter
              storeInfo={storeInfo}
              className="col-span-5 px-4 pt-4 md:pt-0"
            />
          </div>

          <div
            className="page-html m-4 min-h-[100px] rounded-xl bg-white p-10"
            dangerouslySetInnerHTML={{ __html: storeInfo.pageHTML }}
          />
        </div>
      </div>
    </div>
  );
}
