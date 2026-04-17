"use client";

import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { toast } from "sonner";
import Confetti from "@/components/Confetti";

export default function DealCTA({ affURL }: { affURL: string }) {
  const [clicked, setClicked] = useState(false);

  const handleClick = () => {
    toast.success("Deal applied in new tab!");
    setClicked(true);
    setTimeout(() => {
      window.open(affURL, "_blank");
      setClicked(false);
    }, 1500);
  };

  return (
    <div className="flex w-full flex-col items-center gap-4">
      {clicked && <Confetti />}
      <button
        type="button"
        onClick={handleClick}
        className="group inline-flex items-center justify-center gap-2 rounded-md bg-gold px-10 py-4 text-sm font-bold uppercase tracking-[0.2em] text-navy shadow-[0_12px_40px_-12px_rgba(196,154,60,0.6)] transition-all hover:bg-gold-light hover:shadow-[0_16px_48px_-12px_rgba(232,197,106,0.7)]"
      >
        Activate Deal
        <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </button>
      {clicked && (
        <p className="text-xs text-muted-foreground">Redirecting to store…</p>
      )}
    </div>
  );
}
