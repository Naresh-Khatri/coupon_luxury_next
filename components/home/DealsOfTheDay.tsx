"use client";

import Link from "next/link";
import { motion } from "motion/react";
import DealCard from "../DealCard";

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" as const },
  },
};

type Deal = {
  id: string | number;
  affURL: string;
  slug: string;
  title: string;
  couponCode?: string | null;
  offerType?: string;
  endDate?: string;
  store: { storeName: string; slug: string; image: string };
};

export default function DealsOfTheDay({ deals }: { deals: Deal[] }) {
  const limitedDeals = deals?.slice(0, 10);
  if (!limitedDeals?.length) return null;

  return (
    <section className="bg-background px-4 py-12 md:py-16">
      <div className="mx-auto max-w-[1200px]">
        <div className="mb-6 flex items-end justify-between gap-4">
          <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            Deals of the Day
          </h2>
          <Link
            href="/deals"
            className="text-sm font-medium text-muted-foreground hover:text-gold"
          >
            View more deals →
          </Link>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-5 lg:grid-cols-5"
        >
          {limitedDeals.map((deal) => (
            <motion.div key={deal.id} variants={itemVariants}>
              <DealCard
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
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
