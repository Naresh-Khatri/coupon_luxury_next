import { db, s } from "@/db";
import { and, asc, desc, eq, ilike, ne, sql } from "drizzle-orm";
import { cached, CACHE_TAGS } from "../cache";

const publicStoreCols = {
  id: s.stores.id,
  storeName: s.stores.storeName,
  slug: s.stores.slug,
  image: s.stores.image,
};

export const getPublicStores = cached(
  async (
    opts: { featured?: boolean; limit?: number; country?: string | null } = {}
  ) => {
    const limit = opts.limit ?? 50;
    const conds = [eq(s.stores.active, true)];
    if (opts.featured) conds.push(eq(s.stores.featured, true));
    if (opts.country) conds.push(eq(s.stores.country, opts.country));
    const where = and(...conds);
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

export const getSimilarStores = (opts: {
  categoryId: number;
  excludeId: number;
  country?: string | null;
  limit?: number;
}) =>
  cached(
    async () => {
      const limit = opts.limit ?? 8;
      const conds = [
        eq(s.stores.active, true),
        eq(s.stores.categoryId, opts.categoryId),
        ne(s.stores.id, opts.excludeId),
      ];
      if (opts.country) conds.push(eq(s.stores.country, opts.country));
      return db.query.stores.findMany({
        where: and(...conds),
        limit,
        orderBy: [desc(s.stores.featured), asc(s.stores.storeName)],
        columns: {
          id: true,
          storeName: true,
          slug: true,
          image: true,
        },
      });
    },
    [
      "stores:similar",
      String(opts.categoryId),
      String(opts.excludeId),
      opts.country ?? "any",
      String(opts.limit ?? 8),
    ],
    [CACHE_TAGS.stores]
  )();

export const getTopStoresForOffers = (opts: {
  offerType?: "deal" | "coupon";
  country?: string | null;
  limit?: number;
}) =>
  cached(
    async () => {
      const limit = opts.limit ?? 10;
      const conds = [eq(s.offers.active, true)];
      if (opts.offerType) conds.push(eq(s.offers.offerType, opts.offerType));
      if (opts.country) conds.push(eq(s.stores.country, opts.country));
      return db
        .select({
          id: s.stores.id,
          storeName: s.stores.storeName,
          slug: s.stores.slug,
          image: s.stores.image,
          offerCount: sql<number>`count(${s.offers.id})::int`,
        })
        .from(s.stores)
        .innerJoin(s.offers, eq(s.offers.storeId, s.stores.id))
        .where(and(eq(s.stores.active, true), ...conds))
        .groupBy(s.stores.id)
        .orderBy(
          desc(sql`count(${s.offers.id})`),
          asc(s.stores.storeName)
        )
        .limit(limit);
    },
    [
      "stores:top",
      opts.offerType ?? "any",
      opts.country ?? "any",
      String(opts.limit ?? 10),
    ],
    [CACHE_TAGS.stores, CACHE_TAGS.offers]
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

export async function searchStoresByName(
  q: string,
  limit = 20,
  country?: string | null
) {
  if (!q) return [];
  const conds = [
    eq(s.stores.active, true),
    ilike(s.stores.storeName, `%${q}%`),
  ];
  if (country) conds.push(eq(s.stores.country, country));
  return db
    .select({
      id: s.stores.id,
      storeName: s.stores.storeName,
      slug: s.stores.slug,
      image: s.stores.image,
    })
    .from(s.stores)
    .where(and(...conds))
    .orderBy(asc(s.stores.storeName))
    .limit(limit);
}

export async function getStoreCount() {
  const [row] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(s.stores);
  return row?.count ?? 0;
}
