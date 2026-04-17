import { db, s } from "@/db";
import { and, asc, desc, eq } from "drizzle-orm";
import { cached, CACHE_TAGS } from "../cache";

export const getMainFeed = cached(
  async (country?: string | null) => {
    const storeWhere = country
      ? and(
          eq(s.stores.active, true),
          eq(s.stores.featured, true),
          eq(s.stores.country, country)
        )
      : and(eq(s.stores.active, true), eq(s.stores.featured, true));

    const dealsWhere = country
      ? and(
          eq(s.offers.active, true),
          eq(s.offers.featured, true),
          eq(s.offers.offerType, "deal"),
          eq(s.offers.country, country)
        )
      : and(
          eq(s.offers.active, true),
          eq(s.offers.featured, true),
          eq(s.offers.offerType, "deal")
        );

    const couponsWhere = country
      ? and(
          eq(s.offers.active, true),
          eq(s.offers.featured, true),
          eq(s.offers.offerType, "coupon"),
          eq(s.offers.country, country)
        )
      : and(
          eq(s.offers.active, true),
          eq(s.offers.featured, true),
          eq(s.offers.offerType, "coupon")
        );

    const storeOfTheMonthWhere = country
      ? and(
          eq(s.stores.active, true),
          eq(s.stores.storeOfTheMonth, true),
          eq(s.stores.country, country)
        )
      : and(eq(s.stores.active, true), eq(s.stores.storeOfTheMonth, true));

    const editorsPicksWhere = country
      ? and(
          eq(s.offers.active, true),
          eq(s.offers.featured, true),
          eq(s.offers.country, country)
        )
      : and(eq(s.offers.active, true), eq(s.offers.featured, true));

    const [
      featuredStores,
      categories,
      slides,
      featuredDeals,
      featuredCoupons,
      storeOfTheMonth,
      editorsPicks,
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
          with: { offers: { columns: { id: true } } },
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
      ]);
    return {
      featuredStores,
      categories,
      slides,
      featuredDeals,
      featuredCoupons,
      storeOfTheMonth,
      editorsPicks,
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
