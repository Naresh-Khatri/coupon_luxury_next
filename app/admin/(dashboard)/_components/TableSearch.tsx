"use client";

import * as React from "react";
import { Loader2, Search, X } from "lucide-react";
import { parseAsInteger, parseAsString, useQueryState } from "nuqs";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function TableSearch({
  placeholder = "Quick search…",
  className,
  debounceMs = 300,
  loading = false,
}: {
  placeholder?: string;
  className?: string;
  debounceMs?: number;
  loading?: boolean;
}) {
  const [q, setQ] = useQueryState(
    "q",
    parseAsString.withDefault("").withOptions({ shallow: false }),
  );
  const [, setPage] = useQueryState("page", parseAsInteger);
  const [local, setLocal] = React.useState(q);

  React.useEffect(() => {
    setLocal(q);
  }, [q]);

  React.useEffect(() => {
    if (local === q) return;
    const t = setTimeout(() => {
      setQ(local || null);
      setPage(null);
    }, debounceMs);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [local, debounceMs]);

  const busy = loading || local !== q;

  return (
    <div className={cn("relative w-full max-w-xs", className)}>
      {busy ? (
        <Loader2 className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 animate-spin text-muted-foreground" />
      ) : (
        <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
      )}
      <Input
        value={local}
        onChange={(e) => setLocal(e.target.value)}
        placeholder={placeholder}
        className="h-8 pl-8 pr-8 text-sm"
        aria-label="Search"
      />
      {local && (
        <button
          type="button"
          aria-label="Clear search"
          onClick={() => setLocal("")}
          className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground"
        >
          <X className="size-3.5" />
        </button>
      )}
    </div>
  );
}
