import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import Banner from "@/components/Banner";
import DealCard from "@/components/DealCard";
import DealCTA from "./DealCTA";
import { getOfferBySlug, getPublicOffers } from "@/server/db/queries/offers";

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
