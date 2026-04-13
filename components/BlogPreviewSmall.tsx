"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const formatDate = (date: string | number | Date) => {
  const d = new Date(date);
  return `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
};

type Blog = {
  title: string;
  thumbnailImg: string | null;
  imgAlt: string | null;
  createdAt: string | Date;
  smallDescription: string;
  slug: string;
};

export default function BlogPreviewSmall({ blog }: { blog: Blog }) {
  const { title, thumbnailImg, imgAlt, createdAt, slug } = blog;

  return (
    <Link href={`/blogs/${slug}`} className="block">
      <motion.div
        initial={{ opacity: 0, x: 16 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        whileHover={{
          x: 3,
          boxShadow: "0 8px 24px rgba(0,0,0,0.09)",
          transition: { duration: 0.18 },
        }}
        className="mb-3 overflow-hidden rounded-xl border border-black/5 bg-white"
      >
        <div className="flex items-center gap-3 p-3">
          <div className="relative size-[72px] shrink-0 overflow-hidden rounded-lg">
            <Image
              src={thumbnailImg ?? "/placeholder.svg"}
              alt={imgAlt ?? title}
              fill
              className="object-cover"
            />
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="mb-1 line-clamp-2 font-[var(--font-display)] text-sm font-bold leading-[1.3] text-gray-900">
              {title}
            </h4>
            <p className="text-xs font-semibold tracking-[0.5px] text-gold">
              {formatDate(createdAt)}
            </p>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
