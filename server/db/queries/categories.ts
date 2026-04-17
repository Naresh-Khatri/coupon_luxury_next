import { db, s } from "@/db";
import { and, asc, desc, eq, ilike, sql } from "drizzle-orm";
import { cached, CACHE_TAGS } from "../cache";

export const getPublicCategories = cached(
  async () =>
    db.query.categories.findMany({
      where: eq(s.categories.active, true),
      orderBy: asc(s.categories.categoryName),
      with: {
        offers: { columns: { id: true } },
      },
    }),
  ["categories:public"],
  [CACHE_TAGS.categories]
);

export const getCategoryBySlug = (slug: string, country?: string | null) =>
  cached(
    async () =>
      db.query.categories.findFirst({
        where: eq(s.categories.slug, slug),
        with: {
          subCategories: true,
          stores: {
            where: country
              ? and(eq(s.stores.active, true), eq(s.stores.country, country))
              : eq(s.stores.active, true),
            orderBy: asc(s.stores.storeName),
            columns: {
              id: true,
              storeName: true,
              slug: true,
              image: true,
              subCategoryId: true,
            },
          },
          offers: {
            where: country
              ? and(eq(s.offers.active, true), eq(s.offers.country, country))
              : eq(s.offers.active, true),
            orderBy: desc(s.offers.updatedAt),
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
          },
        },
      }),
    ["category:slug", slug, country ?? "all"],
    [CACHE_TAGS.categories, CACHE_TAGS.category(slug)]
  )();

export async function getAllCategories() {
  return db.query.categories.findMany({
    orderBy: asc(s.categories.categoryName),
    with: { subCategories: true },
  });
}

export async function getCategoryCount() {
  const [row] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(s.categories);
  return row?.count ?? 0;
}

export const getPublicSubCategories = cached(
  async (categoryId?: number) =>
    db.query.subCategories.findMany({
      where: categoryId ? eq(s.subCategories.categoryId, categoryId) : undefined,
      orderBy: asc(s.subCategories.subCategoryName),
    }),
  ["subcategories:public"],
  [CACHE_TAGS.subCategories]
);

export async function getAllSubCategories() {
  return db.query.subCategories.findMany({
    orderBy: asc(s.subCategories.subCategoryName),
    with: { category: { columns: { id: true, categoryName: true } } },
  });
}
