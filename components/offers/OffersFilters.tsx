"use client";

import { useCallback, useMemo, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Loader2, X } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import {
  parseOffersParams,
  serializeOffersParams,
  type OffersParams,
} from "./search-params";
import { cn } from "@/lib/utils";

export type CategoryOption = { slug: string; categoryName: string };

export function useOffersParamsState() {
  const sp = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [pending, start] = useTransition();

  const params = useMemo(
    () => parseOffersParams(Object.fromEntries(sp.entries())),
    [sp]
  );

  const update = useCallback(
    (patch: Partial<OffersParams>) => {
      const next = serializeOffersParams(
        { ...patch, page: patch.page ?? 1 },
        new URLSearchParams(sp.toString())
      );
      const qs = next.toString();
      start(() => {
        router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
      });
    },
    [pathname, router, sp]
  );

  return { params, update, pending };
}

export default function OffersFilters({
  categories,
  showHasCode,
  onApply,
}: {
  categories: CategoryOption[];
  showHasCode?: boolean;
  onApply?: () => void;
}) {
  const { params, update, pending } = useOffersParamsState();

  const toggleCategory = (slug: string) => {
    const next = params.categories.includes(slug)
      ? params.categories.filter((c) => c !== slug)
      : [...params.categories, slug];
    update({ categories: next });
  };

  const clearAll = () => {
    update({
      q: "",
      categories: [],
      code: false,
      type: null,
    });
    onApply?.();
  };

  const hasAny =
    params.q || params.categories.length > 0 || params.code || params.type;

  return (
    <aside className="flex flex-col gap-6 pb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
            Filters
          </span>
          {pending && (
            <Loader2 className="size-3.5 animate-spin text-gold" aria-label="Loading" />
          )}
        </div>
        {hasAny && (
          <button
            type="button"
            onClick={clearAll}
            className="inline-flex items-center gap-1 text-[11px] font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <X className="size-3" />
            Clear all
          </button>
        )}
      </div>

      <Separator />

      {/* Categories */}
      <section>
        <h3 className="mb-3 text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
          Category
        </h3>
        <ul className="flex max-h-[280px] flex-col gap-2 overflow-y-auto pr-1">
          {categories.map((cat) => {
            const checked = params.categories.includes(cat.slug);
            return (
              <li key={cat.slug}>
                <label
                  className={cn(
                    "flex cursor-pointer items-center gap-2.5 rounded-md px-2 py-1.5 text-[13.5px] transition-colors",
                    checked
                      ? "bg-gold/10 text-gold"
                      : "text-foreground/80 hover:bg-white/5"
                  )}
                >
                  <Checkbox
                    checked={checked}
                    onCheckedChange={() => toggleCategory(cat.slug)}
                    className="data-[state=checked]:!border-gold data-[state=checked]:!bg-gold data-[state=checked]:!text-navy"
                  />
                  <span className="flex-1 truncate">{cat.categoryName}</span>
                </label>
              </li>
            );
          })}
          {categories.length === 0 && (
            <li className="text-sm text-muted-foreground">No categories</li>
          )}
        </ul>
      </section>

      <Separator />

      {/* Discount type */}
      <section>
        <h3 className="mb-3 text-[11px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
          Discount type
        </h3>
        <RadioGroup
          value={params.type ?? "any"}
          onValueChange={(v) =>
            update({ type: v === "flat" || v === "percentage" ? v : null })
          }
          className="gap-2"
        >
          <RadioRow value="any" checked={!params.type} label="Any" />
          <RadioRow
            value="percentage"
            checked={params.type === "percentage"}
            label="Percentage off"
          />
          <RadioRow
            value="flat"
            checked={params.type === "flat"}
            label="Flat amount off"
          />
        </RadioGroup>
      </section>

      {showHasCode && (
        <>
          <Separator />
          <section>
            <label className="flex cursor-pointer items-start gap-3 rounded-md py-1">
              <Checkbox
                checked={params.code}
                onCheckedChange={(v) => update({ code: v === true })}
                className="mt-0.5 data-[state=checked]:!border-gold data-[state=checked]:!bg-gold data-[state=checked]:!text-white"
              />
              <div>
                <span className="text-[13.5px] font-medium text-foreground">
                  With coupon code
                </span>
                <p className="text-[11px] text-muted-foreground">
                  Only show offers that come with a promo code.
                </p>
              </div>
            </label>
          </section>
        </>
      )}
    </aside>
  );
}

function RadioRow({
  value,
  checked,
  label,
}: {
  value: string;
  checked: boolean;
  label: string;
}) {
  return (
    <label
      className={cn(
        "flex cursor-pointer items-center gap-2.5 rounded-md px-2 py-1.5 text-[13.5px] transition-colors",
        checked ? "bg-gold/10 text-gold" : "text-foreground/80 hover:bg-white/5"
      )}
    >
      <RadioGroupItem
        value={value}
        className="data-[state=checked]:!border-gold data-[state=checked]:!text-gold"
      />
      <span className="flex-1">{label}</span>
    </label>
  );
}
