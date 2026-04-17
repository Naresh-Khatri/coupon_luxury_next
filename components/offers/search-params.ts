import type { OffersListSort } from "@/server/db/queries/offers";

export type OffersParams = {
  q: string;
  categories: string[];
  code: boolean;
  type: "flat" | "percentage" | null;
  sort: OffersListSort;
  page: number;
};

const SORTS: OffersListSort[] = [
  "newest",
  "endingSoon",
  "biggestDiscount",
  "storeAZ",
];

export function parseOffersParams(
  sp: Record<string, string | string[] | undefined>
): OffersParams {
  const get = (k: string) => {
    const v = sp[k];
    return Array.isArray(v) ? v[0] : v;
  };
  const cats = get("categories");
  const type = get("type");
  const sort = get("sort");
  const page = Number(get("page") ?? "1");
  return {
    q: get("q")?.toString() ?? "",
    categories: cats ? cats.split(",").filter(Boolean) : [],
    code: get("code") === "1",
    type: type === "flat" || type === "percentage" ? type : null,
    sort: (SORTS as string[]).includes(sort ?? "")
      ? (sort as OffersListSort)
      : "newest",
    page: Number.isFinite(page) && page >= 1 ? page : 1,
  };
}

export function serializeOffersParams(
  p: Partial<OffersParams>,
  base?: URLSearchParams
): URLSearchParams {
  const u = new URLSearchParams(base ? base.toString() : "");
  if (p.q !== undefined) {
    if (p.q) u.set("q", p.q);
    else u.delete("q");
  }
  if (p.categories !== undefined) {
    if (p.categories.length > 0) u.set("categories", p.categories.join(","));
    else u.delete("categories");
  }
  if (p.code !== undefined) {
    if (p.code) u.set("code", "1");
    else u.delete("code");
  }
  if (p.type !== undefined) {
    if (p.type) u.set("type", p.type);
    else u.delete("type");
  }
  if (p.sort !== undefined) {
    if (p.sort && p.sort !== "newest") u.set("sort", p.sort);
    else u.delete("sort");
  }
  if (p.page !== undefined) {
    if (p.page > 1) u.set("page", String(p.page));
    else u.delete("page");
  }
  return u;
}

export const SORT_LABELS: Record<OffersListSort, string> = {
  newest: "Newest first",
  endingSoon: "Ending soon",
  biggestDiscount: "Biggest discount",
  storeAZ: "Store A–Z",
};

export function countActiveFilters(p: OffersParams): number {
  let n = 0;
  if (p.q) n++;
  n += p.categories.length;
  if (p.code) n++;
  if (p.type) n++;
  return n;
}
