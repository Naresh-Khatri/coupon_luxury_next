import { db, s } from "@/db";
import { and, asc, desc, eq } from "drizzle-orm";
import { cached, CACHE_TAGS } from "../cache";

export const getNavFeatured = cached(
  async (country?: string | null) => {
    const storeWhere = country
      ? and(
          eq(s.stores.active, true),
          eq(s.stores.featured, true),
          eq(s.stores.country, country)
        )
      : and(eq(s.stores.active, true), eq(s.stores.featured, true));

    const [featuredStores, featuredCategories] = await Promise.all([
      db.query.stores.findMany({
        where: storeWhere,
        orderBy: desc(s.stores.updatedAt),
        limit: 8,
        columns: {
          id: true,
          storeName: true,
          slug: true,
          image: true,
        },
      }),
      db.query.categories.findMany({
        where: and(
          eq(s.categories.active, true),
          eq(s.categories.featured, true)
        ),
        orderBy: asc(s.categories.categoryName),
        limit: 10,
        columns: {
          id: true,
          categoryName: true,
          slug: true,
        },
      }),
    ]);

    return { featuredStores, featuredCategories };
  },
  ["nav:featured"],
  [CACHE_TAGS.stores, CACHE_TAGS.categories]
);
