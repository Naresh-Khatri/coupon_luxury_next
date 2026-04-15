"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";

export default function Banner({
  title,
  subTitle,
  titleAsH1,
}: {
  title?: string;
  subTitle?: string;
  titleAsH1?: boolean;
}) {
  const TitleTag = titleAsH1 ? "h1" : "h3";
  const height = subTitle && !title ? "h-[75px]" : subTitle ? "h-[148px]" : "h-[116px]";

  return (
    <motion.section
      className={cn(
        "banner-bg relative flex flex-col items-center justify-center overflow-hidden text-white",
        height
      )}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <div
        className="absolute bottom-0 left-0 right-0 h-[2px] opacity-60"
        style={{
          background:
            "linear-gradient(to right, transparent, #C49A3C, transparent)",
        }}
      />

      {title && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1 }}
        >
          <TitleTag className="text-center text-2xl font-bold leading-[1.15] tracking-[0.3px] md:text-4xl">
            {title}
          </TitleTag>
        </motion.div>
      )}

      {subTitle && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mt-1"
        >
          <h4 className="text-center text-sm font-normal tracking-[0.2px] text-white/70 md:text-base">
            {subTitle}
          </h4>
        </motion.div>
      )}
    </motion.section>
  );
}
