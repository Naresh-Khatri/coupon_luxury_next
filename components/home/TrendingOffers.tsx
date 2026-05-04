import Link from "next/link";
import { TrendingUp } from "lucide-react";
import OfferCard, { type OfferCardData } from "@/components/offers/OfferCard";

type Trending = OfferCardData & { store: OfferCardData["store"] };

export default function TrendingOffers({ offers }: { offers: Trending[] }) {
  if (!offers.length) return null;
  return (
    <section className="mx-auto w-full max-w-[1400px] px-4 py-10">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-teal/40 bg-teal/10 px-2.5 py-0.5 text-[10.5px] font-bold uppercase tracking-[0.16em] text-teal">
            <TrendingUp className="size-3" />
            Trending
          </div>
          <h2 className="mt-2 text-2xl font-bold text-foreground md:text-3xl">
            Trending right now
          </h2>
        </div>
        <Link
          href="/deals"
          className="text-sm font-medium text-muted-foreground hover:text-gold"
        >
          View all deals →
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {offers.map((offer) => (
          <OfferCard key={offer.id} offer={offer} />
        ))}
      </div>
    </section>
  );
}
