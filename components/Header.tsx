"use client";

import { motion } from "motion/react";

export default function Header({
  leftText,
  rightText,
}: {
  leftText: string;
  rightText?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="my-4 flex w-full items-center justify-between rounded-[12px] border border-black/10 bg-white px-5 py-3"
    >
      <span className="text-sm font-semibold tracking-[0.3px] text-gray-700">
        {leftText}
      </span>
      {rightText && (
        <span className="text-sm font-medium text-gray-500">{rightText}</span>
      )}
    </motion.div>
  );
}
