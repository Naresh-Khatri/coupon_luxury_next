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
      className="my-4 flex w-full items-center justify-between rounded-[12px] border border-border bg-card px-5 py-3"
    >
      <span className="text-sm font-semibold tracking-[0.3px] text-foreground">
        {leftText}
      </span>
      {rightText && (
        <span className="text-sm font-medium text-muted-foreground">{rightText}</span>
      )}
    </motion.div>
  );
}
