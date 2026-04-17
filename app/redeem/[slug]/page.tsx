import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getOfferBySlug } from "@/server/db/queries/offers";
import RedeemClient from "./RedeemClient";

export const dynamic = "force-dynamic";

export default async function RedeemPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;
  const offer = await getOfferBySlug(slug);
  if (!offer) notFound();

  return (
    <main className="flex min-h-screen flex-col bg-[#f5f5f7]">
      <header className="flex items-center justify-center border-b border-gray-200 bg-white py-4">
        <Link href="/" aria-label="CouponLuxury home">
          <Image
            src="https://ik.imagekit.io/couponluxury/tr:w-160/logo_13BHLbKp9"
            alt="CouponLuxury"
            width={160}
            height={40}
            priority
          />
        </Link>
      </header>

      <RedeemClient
        offerId={offer.id}
        storeName={offer.store.storeName}
        couponCode={offer.couponCode ?? null}
        affURL={offer.affURL}
        offerType={offer.offerType}
      />
    </main>
  );
}
