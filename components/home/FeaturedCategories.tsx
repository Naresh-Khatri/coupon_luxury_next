"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

type Category = {
  id: string | number;
  slug: string;
  categoryName: string;
  image: string;
  imgAlt?: string;
  offers: unknown[];
};

function CategoryCard({ category }: { category: Category }) {
  return (
    <motion.div variants={cardVariants}>
      <Link href={`/categories/${category.slug}`}>
        <motion.div
          initial="rest"
          whileHover="hovered"
          className="relative h-[200px] w-full cursor-pointer overflow-hidden rounded-2xl md:w-[340px]"
        >
          <Image
            src={category.image}
            width={350}
            height={200}
            alt={category.imgAlt || category.categoryName + " image"}
            className="block h-full w-full object-cover"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.1) 100%)",
            }}
          />
          <motion.div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(135deg, rgba(0,146,192,0.2) 0%, transparent 60%)",
              opacity: 0,
            }}
            variants={{ rest: { opacity: 0 }, hovered: { opacity: 1 } }}
            transition={{ duration: 0.3 }}
          />
          <div className="absolute inset-0 flex flex-col items-start justify-end p-5">
            <motion.div
              variants={{ rest: { y: 0 }, hovered: { y: -4 } }}
              transition={{ duration: 0.25 }}
            >
              <p className="mb-1 font-[var(--font-display)] text-2xl font-bold leading-[1.1] text-white">
                {category.categoryName}
              </p>
              <p className="text-sm text-white/80">
                {category.offers.length} Deals &amp; Coupons
              </p>
            </motion.div>
            <motion.div
              style={{
                height: "2px",
                background: "#C49A3C",
                borderRadius: "1px",
                marginTop: "8px",
                transformOrigin: "left",
              }}
              variants={{ rest: { scaleX: 0 }, hovered: { scaleX: 1 } }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            />
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}

export default function FeaturedCategories({
  featuredCat,
}: {
  featuredCat: Category[];
}) {
  return (
    <section className="bg-white px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mb-10 text-center"
      >
        <p className="mb-2 text-xs font-semibold uppercase tracking-[3px] text-gold md:text-sm">
          Browse by interest
        </p>
        <h2 className="text-3xl font-bold leading-[1.1] text-gray-900 md:text-5xl">
          Featured{" "}
          <span
            className="bg-clip-text text-transparent"
            style={{
              backgroundImage: "linear-gradient(to right, #0092c0, #C49A3C)",
            }}
          >
            Categories
          </span>
        </h2>
        <p className="mt-3 hidden text-base text-gray-500 md:block">
          Discover curated deals across every lifestyle
        </p>
        <div
          className="mx-auto mt-4 h-[3px] w-12 rounded-full"
          style={{
            backgroundImage: "linear-gradient(to right, #0092c0, #C49A3C)",
          }}
        />
      </motion.div>

      <div className="flex justify-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {featuredCat.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </motion.div>
      </div>

      <div className="mt-10 flex justify-center">
        <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }} transition={{ duration: 0.15 }}>
          <Link
            href="/categories"
            className="inline-flex h-11 items-center justify-center rounded-xl bg-brand-900 px-8 text-[15px] font-semibold tracking-[0.8px] text-white transition-all hover:bg-brand-800 active:bg-brand-700"
            style={{ boxShadow: "0 8px 24px rgba(0,114,160,0.35)" }}
          >
            VIEW ALL CATEGORIES
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
