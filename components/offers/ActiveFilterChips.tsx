"use client";

import { X } from "lucide-react";
import { useOffersParamsState, type CategoryOption } from "./OffersFilters";

export default function ActiveFilterChips({
  categories,
}: {
  categories: CategoryOption[];
}) {
  const { params, update } = useOffersParamsState();
  const catMap = new Map(categories.map((c) => [c.slug, c.categoryName]));
  const chips: Array<{ key: string; label: string; remove: () => void }> = [];

  if (params.q) {
    chips.push({
      key: "q",
      label: `"${params.q}"`,
      remove: () => update({ q: "" }),
    });
  }
  for (const slug of params.categories) {
    chips.push({
      key: `c-${slug}`,
      label: catMap.get(slug) ?? slug,
      remove: () =>
        update({ categories: params.categories.filter((s) => s !== slug) }),
    });
  }
  if (params.type) {
    chips.push({
      key: "type",
      label: params.type === "flat" ? "Flat off" : "Percentage off",
      remove: () => update({ type: null }),
    });
  }
  if (params.code) {
    chips.push({
      key: "code",
      label: "With code",
      remove: () => update({ code: false }),
    });
  }

  if (chips.length === 0) return null;

  return (
    <div className="mb-5 flex flex-wrap items-center gap-1.5">
      <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        Active:
      </span>
      {chips.map((chip) => (
        <button
          key={chip.key}
          type="button"
          onClick={chip.remove}
          className="group inline-flex items-center gap-1 rounded-full border border-gold/30 bg-gold/10 px-2.5 py-1 text-[11.5px] font-medium text-gold transition-colors hover:border-gold hover:bg-gold/20"
        >
          <span>{chip.label}</span>
          <X className="size-3 text-gold/60 transition-colors group-hover:text-gold" />
        </button>
      ))}
    </div>
  );
}
