"use client";

import { useState } from "react";
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
    <div className="flex flex-col items-center justify-center">
      {clicked && <Confetti />}
      <button
        type="button"
        onClick={handleClick}
        className="mb-5 inline-flex h-[63px] w-[156px] items-center justify-center rounded-md bg-brand-900 px-5 text-xl font-semibold text-white shadow-xl transition-colors hover:bg-brand-800"
        style={{ boxShadow: "0px 10px 33px -3px rgba(42, 129, 251, 0.5)" }}
      >
        GET DEAL
      </button>
      {clicked && (
        <p className="text-sm"> Deal applied in new tab!</p>
      )}
    </div>
  );
}
