"use client";

import Link from "next/link";
import { motion } from "framer-motion";
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
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

type Deal = {
  id: string | number;
  affURL: string;
  slug: string;
  title: string;
  couponCode?: string;
  offerType: "coupon" | "deal";
  endDate: string;
  store: { storeName: string; slug: string; image: string };
};

export default function DealsOfTheDay({ deals }: { deals: Deal[] }) {
  const limitedDeals = deals?.slice(0, 20);

  return (
    <section className="mt-14 mb-6">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="mb-8 text-center"
      >
        <p className="mb-2 text-xs font-semibold uppercase tracking-[3px] text-gold md:text-sm">
          Handpicked for you
        </p>
        <h2 className="text-4xl font-bold leading-[1.1] text-gray-900 md:text-5xl">
          Deals{" "}
          <span
            className="bg-clip-text text-transparent"
            style={{
              backgroundImage: "linear-gradient(to right, #0092c0, #C49A3C)",
            }}
          >
            of the Day
          </span>
        </h2>
        <div
          className="mx-auto mt-3 h-[3px] w-12 rounded-full"
          style={{
            backgroundImage: "linear-gradient(to right, #0092c0, #C49A3C)",
          }}
        />
      </motion.div>

      <div className="flex justify-center px-2">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-2 justify-center gap-3 sm:grid-cols-3 md:gap-5 lg:grid-cols-4 xl:grid-cols-5"
        >
          {limitedDeals?.map((deal) => (
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

      <div className="mt-10 flex justify-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.2 }}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.97 }}
        >
          <Link
            href="/deals"
            className="inline-flex h-11 items-center justify-center rounded-xl bg-brand-900 px-8 text-[15px] font-semibold tracking-[0.8px] text-white shadow-xl transition-all hover:bg-brand-800 active:bg-brand-700"
            style={{ boxShadow: "0 8px 24px rgba(0,114,160,0.35)" }}
          >
            VIEW ALL DEALS
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
