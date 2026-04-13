import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import Banner from "@/components/Banner";
import DealCard from "@/components/DealCard";
import DealCTA from "./DealCTA";
import { domain } from "@/lib/lib";

export const revalidate = 60;

type Deal = {
  id: string | number;
  slug: string;
  title: string;
  description: string;
  affURL: string;
  metaTitle?: string;
  metaDescription?: string;
  metaSchema?: string;
  categoryId?: string | number;
  store: { storeName: string; slug: string; image: string };
  offerType: "coupon" | "deal";
  endDate: string;
  couponCode?: string;
};

async function getData(slug: string) {
  const res = await fetch(`${domain}/offers/getWithSlug/${slug}`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) return null;
  const dealInfo: Deal = await res.json();
  const rec = await fetch(
    `${domain}/offers?offerType=deal&categoryId=${dealInfo.categoryId}&featured=true&limit=20`,
    { next: { revalidate: 60 } }
  );
  let recommendedDeals: Deal[] = rec.ok ? await rec.json() : [];
  recommendedDeals = recommendedDeals.filter((d) => d.id !== dealInfo.id);
  return { dealInfo, recommendedDeals };
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const data = await getData(params.slug);
  if (!data) return {};
  const { dealInfo } = data;
  const url = `https://www.couponluxury.com/deals/${dealInfo.slug}`;
  return {
    title: dealInfo.title,
    description: dealInfo.metaDescription,
    alternates: { canonical: url },
    openGraph: { url, title: dealInfo.title, description: dealInfo.metaDescription },
  };
}

export default async function DealPage({
  params,
}: {
  params: { slug: string };
}) {
  const data = await getData(params.slug);
  if (!data) notFound();
  const { dealInfo, recommendedDeals } = data;
  const { store, affURL, title } = dealInfo;

  return (
    <>
      <div
        hidden
        dangerouslySetInnerHTML={{ __html: dealInfo.description }}
      />
      <Banner subTitle="*No coupon code required to avail this discount" />
      <section className="hero-bg flex justify-center">
        <div className="grid w-screen max-w-[1200px] grid-cols-1 md:grid-cols-2 md:w-[90vw] lg:w-[80vw]">
          <div className="flex flex-col items-center justify-center">
            <Image
              src={store.image}
              alt={`${store.storeName} - logo`}
              width={250}
              height={125}
            />
            <p className="mx-4 my-4 text-center text-xl font-semibold text-black md:mx-0 md:text-3xl">
              {title}
            </p>
          </div>
          <DealCTA affURL={affURL} />
        </div>
      </section>
      <div className="bg-[#f5f5f5] py-10">
        <h3 className="mb-10 text-center text-3xl font-extrabold text-brand-900 lg:text-5xl">
          Related Deals
        </h3>
        <div className="flex justify-center px-2">
          <div className="grid grid-cols-2 justify-center gap-2 sm:grid-cols-3 md:gap-5 lg:grid-cols-4 xl:grid-cols-5">
            {recommendedDeals.map((deal) => (
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
        </div>
      </div>
    </>
  );
}
