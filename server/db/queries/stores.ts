import { db, s } from "@/db";
import { and, asc, desc, eq, ilike, sql } from "drizzle-orm";
import { cached, CACHE_TAGS } from "../cache";

const publicStoreCols = {
  id: s.stores.id,
  storeName: s.stores.storeName,
  slug: s.stores.slug,
  image: s.stores.image,
};

export const getPublicStores = cached(
  async (opts: { featured?: boolean; limit?: number } = {}) => {
    const limit = opts.limit ?? 50;
    const where = opts.featured
      ? and(eq(s.stores.active, true), eq(s.stores.featured, true))
      : eq(s.stores.active, true);
    return db.query.stores.findMany({
      where,
      limit,
      orderBy: asc(s.stores.storeName),
      columns: {
        id: true,
        storeName: true,
        slug: true,
        image: true,
      },
      with: {
        category: { columns: { id: true, categoryName: true, slug: true } },
        subCategory: {
          columns: { id: true, subCategoryName: true, slug: true },
        },
      },
    });
  },
  ["stores:public"],
  [CACHE_TAGS.stores]
);

export const getStoreBySlug = (slug: string) =>
  cached(
    async () =>
      db.query.stores.findFirst({
        where: ilike(s.stores.slug, slug),
        with: {
          category: { columns: { id: true, categoryName: true, slug: true } },
          subCategory: {
            columns: { id: true, subCategoryName: true, slug: true },
          },
          offers: {
            where: eq(s.offers.active, true),
            orderBy: desc(s.offers.updatedAt),
          },
        },
      }),
    ["store:slug", slug],
    [CACHE_TAGS.stores, CACHE_TAGS.store(slug)]
  )();

export async function getAllStores() {
  return db.query.stores.findMany({
    orderBy: asc(s.stores.storeName),
    with: {
      category: { columns: { id: true, categoryName: true, slug: true } },
      subCategory: {
        columns: { id: true, subCategoryName: true, slug: true },
      },
    },
  });
}

export async function searchStoresByName(q: string, limit = 20) {
  if (!q) return [];
  return db
    .select({
      id: s.stores.id,
      storeName: s.stores.storeName,
      slug: s.stores.slug,
      image: s.stores.image,
    })
    .from(s.stores)
    .where(ilike(s.stores.storeName, `%${q}%`))
    .orderBy(asc(s.stores.storeName))
    .limit(limit);
}

export async function getStoreCount() {
  const [row] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(s.stores);
  return row?.count ?? 0;
}
