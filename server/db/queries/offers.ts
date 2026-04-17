import { db, s } from "@/db";
import { and, asc, desc, eq, ilike, inArray, isNotNull, ne, sql } from "drizzle-orm";
import { cached, CACHE_TAGS } from "../cache";

export type OffersListSort =
  | "newest"
  | "endingSoon"
  | "biggestDiscount"
  | "storeAZ";

export const getPublicOffers = cached(
  async (
    opts: {
      featured?: boolean;
      categoryId?: number;
      offerType?: "deal" | "coupon";
      limit?: number;
      country?: string | null;
    } = {}
  ) => {
    const conds = [eq(s.offers.active, true)];
    if (opts.featured) conds.push(eq(s.offers.featured, true));
    if (opts.categoryId) conds.push(eq(s.offers.categoryId, opts.categoryId));
    if (opts.offerType) conds.push(eq(s.offers.offerType, opts.offerType));
    if (opts.country) conds.push(eq(s.offers.country, opts.country));
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

export const getOffersList = cached(
  async (
    opts: {
      offerType?: "deal" | "coupon";
      country?: string | null;
      categoryIds?: number[];
      q?: string;
      hasCode?: boolean;
      discountType?: "flat" | "percentage";
      sort?: OffersListSort;
      page?: number;
      perPage?: number;
    } = {}
  ) => {
    const perPage = opts.perPage ?? 24;
    const page = opts.page ?? 1;
    const sort: OffersListSort = opts.sort ?? "newest";

    const conds = [eq(s.offers.active, true)];
    if (opts.offerType) conds.push(eq(s.offers.offerType, opts.offerType));
    if (opts.country) conds.push(eq(s.offers.country, opts.country));
    if (opts.categoryIds && opts.categoryIds.length > 0)
      conds.push(inArray(s.offers.categoryId, opts.categoryIds));
    if (opts.q && opts.q.trim())
      conds.push(ilike(s.offers.title, `%${opts.q.trim()}%`));
    if (opts.hasCode)
      conds.push(
        and(isNotNull(s.offers.couponCode), ne(s.offers.couponCode, ""))!
      );
    if (opts.discountType)
      conds.push(eq(s.offers.discountType, opts.discountType));

    const where = and(...conds);

    const orderBy =
      sort === "biggestDiscount"
        ? [desc(s.offers.discountValue), desc(s.offers.updatedAt)]
        : sort === "endingSoon"
          ? [asc(s.offers.endDate), desc(s.offers.updatedAt)]
          : sort === "storeAZ"
            ? [asc(s.offers.storeId), desc(s.offers.updatedAt)]
            : [desc(s.offers.updatedAt)];

    const [items, countRow] = await Promise.all([
      db.query.offers.findMany({
        where,
        orderBy,
        limit: perPage,
        offset: (page - 1) * perPage,
        columns: {
          id: true,
          slug: true,
          title: true,
          URL: true,
          affURL: true,
          discountType: true,
          discountValue: true,
          couponCode: true,
          offerType: true,
          endDate: true,
          categoryId: true,
          uses: true,
          verifiedAt: true,
        },
        with: {
          store: {
            columns: {
              id: true,
              storeName: true,
              slug: true,
              image: true,
            },
          },
        },
      }),
      db
        .select({ count: sql<number>`count(*)::int` })
        .from(s.offers)
        .where(where),
    ]);

    const total = countRow[0]?.count ?? 0;
    return {
      items,
      total,
      page,
      perPage,
      pageCount: Math.max(1, Math.ceil(total / perPage)),
    };
  },
  ["offers:list"],
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

export async function searchOffersByTitle(
  q: string,
  limit = 20,
  country?: string | null
) {
  if (!q) return [];
  const conds = [
    eq(s.offers.active, true),
    ilike(s.offers.title, `%${q}%`),
  ];
  if (country) conds.push(eq(s.offers.country, country));
  return db.query.offers.findMany({
    where: and(...conds),
    limit,
    orderBy: desc(s.offers.updatedAt),
    columns: {
      id: true,
      slug: true,
      title: true,
      offerType: true,
      couponCode: true,
      discountType: true,
      discountValue: true,
    },
    with: {
      store: {
        columns: {
          id: true,
          storeName: true,
          slug: true,
          image: true,
        },
      },
    },
  });
}
