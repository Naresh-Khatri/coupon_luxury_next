import Image from "next/image";
import Link from "next/link";
import transformPath from "@/utils/transformImagePath";

type StoreLite = {
  id: number;
  storeName: string;
  slug: string;
  image: string;
};

export default function SimilarStores({
  stores,
  categoryName,
}: {
  stores: StoreLite[];
  categoryName?: string;
}) {
  if (!stores.length) return null;
  return (
    <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
      <div className="border-b border-gray-100 px-6 py-4 md:px-8">
        <h2 className="text-[11px] font-bold uppercase tracking-[0.18em] text-gray-500">
          Similar stores{categoryName ? ` in ${categoryName}` : ""}
        </h2>
      </div>
      <ul className="grid grid-cols-2 gap-3 p-4 sm:grid-cols-3 md:grid-cols-4 md:p-6 lg:grid-cols-4">
        {stores.map((store) => (
          <li key={store.id}>
            <Link
              href={`/stores/${store.slug}`}
              className="group flex flex-col items-center gap-2 rounded-xl border border-gray-200/80 bg-white p-4 transition-all hover:border-gold/60 hover:shadow-md"
            >
              <div className="flex h-16 w-full items-center justify-center">
                <Image
                  src={transformPath(store.image, 240)}
                  alt={store.storeName}
                  width={120}
                  height={60}
                  className="max-h-[48px] w-auto max-w-[80%] object-contain transition-transform group-hover:scale-105"
                />
              </div>
              <span className="line-clamp-1 text-center text-[12px] font-medium text-navy">
                {store.storeName}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
