import Image from "next/image";
import Link from "next/link";
import transformPath from "@/utils/transformImagePath";

type StoreItem = {
  id: number;
  storeName: string;
  slug: string;
  image: string;
  offerCount: number;
};

export default function TopStoresStrip({
  stores,
  itemLabel,
}: {
  stores: StoreItem[];
  itemLabel: string;
}) {
  if (!stores.length) return null;
  return (
    <section className="mb-6 rounded-xl border border-border bg-card p-4">
      <h2 className="mb-3 text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
        Top stores for {itemLabel}s
      </h2>
      <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
        {stores.map((store) => (
          <Link
            key={store.id}
            href={`/stores/${store.slug}`}
            className="group flex shrink-0 flex-col items-center gap-1 rounded-lg border border-border bg-muted px-3 py-2 transition-all hover:border-gold/60 hover:shadow-sm"
            title={`${store.offerCount} ${itemLabel}${store.offerCount === 1 ? "" : "s"}`}
          >
            <div className="flex h-10 w-20 items-center justify-center bg-white/95 rounded-md">
              <Image
                src={transformPath(store.image, 160)}
                alt={store.storeName}
                width={80}
                height={40}
                className="max-h-[32px] w-auto max-w-[80%] object-contain transition-transform group-hover:scale-105"
              />
            </div>
            <span className="line-clamp-1 max-w-[96px] text-center text-[11px] font-medium text-foreground/80">
              {store.storeName}
            </span>
            <span className="text-[10px] font-semibold text-gold">
              {store.offerCount}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
