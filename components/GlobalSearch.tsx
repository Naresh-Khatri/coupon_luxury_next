"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Search, X } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { trpc } from "@/lib/trpc/client";
import { cn } from "@/lib/utils";
import transformPath from "@/utils/transformImagePath";

const RECENT_KEY = "cl:search:recent";
const RECENT_MAX = 6;

type OfferResult = {
  id: number | string;
  slug: string;
  title: string;
  offerType: string;
  couponCode?: string | null;
  discountType?: string | null;
  discountValue?: number | null;
  coverImg?: string | null;
  store: { id: number | string; storeName: string; slug: string; image: string };
};

type SearchResults = {
  stores: Array<{ id: number | string; slug: string; storeName: string; image: string }>;
  coupons: Array<OfferResult>;
  deals: Array<OfferResult>;
};

function useDebounced<T>(value: T, delay = 200): T {
  const [v, setV] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setV(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return v;
}

function readRecents(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(RECENT_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}

function writeRecents(items: string[]) {
  try {
    window.localStorage.setItem(RECENT_KEY, JSON.stringify(items.slice(0, RECENT_MAX)));
  } catch { }
}

function formatDiscount(o: OfferResult): string | null {
  if (!o.discountValue) return null;
  return o.discountType === "flat" ? `$${o.discountValue} off` : `${o.discountValue}% off`;
}

export default function GlobalSearch({
  open,
  onOpenChange,
  country,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  country: string | null;
}) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const debouncedQ = useDebounced(q, 220);
  const [recents, setRecents] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setRecents(readRecents());
      requestAnimationFrame(() => inputRef.current?.focus());
    } else {
      const t = setTimeout(() => setQ(""), 180);
      return () => clearTimeout(t);
    }
  }, [open]);

  const query = trpc.public.search.useQuery(
    { q: debouncedQ, country },
    { enabled: debouncedQ.trim().length > 0, staleTime: 30_000 }
  );

  const results = (query.data ?? { stores: [], coupons: [], deals: [] }) as SearchResults;

  const hasQuery = debouncedQ.trim().length > 0;
  const isLoading = hasQuery && query.isFetching;
  const total = results.stores.length + results.coupons.length + results.deals.length;
  const isEmpty = hasQuery && !isLoading && total === 0;

  const pushRecent = useCallback((term: string) => {
    const t = term.trim();
    if (!t) return;
    const next = [t, ...readRecents().filter((x) => x.toLowerCase() !== t.toLowerCase())];
    writeRecents(next);
    setRecents(next);
  }, []);

  const go = useCallback(
    (href: string, label?: string) => {
      if (label) pushRecent(label);
      onOpenChange(false);
      router.push(href);
    },
    [onOpenChange, pushRecent, router]
  );

  const clearRecents = () => {
    writeRecents([]);
    setRecents([]);
  };

  const trending = useMemo(
    () => ["Nike", "Amazon", "Nordstrom", "Free shipping", "50% off"],
    []
  );

  const submitSearch = () => {
    const t = q.trim();
    if (!t) return;
    pushRecent(t);
    go(`/deals?q=${encodeURIComponent(t)}`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="top-[8%] max-w-[720px] translate-y-0 gap-0 overflow-hidden border border-border bg-card p-0"
      >
        <DialogTitle className="sr-only">Search</DialogTitle>

        {/* Input */}
        <div className="flex items-center gap-3 border-b border-border px-5 py-4">
          <Search className="size-4 shrink-0 text-muted-foreground" />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                submitSearch();
              }
            }}
            placeholder="Search for stores, coupons & offers..."
            className="flex-1 bg-transparent text-[15px] text-foreground outline-none placeholder:text-muted-foreground"
          />
          {q.length > 0 && (
            <button
              type="button"
              onClick={() => setQ("")}
              className="rounded-full p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label="Clear"
            >
              <X className="size-3.5" />
            </button>
          )}
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="ml-1 hidden rounded border border-border px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground sm:inline-block"
          >
            esc
          </button>
        </div>

        <div className="max-h-[min(560px,70vh)] overflow-y-auto px-5 py-5">
          {/* Empty state: recents + trending */}
          {!hasQuery && (
            <div className="flex flex-col gap-6">
              {recents.length > 0 && (
                <section>
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
                      Recent searches
                    </h3>
                    <button
                      type="button"
                      onClick={clearRecents}
                      className="text-[11px] text-muted-foreground transition-colors hover:text-foreground"
                    >
                      Clear
                    </button>
                  </div>
                  <Chips items={recents} onSelect={setQ} />
                </section>
              )}
              <section>
                <h3 className="mb-2 text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
                  Popular searches
                </h3>
                <Chips items={trending} onSelect={setQ} />
              </section>
            </div>
          )}

          {/* Loading */}
          {isLoading && (
            <div className="flex flex-col gap-3 py-2">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="size-10 shrink-0 animate-pulse rounded-md bg-muted" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 w-2/5 animate-pulse rounded bg-muted" />
                    <div className="h-2.5 w-1/4 animate-pulse rounded bg-muted" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* No results */}
          {isEmpty && (
            <div className="flex flex-col items-center justify-center gap-1 py-14 text-center">
              <p className="text-[15px] text-foreground">
                No results for{" "}
                <span className="font-semibold">&ldquo;{debouncedQ}&rdquo;</span>
              </p>
              <p className="max-w-[320px] text-[13px] text-muted-foreground">
                Try another brand, category, or a broader term.
              </p>
            </div>
          )}

          {/* Results */}
          {hasQuery && !isLoading && !isEmpty && (
            <div className="flex flex-col gap-6">
              {results.stores.length > 0 && (
                <ResultGroup
                  label="Stores"
                  term={debouncedQ}
                  count={results.stores.length}
                  viewAllHref={`/stores?q=${encodeURIComponent(debouncedQ)}`}
                  viewAllLabel="View all stores"
                >
                  {results.stores.map((s) => (
                    <ResultRow
                      key={`s-${s.id}`}
                      image={s.image}
                      title={s.storeName}
                      subtitle="Visit store"
                      onClick={() => go(`/stores/${s.slug}`, s.storeName)}
                    />
                  ))}
                </ResultGroup>
              )}
              {results.coupons.length > 0 && (
                <ResultGroup
                  label="Coupons"
                  term={debouncedQ}
                  count={results.coupons.length}
                  viewAllHref={`/deals?q=${encodeURIComponent(debouncedQ)}`}
                  viewAllLabel="View all coupons"
                >
                  {results.coupons.map((o) => (
                    <ResultRow
                      key={`c-${o.id}`}
                      image={o.coverImg || o.store.image}
                      imageMode={o.coverImg ? "cover" : "logo"}
                      title={o.title}
                      subtitle={o.store.storeName}
                      meta={formatDiscount(o)}
                      onClick={() => go(`/deals/${o.slug}`, o.title)}
                    />
                  ))}
                </ResultGroup>
              )}
              {results.deals.length > 0 && (
                <ResultGroup
                  label="Deals"
                  term={debouncedQ}
                  count={results.deals.length}
                  viewAllHref={`/deals?q=${encodeURIComponent(debouncedQ)}`}
                  viewAllLabel="View all deals"
                >
                  {results.deals.map((o) => (
                    <ResultRow
                      key={`d-${o.id}`}
                      image={o.coverImg || o.store.image}
                      imageMode={o.coverImg ? "cover" : "logo"}
                      title={o.title}
                      subtitle={o.store.storeName}
                      meta={formatDiscount(o)}
                      onClick={() => go(`/deals/${o.slug}`, o.title)}
                    />
                  ))}
                </ResultGroup>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Chips({
  items,
  onSelect,
}: {
  items: string[];
  onSelect: (term: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((t) => (
        <button
          key={t}
          type="button"
          onClick={() => onSelect(t)}
          className="rounded-full border border-border bg-muted px-3 py-1 text-[12.5px] text-foreground transition-colors hover:border-gold hover:text-gold"
        >
          {t}
        </button>
      ))}
    </div>
  );
}

function ResultGroup({
  label,
  term,
  count,
  viewAllHref,
  viewAllLabel,
  children,
}: {
  label: string;
  term: string;
  count: number;
  viewAllHref: string;
  viewAllLabel: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="mb-1.5 flex items-center justify-between">
        <h3 className="text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
          &ldquo;{term}&rdquo; in {label}{" "}
          <span className="text-muted-foreground/60">({count})</span>
        </h3>
        <Link
          href={viewAllHref}
          className="inline-flex items-center gap-1 text-[11px] font-medium text-gold transition-colors hover:text-gold-light"
        >
          {viewAllLabel}
          <ArrowRight className="size-3" />
        </Link>
      </div>
      <ul className="flex flex-col">{children}</ul>
    </section>
  );
}

function ResultRow({
  image,
  title,
  subtitle,
  meta,
  onClick,
  imageMode = "logo",
}: {
  image: string;
  title: string;
  subtitle?: string;
  meta?: string | null;
  onClick: () => void;
  imageMode?: "logo" | "cover";
}) {
  const isCover = imageMode === "cover";
  return (
    <li>
      <button
        type="button"
        onClick={onClick}
        className={cn(
          "flex w-full items-center gap-3 rounded-md px-2 py-2 text-left transition-colors hover:bg-white/5"
        )}
      >
        <div
          className={cn(
            "relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-md border border-border",
            isCover ? "bg-muted" : "bg-white"
          )}
        >
          <Image
            src={transformPath(image, 120)}
            alt=""
            width={40}
            height={40}
            className={
              isCover
                ? "h-full w-full object-cover"
                : "max-h-7 w-auto object-contain"
            }
          />
        </div>
        <div className="flex min-w-0 flex-1 flex-col">
          <span className="line-clamp-1 text-[14px] font-medium text-foreground">
            {title}
          </span>
          {(subtitle || meta) && (
            <span className="flex items-center gap-2 text-[12px] text-muted-foreground">
              {subtitle && <span>{subtitle}</span>}
              {meta && (
                <>
                  {subtitle && <span className="text-muted-foreground/40">·</span>}
                  <span className="font-semibold text-gold">{meta}</span>
                </>
              )}
            </span>
          )}
        </div>
      </button>
    </li>
  );
}
