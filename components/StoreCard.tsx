"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";

export default function StoreCard({
  title,
  slug,
  img,
}: {
  title: string;
  slug: string;
  img: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-20px" }}
      transition={{ duration: 0.35, ease: "easeOut" as const }}
      whileHover={{
        y: -5,
        boxShadow: "0 16px 32px rgba(0,0,0,0.14)",
        transition: { duration: 0.2, ease: "easeOut" as const },
      }}
      whileTap={{ scale: 0.97, transition: { duration: 0.1 } }}
      className="h-[150px]"
    >
      <Link href={`/stores/${slug}`} className="block h-full">
        <div className="flex h-full flex-col overflow-hidden rounded-xl border border-black/5 bg-white transition-colors hover:border-teal/25">
          <div className="w-full flex-1 overflow-hidden">
            <Image
              src={img}
              width={200}
              height={200}
              alt={`${title} - logo`}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex items-center justify-center bg-white px-2 py-2">
            <p className="line-clamp-1 text-center text-[12px] font-medium text-gray-700">
              {title}
            </p>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
