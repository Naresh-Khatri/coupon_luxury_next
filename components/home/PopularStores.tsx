"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import transformPath from "@/utils/transformImagePath";

type Store = {
  id: string | number;
  storeName: string;
  slug: string;
  image: string;
};

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.04 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: "easeOut" as const },
  },
};

export default function PopularStores({
  featuredStores,
}: {
  featuredStores: Store[];
}) {
  const stores = featuredStores.slice(0, 12);
  if (!stores.length) return null;

  return (
    <section className="bg-gray-50 px-4 py-12 md:py-16">
      <div className="mx-auto max-w-[1200px]">
        <div className="mb-8 flex items-end justify-between gap-4">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 md:text-3xl">
            Popular Stores
          </h2>
          <Link
            href="/stores"
            className="text-sm font-medium text-teal hover:underline"
          >
            View all stores →
          </Link>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
          className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6"
        >
          {stores.map((store) => (
            <motion.div key={store.id} variants={itemVariants}>
              <Link
                href={`/stores/${store.slug}`}
                className="group flex h-[110px] flex-col items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white p-3 transition-all hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-md"
              >
                <div className="relative flex h-12 w-full items-center justify-center overflow-hidden">
                  <Image
                    src={transformPath(store.image, 200)}
                    alt={`${store.storeName} logo`}
                    width={120}
                    height={48}
                    className="max-h-12 w-auto object-contain"
                  />
                </div>
                <p className="line-clamp-1 text-center text-[13px] font-medium text-gray-700 group-hover:text-gray-900">
                  {store.storeName}
                </p>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
