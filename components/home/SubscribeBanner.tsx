"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import Confetti from "../Confetti";
import { trpc } from "@/lib/trpc/client";

const emailRegex =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

export default function SubscribeBanner() {
  const [email, setEmail] = useState("");
  const [showConfetti, setShowConfetti] = useState(false);

  const mutation = trpc.public.subscribe.useMutation({
    onSuccess: () => {
      toast.success("Subscribed successfully");
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2000);
      setEmail("");
    },
    onError: (err) => {
      toast.error(
        err.data?.code === "CONFLICT"
          ? "You are already subscribed"
          : "Something went wrong"
      );
    },
  });

  const subscribe = () => {
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    mutation.mutate({ email });
  };

  return (
    <div className="my-10 flex flex-col items-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.55, ease: "easeOut" }}
        className="subscribe-banner-bg relative flex w-full max-w-[1100px] flex-col items-center justify-center overflow-hidden rounded-3xl px-6 py-12 md:px-12 md:py-16"
      >
        <div className="pointer-events-none absolute -top-20 -right-20 size-80 rounded-full border-[60px] border-[rgba(196,154,60,0.06)]" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 size-60 rounded-full border-[40px] border-[rgba(0,146,192,0.07)]" />

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15, duration: 0.4 }}
          className="mb-2 text-center text-xs font-semibold uppercase tracking-[3px] text-gold md:text-sm"
        >
          Stay ahead of the savings
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.45 }}
          className="mb-2 text-center text-3xl font-bold leading-[1.15] text-white lg:text-5xl"
        >
          Exclusive deals,
          <br />
          <span className="text-gold">delivered to you.</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="mb-6 text-center text-sm text-white/60 md:text-base"
        >
          Join thousands of savvy shoppers getting the best coupons first.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.35, duration: 0.4 }}
          className="w-full max-w-[440px]"
        >
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
            <div className="relative flex-1">
              <input
                type="email"
                required
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && subscribe()}
                className="h-13 w-full rounded-xl border border-white/15 bg-white/[0.07] px-4 text-white placeholder:text-white/50 transition-all hover:border-white/30 focus:border-teal focus:bg-white/10 focus:outline-none focus:ring-2 focus:ring-teal/25"
                style={{ height: 52 }}
              />
            </div>

            <motion.button
              type="button"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={subscribe}
              className="inline-flex shrink-0 items-center justify-center rounded-xl px-7 text-sm font-semibold tracking-[0.8px] text-white shadow-xl transition-all"
              style={{
                height: 52,
                background:
                  "linear-gradient(135deg, #0092c0 0%, #0072a0 100%)",
                boxShadow: "0 8px 24px rgba(0,114,160,0.4)",
              }}
            >
              SUBSCRIBE
            </motion.button>
          </div>
        </motion.div>

        {showConfetti && <Confetti />}
      </motion.div>
    </div>
  );
}
