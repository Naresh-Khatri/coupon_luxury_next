import { db, s } from "@/db";
import { and, asc, desc, eq, inArray, sql } from "drizzle-orm";
import { cached, CACHE_TAGS } from "../cache";

export const getMainFeed = cached(
  async (country?: string | null) => {
    const countryStoreIds = country
      ? inArray(
          s.offers.storeId,
          db
            .select({ id: s.stores.id })
            .from(s.stores)
            .where(eq(s.stores.country, country))
        )
      : undefined;

    const storeWhere = country
      ? and(
          eq(s.stores.active, true),
          eq(s.stores.featured, true),
          eq(s.stores.country, country)
        )
      : and(eq(s.stores.active, true), eq(s.stores.featured, true));

    const dealsWhere = and(
      eq(s.offers.active, true),
      eq(s.offers.featured, true),
      eq(s.offers.offerType, "deal"),
      ...(countryStoreIds ? [countryStoreIds] : [])
    );

    const couponsWhere = and(
      eq(s.offers.active, true),
      eq(s.offers.featured, true),
      eq(s.offers.offerType, "coupon"),
      ...(countryStoreIds ? [countryStoreIds] : [])
    );

    const storeOfTheMonthWhere = country
      ? and(
          eq(s.stores.active, true),
          eq(s.stores.storeOfTheMonth, true),
          eq(s.stores.country, country)
        )
      : and(eq(s.stores.active, true), eq(s.stores.storeOfTheMonth, true));

    const editorsPicksWhere = and(
      eq(s.offers.active, true),
      eq(s.offers.featured, true),
      ...(countryStoreIds ? [countryStoreIds] : [])
    );

    const trendingWhere = and(
      eq(s.offers.active, true),
      eq(s.offers.trending, true),
      ...(countryStoreIds ? [countryStoreIds] : [])
    );

    const popularStoresWhere = country
      ? and(eq(s.stores.active, true), eq(s.stores.country, country))
      : eq(s.stores.active, true);

    const [
      featuredStores,
      categories,
      slides,
      featuredDeals,
      featuredCoupons,
      storeOfTheMonth,
      editorsPicks,
      trendingOffers,
      popularStores,
    ] =
      await Promise.all([
        db.query.stores.findMany({
          where: storeWhere,
          orderBy: desc(s.stores.updatedAt),
          columns: {
            id: true,
            storeName: true,
            slug: true,
            storeURL: true,
            image: true,
          },
          with: {
            category: {
              columns: { id: true, categoryName: true, slug: true },
            },
            subCategory: {
              columns: { id: true, subCategoryName: true, slug: true },
            },
          },
        }),
        db.query.categories.findMany({
          where: eq(s.categories.active, true),
          orderBy: asc(s.categories.categoryName),
          columns: {
            id: true,
            categoryName: true,
            slug: true,
            featured: true,
          },
          with: {
            offers: {
              columns: { id: true },
              where: eq(s.offers.active, true),
            },
          },
        }),
        db.query.slides.findMany({
          where: eq(s.slides.active, true),
          orderBy: asc(s.slides.order),
          columns: {
            id: true,
            title: true,
            imgURL: true,
            imgAlt: true,
            link: true,
            order: true,
          },
        }),
        db.query.offers.findMany({
          where: dealsWhere,
          orderBy: desc(s.offers.updatedAt),
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
            coverImg: true,
          },
          with: {
            store: {
              columns: {
                id: true,
                image: true,
                storeName: true,
                slug: true,
              },
            },
          },
        }),
        db.query.offers.findMany({
          where: couponsWhere,
          orderBy: desc(s.offers.updatedAt),
          limit: 60,
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
            coverImg: true,
          },
          with: {
            store: {
              columns: {
                id: true,
                image: true,
                storeName: true,
                slug: true,
              },
            },
          },
        }),
        db.query.stores.findFirst({
          where: storeOfTheMonthWhere,
          orderBy: desc(s.stores.updatedAt),
          columns: {
            id: true,
            storeName: true,
            slug: true,
            image: true,
            storeURL: true,
          },
          with: {
            category: {
              columns: { id: true, categoryName: true, slug: true },
            },
            offers: {
              where: eq(s.offers.active, true),
              columns: {
                id: true,
                offerType: true,
                discountType: true,
                discountValue: true,
              },
            },
          },
        }),
        db.query.offers.findMany({
          where: editorsPicksWhere,
          orderBy: [desc(s.offers.uses), desc(s.offers.updatedAt)],
          limit: 12,
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
            coverImg: true,
          },
          with: {
            store: {
              columns: {
                id: true,
                image: true,
                storeName: true,
                slug: true,
              },
            },
          },
        }),
        db.query.offers.findMany({
          where: trendingWhere,
          orderBy: [desc(s.offers.uses), desc(s.offers.updatedAt)],
          limit: 8,
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
            coverImg: true,
          },
          with: {
            store: {
              columns: {
                id: true,
                image: true,
                storeName: true,
                slug: true,
              },
            },
          },
        }),
        db
          .select({
            id: s.stores.id,
            storeName: s.stores.storeName,
            slug: s.stores.slug,
            image: s.stores.image,
            offerCount: sql<number>`count(${s.offers.id})::int`,
          })
          .from(s.stores)
          .leftJoin(
            s.offers,
            and(
              eq(s.offers.storeId, s.stores.id),
              eq(s.offers.active, true)
            )
          )
          .where(popularStoresWhere)
          .groupBy(s.stores.id)
          .orderBy(asc(s.stores.storeName))
          .limit(60),
      ]);
    return {
      featuredStores,
      categories,
      slides,
      featuredDeals,
      featuredCoupons,
      storeOfTheMonth,
      editorsPicks,
      trendingOffers,
      popularStores,
    };
  },
  ["main:feed"],
  [
    CACHE_TAGS.main,
    CACHE_TAGS.stores,
    CACHE_TAGS.categories,
    CACHE_TAGS.slides,
    CACHE_TAGS.offers,
  ]
);
