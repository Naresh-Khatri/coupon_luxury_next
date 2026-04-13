"use client";

import { useState } from "react";
import Image from "next/image";
import { Clipboard } from "lucide-react";
import { toast } from "sonner";
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

export default function CodeRevealingButton({
  code,
  affURL,
  storeName,
  image,
}: {
  code: string;
  affURL: string;
  storeName: string;
  image: string;
}) {
  const [open, setOpen] = useState(false);
  const [hasCopied, setHasCopied] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const truncateCode = code ? "***" + code.slice(-4) : "";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setHasCopied(true);
      setShowConfetti(true);
      toast.success("Copied", {
        description: `Opening ${storeName} in new tab...`,
      });
      setTimeout(() => {
        window.open(affURL, "_blank");
        setShowConfetti(false);
      }, 2000);
    } catch (err) {
      toast.error("Could not copy code");
    }
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
                    className="inline-flex h-12 min-w-[200px] items-center justify-center gap-3 rounded-md border-2 border-dashed border-gray-400 px-6 text-base font-semibold text-brand-900 hover:border-teal hover:text-teal"
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
