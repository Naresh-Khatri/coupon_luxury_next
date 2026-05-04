"use client";

import { useState } from "react";
import Image from "next/image";
import { Clipboard } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Confetti from "../Confetti";
import styles from "./CodeRevealingButton.module.css";
import { useActivateOffer } from "@/lib/useActivateOffer";

export default function CodeRevealingButton({
  code,
  affURL,
  storeName,
  image,
  slug,
  offerId,
}: {
  code: string;
  affURL: string;
  storeName: string;
  image: string;
  slug: string;
  offerId?: number;
}) {
  const [open, setOpen] = useState(false);
  const [hasCopied, setHasCopied] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const truncateCode = code ? "***" + code.slice(-4) : "";
  const activate = useActivateOffer();

  const handleCopy = () => {
    setHasCopied(true);
    setShowConfetti(true);
    setTimeout(() => {
      setShowConfetti(false);
      activate({ offerId, slug, affURL, couponCode: code });
    }, 1200);
  };

  return (
    <>
      <button
        type="button"
        className={styles.btn}
        onClick={(e) => {
          e.stopPropagation();
          setOpen(true);
        }}
      >
        {truncateCode}
      </button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogTitle className="sr-only">Coupon code</DialogTitle>
          <div className="flex flex-col items-center justify-center py-4">
            <Image
              src={image}
              alt={`${storeName} logo`}
              width={200}
              height={100}
            />
            <p className="mt-5 mb-3 text-sm">
              Copy and paste this code at {storeName}
            </p>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="inline-flex h-12 min-w-[200px] items-center justify-center gap-3 rounded-md border-2 border-dashed border-border px-6 text-base font-semibold text-gold hover:border-gold hover:text-gold-light"
                  >
                    <Clipboard className="size-5" />
                    {hasCopied ? "COPIED" : code}
                    {showConfetti && <Confetti />}
                  </button>
                </TooltipTrigger>
                <TooltipContent>Click to copy!</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <p className="mt-2 text-sm text-muted-foreground">
              Click to apply offer!
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
