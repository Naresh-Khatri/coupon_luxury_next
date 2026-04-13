"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import transformPath from "@/utils/transformImagePath";

export default function DealCard({
  storeImg,
  storeName,
  storeSlug,
  dealSlug,
  title,
}: {
  affURL?: string;
  storeImg: string;
  storeName: string;
  storeSlug: string;
  dealSlug: string;
  code?: string;
  title: string;
  type?: string;
  endDate?: string;
  showValidTill?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      whileHover={{
        y: -6,
        boxShadow: "0 20px 40px rgba(0,0,0,0.12)",
        transition: { duration: 0.22, ease: "easeOut" },
      }}
      whileTap={{ scale: 0.97, transition: { duration: 0.1 } }}
      className="flex h-[200px] w-[160px] flex-col items-center justify-between overflow-hidden rounded-2xl border border-black/5 bg-white shadow-md lg:h-[248px] lg:w-[196px]"
    >
      <Link href={`/stores/${storeSlug}`} className="w-full">
        <div className="w-full overflow-hidden">
          <Image
            width={200}
            height={200}
            className="block w-full rounded-t-[16px]"
            title={`Open ${storeName} store`}
            alt={`${title} - logo`}
            src={transformPath(storeImg, 400)}
          />
        </div>
      </Link>

      <p className="line-clamp-2 px-2 text-center text-[13px] font-medium leading-[1.4] text-gray-700 lg:text-[15px]">
        {title}
      </p>

      <Link
        href={`/deals/${dealSlug}`}
        className="w-full px-3 pb-3.5"
      >
        <button
          type="button"
          className="inline-flex h-8 w-full items-center justify-center rounded-xl bg-brand-900 text-[12px] font-semibold tracking-[0.5px] text-white transition-colors hover:bg-brand-800 active:bg-brand-700 active:scale-[0.98] lg:h-9 lg:text-[13px]"
        >
          VIEW DEAL
        </button>
      </Link>
    </motion.div>
  );
}
