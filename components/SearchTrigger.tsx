"use client";

import { useEffect, useState } from "react";
import { Search as SearchIcon } from "lucide-react";
import GlobalSearch from "./GlobalSearch";
import { cn } from "@/lib/utils";

export default function SearchTrigger({
  country,
  variant = "full",
}: {
  country: string | null;
  variant?: "full" | "icon";
}) {
  const [open, setOpen] = useState(false);
  const [isMac, setIsMac] = useState(false);

  useEffect(() => {
    setIsMac(
      typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform)
    );
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      } else if (e.key === "/" && !open) {
        const t = e.target as HTMLElement | null;
        if (
          t &&
          (t.tagName === "INPUT" ||
            t.tagName === "TEXTAREA" ||
            t.isContentEditable)
        )
          return;
        e.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      {variant === "icon" ? (
        <button
          type="button"
          aria-label="Search"
          onClick={() => setOpen(true)}
          className={cn(
            "inline-flex size-9 items-center justify-center rounded-md text-white/85 transition-colors hover:bg-white/10 hover:text-white"
          )}
        >
          <SearchIcon className="size-5" />
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className={cn(
            "group inline-flex h-9 w-[260px] items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.04] pl-3 pr-2 text-left text-[13px] text-white/60 shadow-inner shadow-black/20 transition-all hover:border-gold/30 hover:bg-white/[0.06] hover:text-white/90 focus-visible:border-gold/50 focus-visible:outline-none lg:w-[300px]"
          )}
        >
          <SearchIcon className="size-4 text-white/50 transition-colors group-hover:text-gold" />
          <span className="flex-1 truncate">Search stores, coupons…</span>
          <kbd className="inline-flex items-center gap-0.5 rounded border border-white/15 bg-white/[0.06] px-1.5 py-0.5 font-mono text-[10px] font-semibold text-white/50">
            {isMac ? "⌘" : "Ctrl"}K
          </kbd>
        </button>
      )}
      <GlobalSearch open={open} onOpenChange={setOpen} country={country} />
    </>
  );
}
