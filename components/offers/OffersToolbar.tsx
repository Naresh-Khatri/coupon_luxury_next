"use client";

import { useEffect, useState } from "react";
import { SlidersHorizontal, Search as SearchIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import OffersFilters, {
  useOffersParamsState,
  type CategoryOption,
} from "./OffersFilters";
import { SORT_LABELS, countActiveFilters } from "./search-params";
import type { OffersListSort } from "@/server/db/queries/offers";
import { cn } from "@/lib/utils";

export default function OffersToolbar({
  total,
  itemLabel,
  categories,
  showHasCode,
}: {
  total: number;
  itemLabel: string;
  categories: CategoryOption[];
  showHasCode?: boolean;
}) {
  const { params, update } = useOffersParamsState();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [qLocal, setQLocal] = useState(params.q);

  useEffect(() => {
    setQLocal(params.q);
  }, [params.q]);

  const activeCount = countActiveFilters(params);

  const submitQ = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (qLocal !== params.q) update({ q: qLocal });
  };

  return (
    <div className="flex flex-col gap-3 pb-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex items-center gap-3">
        <p className="text-[13px] text-gray-600">
          <span className="font-bold text-navy">{total.toLocaleString()}</span>{" "}
          {itemLabel}
          {total === 1 ? "" : "s"} found
        </p>
      </div>

      <div className="flex items-center gap-2">
        {/* Search within */}
        <form
          onSubmit={submitQ}
          className="relative hidden max-w-[260px] flex-1 items-center sm:flex"
        >
          <SearchIcon className="absolute left-3 size-4 text-gray-400" />
          <Input
            value={qLocal}
            onChange={(e) => setQLocal(e.target.value)}
            onBlur={submitQ}
            placeholder={`Filter ${itemLabel}s…`}
            className="h-9 rounded-full border-gray-200 bg-white pl-9 pr-8 text-[13px] focus-visible:ring-gold/40 focus-visible:border-gold/50"
          />
          {qLocal && (
            <button
              type="button"
              onClick={() => {
                setQLocal("");
                update({ q: "" });
              }}
              className="absolute right-2 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
              aria-label="Clear filter"
            >
              <X className="size-3.5" />
            </button>
          )}
        </form>

        <Select
          value={params.sort}
          onValueChange={(v) => update({ sort: v as OffersListSort })}
        >
          <SelectTrigger
            className={cn(
              "h-9 min-w-[160px] rounded-full border-gray-200 bg-white text-[13px]"
            )}
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent align="end">
            {(
              Object.entries(SORT_LABELS) as [OffersListSort, string][]
            ).map(([k, v]) => (
              <SelectItem key={k} value={k} className="text-[13px]">
                {v}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Mobile filters trigger */}
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              className="h-9 rounded-full border-gray-200 bg-white text-[13px] font-medium text-navy lg:hidden"
            >
              <SlidersHorizontal className="size-3.5" />
              Filters
              {activeCount > 0 && (
                <span className="ml-1 inline-flex size-5 items-center justify-center rounded-full bg-gold text-[10px] font-bold text-navy">
                  {activeCount}
                </span>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[90vw] max-w-[340px] p-6">
            <SheetTitle className="mb-4 text-base font-bold uppercase tracking-[0.14em] text-navy">
              Filter {itemLabel}s
            </SheetTitle>
            <OffersFilters
              categories={categories}
              showHasCode={showHasCode}
              onApply={() => setSheetOpen(false)}
            />
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
