import { db, s } from "@/db";
import { asc, eq } from "drizzle-orm";
import { cached, CACHE_TAGS } from "../cache";

export const getActiveCountries = cached(
  async () => {
    return db
      .select({
        code: s.countries.code,
        name: s.countries.name,
        flagEmoji: s.countries.flagEmoji,
      })
      .from(s.countries)
      .where(eq(s.countries.active, true))
      .orderBy(asc(s.countries.sortOrder), asc(s.countries.name));
  },
  ["countries:active"],
  [CACHE_TAGS.countries]
);

export async function getAllCountries() {
  return db
    .select()
    .from(s.countries)
    .orderBy(asc(s.countries.sortOrder), asc(s.countries.name));
}
