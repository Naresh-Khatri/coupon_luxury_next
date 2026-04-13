import { db, s } from "@/db";
import { and, asc, desc, eq } from "drizzle-orm";
import { cached, CACHE_TAGS } from "../cache";

export const getMainFeed = cached(
  async () => {
    const [featuredStores, categories, slides, featuredOffers] =
      await Promise.all([
        db.query.stores.findMany({
          where: and(
            eq(s.stores.active, true),
            eq(s.stores.featured, true)
          ),
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
            image: true,
            imgAlt: true,
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
          where: and(
            eq(s.offers.active, true),
            eq(s.offers.featured, true),
            eq(s.offers.offerType, "deal")
          ),
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
      ]);
    return { featuredStores, categories, slides, featuredOffers };
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
