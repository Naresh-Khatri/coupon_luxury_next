import { db, s } from "@/db";
import { eq } from "drizzle-orm";
import { cached, CACHE_TAGS } from "../cache";

export const getDistinctCountries = cached(
  async () => {
    const rows = await db
      .selectDistinct({ country: s.stores.country })
      .from(s.stores)
      .where(eq(s.stores.active, true));
    return rows
      .map((r) => r.country)
      .filter((c): c is string => Boolean(c && c.trim()))
      .sort((a, b) => a.localeCompare(b));
  },
  ["countries:distinct"],
  [CACHE_TAGS.stores]
);
