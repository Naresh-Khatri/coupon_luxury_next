import { db, s } from "@/db";
import { eq } from "drizzle-orm";
import { cached, CACHE_TAGS } from "../cache";

export const getSitemapEntries = cached(
  async () => {
    const [stores, categories, offers, blogs] = await Promise.all([
      db
        .select({ slug: s.stores.slug, updatedAt: s.stores.updatedAt })
        .from(s.stores)
        .where(eq(s.stores.active, true)),
      db
        .select({ slug: s.categories.slug, updatedAt: s.categories.updatedAt })
        .from(s.categories)
        .where(eq(s.categories.active, true)),
      db
        .select({
          slug: s.offers.slug,
          updatedAt: s.offers.updatedAt,
          offerType: s.offers.offerType,
        })
        .from(s.offers)
        .where(eq(s.offers.active, true)),
      db
        .select({ slug: s.blogs.slug, updatedAt: s.blogs.updatedAt })
        .from(s.blogs)
        .where(eq(s.blogs.active, true)),
    ]);
    return { stores, categories, offers, blogs };
  },
  ["sitemap:all"],
  [CACHE_TAGS.sitemap]
);
