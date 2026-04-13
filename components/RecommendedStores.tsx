import Image from "next/image";
import Link from "next/link";

type Store = { id: string | number; slug: string; storeName: string; image: string };

export default function RecommendedStores({ stores }: { stores: Store[] }) {
  return (
    <div className="rounded-xl bg-white p-4 font-semibold">
      <h3 className="text-2xl text-black">Popular Stores</h3>
      <div className="grid grid-cols-2 gap-5 p-5">
        {stores.map((store) => (
          <Link key={store.id} href={`/stores/${store.slug}`}>
            <div className="flex justify-center transition-transform duration-150 hover:scale-110">
              <Image
                src={store.image}
                alt={`${store.storeName} - logo`}
                width={100}
                height={50}
                className="rounded"
              />
            </div>
          </Link>
        ))}
      </div>
      <div className="flex justify-center">
        <Link
          href="/stores"
          className="mb-3 inline-flex items-center justify-center rounded-xl bg-brand-900 px-5 py-2 text-sm text-white shadow-lg transition-all hover:bg-brand-800"
        >
          VIEW ALL STORES
        </Link>
      </div>
    </div>
  );
}
