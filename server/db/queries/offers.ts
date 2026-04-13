import { db, s } from "@/db";
import { and, desc, eq, ilike, sql } from "drizzle-orm";
import { cached, CACHE_TAGS } from "../cache";

export const getPublicOffers = cached(
  async (
    opts: {
      featured?: boolean;
      categoryId?: number;
      offerType?: "deal" | "coupon";
      limit?: number;
    } = {}
  ) => {
    const conds = [eq(s.offers.active, true)];
    if (opts.featured) conds.push(eq(s.offers.featured, true));
    if (opts.categoryId) conds.push(eq(s.offers.categoryId, opts.categoryId));
    if (opts.offerType) conds.push(eq(s.offers.offerType, opts.offerType));
    return db.query.offers.findMany({
      where: and(...conds),
      limit: opts.limit ?? 50,
      orderBy: desc(s.offers.updatedAt),
      with: {
        store: {
          columns: {
            id: true,
            storeName: true,
            slug: true,
            storeURL: true,
            image: true,
            active: true,
            categoryId: true,
            subCategoryId: true,
            featured: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });
  },
  ["offers:public"],
  [CACHE_TAGS.offers]
);

export const getOfferBySlug = (slug: string) =>
  cached(
    async () =>
      db.query.offers.findFirst({
        where: eq(s.offers.slug, slug.toLowerCase()),
        with: {
          store: {
            columns: {
              id: true,
              storeName: true,
              slug: true,
              storeURL: true,
              image: true,
              active: true,
              categoryId: true,
              subCategoryId: true,
              featured: true,
              createdAt: true,
              updatedAt: true,
            },
          },
        },
      }),
    ["offer:slug", slug],
    [CACHE_TAGS.offers, CACHE_TAGS.offer(slug)]
  )();

export async function getAllOffers() {
  return db.query.offers.findMany({
    orderBy: desc(s.offers.updatedAt),
    with: {
      store: {
        columns: {
          id: true,
          storeName: true,
          slug: true,
          storeURL: true,
          active: true,
          categoryId: true,
          subCategoryId: true,
          featured: true,
          createdAt: true,
          updatedAt: true,
        },
      },
    },
  });
}

export async function getOfferCounts() {
  const [row] = await db
    .select({
      deals: sql<number>`count(*) filter (where ${s.offers.offerType} = 'deal')::int`,
      coupons: sql<number>`count(*) filter (where ${s.offers.offerType} = 'coupon')::int`,
    })
    .from(s.offers);
  return row ?? { deals: 0, coupons: 0 };
}

export async function searchOffersByTitle(q: string, limit = 20) {
  if (!q) return [];
  return db.query.offers.findMany({
    where: ilike(s.offers.title, `%${q}%`),
    limit,
    with: {
      store: {
        columns: {
          id: true,
          storeName: true,
          slug: true,
          storeURL: true,
          image: true,
        },
      },
    },
  });
}
