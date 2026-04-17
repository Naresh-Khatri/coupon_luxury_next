"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useOffersParamsState } from "./OffersFilters";
import { cn } from "@/lib/utils";

function pagesToShow(current: number, total: number): (number | "…")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const out: (number | "…")[] = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  if (start > 2) out.push("…");
  for (let i = start; i <= end; i++) out.push(i);
  if (end < total - 1) out.push("…");
  out.push(total);
  return out;
}

export default function OffersPagination({ pageCount }: { pageCount: number }) {
  const { params, update } = useOffersParamsState();
  if (pageCount <= 1) return null;

  const go = (p: number) => {
    if (p < 1 || p > pageCount) return;
    update({ page: p });
    if (typeof window !== "undefined")
      window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const pages = pagesToShow(params.page, pageCount);

  return (
    <nav
      aria-label="Pagination"
      className="mt-10 flex items-center justify-center gap-1"
    >
      <button
        type="button"
        onClick={() => go(params.page - 1)}
        disabled={params.page <= 1}
        className="inline-flex size-9 items-center justify-center rounded-full border border-border bg-muted text-muted-foreground transition-colors hover:border-gold hover:text-gold disabled:opacity-40 disabled:hover:border-border disabled:hover:text-muted-foreground"
        aria-label="Previous page"
      >
        <ChevronLeft className="size-4" />
      </button>
      {pages.map((p, i) =>
        p === "…" ? (
          <span
            key={`dots-${i}`}
            className="inline-flex size-9 items-center justify-center text-sm text-muted-foreground"
          >
            …
          </span>
        ) : (
          <button
            key={p}
            type="button"
            onClick={() => go(p)}
            className={cn(
              "inline-flex size-9 items-center justify-center rounded-full text-[13px] font-semibold transition-colors",
              p === params.page
                ? "bg-gold text-navy"
                : "text-muted-foreground hover:bg-gold/10 hover:text-gold"
            )}
          >
            {p}
          </button>
        )
      )}
      <button
        type="button"
        onClick={() => go(params.page + 1)}
        disabled={params.page >= pageCount}
        className="inline-flex size-9 items-center justify-center rounded-full border border-border bg-muted text-muted-foreground transition-colors hover:border-gold hover:text-gold disabled:opacity-40 disabled:hover:border-border disabled:hover:text-muted-foreground"
        aria-label="Next page"
      >
        <ChevronRight className="size-4" />
      </button>
    </nav>
  );
}
