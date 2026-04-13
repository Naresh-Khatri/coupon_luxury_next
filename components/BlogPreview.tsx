"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

function estimateReadTime(text = "") {
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

type Blog = {
  title: string;
  smallDescription: string;
  thumbnailImg: string;
  slug: string;
  imgAlt: string;
};

export default function BlogPreview({ blog }: { blog: Blog }) {
  const { title, smallDescription, thumbnailImg, slug, imgAlt } = blog;
  const readTime = estimateReadTime(smallDescription);

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      whileHover={{
        y: -6,
        boxShadow: "0 20px 40px rgba(0,0,0,0.10)",
        transition: { duration: 0.22, ease: "easeOut" },
      }}
      className="flex max-w-[300px] flex-col overflow-hidden rounded-2xl border border-black/5 bg-white"
    >
      <Link href={`/blogs/${slug}`} className="contents">
        <div className="relative w-full overflow-hidden aspect-[16/9]">
          <Image
            src={thumbnailImg}
            alt={imgAlt}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        </div>

        <div className="flex flex-1 flex-col justify-between gap-3 p-5">
          <div className="flex items-center gap-2">
            <span className="h-[2px] w-5 rounded-full bg-gold" />
            <span className="text-xs font-semibold uppercase tracking-[1.5px] text-gold">
              {readTime} min read
            </span>
          </div>

          <h3 className="line-clamp-2 font-[var(--font-display)] text-lg font-bold leading-[1.25] text-gray-900">
            {title}
          </h3>

          <p className="line-clamp-3 text-sm leading-[1.65] text-gray-500">
            {smallDescription}
          </p>

          <div className="mt-1 flex items-center gap-2">
            <span className="text-sm font-semibold text-teal-dark">
              Read article
            </span>
            <span className="text-teal-dark">→</span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
