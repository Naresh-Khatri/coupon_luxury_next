import { z } from "zod";
import { router, adminProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { db, s } from "@/db";
import { eq, desc, sql } from "drizzle-orm";
import {
  tableListInput,
  buildWhere,
  buildOrderBy,
  type ColumnMap,
} from "../list-helpers";
import { revalidate, CACHE_TAGS } from "@/server/db/cache";
import { slugify } from "@/lib/slugify";

const slugField = () =>
  z
    .string()
    .min(1)
    .transform((v) => slugify(v))
    .refine((v) => v.length > 0, "Slug must contain letters or numbers");
import { imagekit, deleteImageByUrl, deleteOrphanedImages, extractImageKitUrls } from "@/lib/imagekit";
import { getAllStores } from "@/server/db/queries/stores";
import {
  getAllOffers,
  getOfferCounts,
} from "@/server/db/queries/offers";
import {
  getAllCategories,
  getAllSubCategories,
  getCategoryCount,
} from "@/server/db/queries/categories";
import { getAllBlogs, getBlogCount } from "@/server/db/queries/blogs";
import { getAllSlides, getAllSubscribers } from "@/server/db/queries/misc";
import { getStoreCount } from "@/server/db/queries/stores";
import { getAllCountries } from "@/server/db/queries/countries";

// Optional URL that also accepts "" (coerced to null) so forms don't have to
// scrub empty inputs before submitting.
const optionalUrl = () =>
  z
    .union([z.string().url(), z.literal(""), z.null()])
    .nullish()
    .transform((v) => (v === "" || v == null ? null : v));

const optionalId = () =>
  z
    .union([z.number().int(), z.literal(0), z.null()])
    .nullish()
    .transform((v) => (v === 0 || v == null ? null : v));

const metaFields = {
  metaTitle: z.string().nullish(),
  metaDescription: z.string().nullish(),
  metaKeywords: z.string().nullish(),
  metaSchema: z.string().nullish(),
};

const storeInput = z.object({
  storeName: z.string().min(1),
  slug: slugField(),
  storeURL: z.string().url(),
  image: z.string().url(),
  pageHTML: z.string(),
  howToUse: z.array(z.string().min(1)).nullish(),
  faqs: z
    .array(z.object({ q: z.string().min(1), a: z.string().min(1) }))
    .nullish(),
  country: z.string().min(1),
  categoryId: z.number().int(),
  subCategoryId: z.number().int(),
  active: z.boolean().default(false),
  featured: z.boolean().default(false),
  storeOfTheMonth: z.boolean().default(false),
  ...metaFields,
});

const offerInput = z.object({
  title: z.string().min(1),
  slug: slugField(),
  description: z.string(),
  coverImg: optionalUrl(),
  TnC: z.string(),
  URL: z.string(),
  affURL: z.string(),
  offerType: z.enum(["deal", "coupon"]),
  discountType: z.string(),
  discountValue: z.number().int(),
  couponCode: z.string().nullish(),
  startDate: z.string(),
  endDate: z.string(),
  categoryId: z.number().int(),
  subCategoryId: z.number().int(),
  storeId: z.number().int(),
  active: z.boolean().default(false),
  featured: z.boolean().default(false),
  ...metaFields,
});

const categoryInput = z.object({
  categoryName: z.string().min(1),
  slug: slugField(),
  description: z.string().nullish(),
  pageHTML: z.string().nullish(),
  active: z.boolean().default(false),
  featured: z.boolean().default(false),
  ...metaFields,
});

const subCategoryInput = z.object({
  subCategoryName: z.string().min(1),
  slug: slugField(),
  categoryId: z.number().int(),
  description: z.string().nullish(),
  active: z.boolean().default(false),
  featured: z.boolean().default(false),
});

const blogInput = z.object({
  title: z.string().min(1),
  slug: slugField(),
  storeId: optionalId(),
  categoryId: optionalId(),
  imgAlt: z.string().nullish(),
  coverImg: optionalUrl(),
  thumbnailImg: optionalUrl(),
  smallDescription: z.string(),
  fullDescription: z.string(),
  blogType: z.string().default("normal"),
  active: z.boolean().default(false),
  featured: z.boolean().default(false),
  ...metaFields,
});

const countryInput = z.object({
  code: z
    .string()
    .min(2)
    .max(16)
    .regex(/^[a-z0-9-]+$/, "lowercase letters, digits and dashes only"),
  name: z.string().min(1),
  flagEmoji: z.string().nullish(),
  currency: z.string().nullish(),
  sortOrder: z.number().int().default(0),
  active: z.boolean().default(true),
});

const slideInput = z.object({
  title: z.string().min(1),
  order: z.number().int().optional(),
  link: z.string(),
  imgURL: z.string().url(),
  imgAlt: z.string(),
  active: z.boolean().default(false),
  featured: z.boolean().default(false),
  ...metaFields,
});

export const adminRouter = router({
  // ---------- Auth / session ----------
  me: adminProcedure.query(({ ctx }) => ctx.session.user),

  // ---------- Dashboard ----------
  stats: adminProcedure.query(async () => {
    const [stores, categories, blogs, offerCounts] = await Promise.all([
      getStoreCount(),
      getCategoryCount(),
      getBlogCount(),
      getOfferCounts(),
    ]);
    return { stores, categories, blogs, ...offerCounts };
  }),

  // ---------- ImageKit presigned auth ----------
  imagekitAuth: adminProcedure.query(() => imagekit.getAuthenticationParameters()),

  // ---------- Stores ----------
  stores: router({
    list: adminProcedure.query(() => getAllStores()),
    table: adminProcedure.input(tableListInput).query(async ({ input }) => {
      const map: ColumnMap = {
        storeName: { column: s.stores.storeName, kind: "text" },
        slug: { column: s.stores.slug, kind: "text" },
        country: { column: s.stores.country, kind: "text" },
        categoryId: { column: s.stores.categoryId, kind: "number" },
        subCategoryId: { column: s.stores.subCategoryId, kind: "number" },
        active: { column: s.stores.active, kind: "boolean" },
        featured: { column: s.stores.featured, kind: "boolean" },
        createdAt: { column: s.stores.createdAt, kind: "date" },
        updatedAt: { column: s.stores.updatedAt, kind: "date" },
      };
      const where = buildWhere(input, map, ["storeName", "slug", "country"]);
      const orderBy = buildOrderBy(input, map);
      const [rows, countRow] = await Promise.all([
        db.query.stores.findMany({
          where,
          orderBy: orderBy.length ? orderBy : [desc(s.stores.updatedAt)],
          limit: input.perPage,
          offset: (input.page - 1) * input.perPage,
          with: {
            category: { columns: { id: true, categoryName: true } },
            subCategory: { columns: { id: true, subCategoryName: true } },
          },
        }),
        db
          .select({ count: sql<number>`count(*)::int` })
          .from(s.stores)
          .where(where),
      ]);
      const total = countRow[0]?.count ?? 0;
      return { rows, pageCount: Math.max(1, Math.ceil(total / input.perPage)) };
    }),
    byId: adminProcedure
      .input(z.number().int())
      .query(({ input }) =>
        db.query.stores.findFirst({ where: eq(s.stores.id, input) })
      ),
    create: adminProcedure
      .input(storeInput)
      .mutation(async ({ input, ctx }) => {
        const [row] = await db
          .insert(s.stores)
          .values({ ...input, uid: ctx.session.user.id })
          .returning();
        revalidate(CACHE_TAGS.stores, CACHE_TAGS.main);
        return row;
      }),
    update: adminProcedure
      .input(z.object({ id: z.number().int(), data: storeInput.partial() }))
      .mutation(async ({ input }) => {
        const existing = await db.query.stores.findFirst({
          where: eq(s.stores.id, input.id),
        });
        if (!existing) throw new TRPCError({ code: "NOT_FOUND" });
        if (input.data.image && input.data.image !== existing.image) {
          await deleteImageByUrl(existing.image);
        }
        if (input.data.pageHTML !== undefined) {
          await deleteOrphanedImages(existing.pageHTML, input.data.pageHTML);
        }
        const [row] = await db
          .update(s.stores)
          .set({ ...input.data, updatedAt: new Date() })
          .where(eq(s.stores.id, input.id))
          .returning();
        revalidate(
          CACHE_TAGS.stores,
          CACHE_TAGS.store(existing.slug),
          CACHE_TAGS.main
        );
        return row;
      }),
    delete: adminProcedure
      .input(z.number().int())
      .mutation(async ({ input }) => {
        const existing = await db.query.stores.findFirst({
          where: eq(s.stores.id, input),
        });
        if (!existing) throw new TRPCError({ code: "NOT_FOUND" });
        await db.delete(s.stores).where(eq(s.stores.id, input));
        await Promise.all([
          deleteImageByUrl(existing.image),
          ...extractImageKitUrls(existing.pageHTML).map((u) => deleteImageByUrl(u)),
        ]);
        revalidate(
          CACHE_TAGS.stores,
          CACHE_TAGS.store(existing.slug),
          CACHE_TAGS.main
        );
        return { ok: true };
      }),
  }),

  // ---------- Offers ----------
  offers: router({
    list: adminProcedure.query(() => getAllOffers()),
    table: adminProcedure.input(tableListInput).query(async ({ input }) => {
      const map: ColumnMap = {
        title: { column: s.offers.title, kind: "text" },
        slug: { column: s.offers.slug, kind: "text" },
        offerType: { column: s.offers.offerType, kind: "text" },
        discountType: { column: s.offers.discountType, kind: "text" },
        couponCode: { column: s.offers.couponCode, kind: "text" },
        storeId: { column: s.offers.storeId, kind: "number" },
        categoryId: { column: s.offers.categoryId, kind: "number" },
        subCategoryId: { column: s.offers.subCategoryId, kind: "number" },
        discountValue: { column: s.offers.discountValue, kind: "number" },
        active: { column: s.offers.active, kind: "boolean" },
        featured: { column: s.offers.featured, kind: "boolean" },
        createdAt: { column: s.offers.createdAt, kind: "date" },
        updatedAt: { column: s.offers.updatedAt, kind: "date" },
      };
      const where = buildWhere(input, map, [
        "title",
        "slug",
        "couponCode",
      ]);
      const orderBy = buildOrderBy(input, map);
      const [rows, countRow] = await Promise.all([
        db.query.offers.findMany({
          where,
          orderBy: orderBy.length ? orderBy : [desc(s.offers.updatedAt)],
          limit: input.perPage,
          offset: (input.page - 1) * input.perPage,
          with: {
            store: { columns: { id: true, storeName: true, slug: true } },
          },
        }),
        db
          .select({ count: sql<number>`count(*)::int` })
          .from(s.offers)
          .where(where),
      ]);
      const total = countRow[0]?.count ?? 0;
      return { rows, pageCount: Math.max(1, Math.ceil(total / input.perPage)) };
    }),
    byId: adminProcedure
      .input(z.number().int())
      .query(({ input }) =>
        db.query.offers.findFirst({ where: eq(s.offers.id, input) })
      ),
    create: adminProcedure
      .input(offerInput)
      .mutation(async ({ input, ctx }) => {
        const [row] = await db
          .insert(s.offers)
          .values({ ...input, uid: ctx.session.user.id })
          .returning();
        revalidate(CACHE_TAGS.offers, CACHE_TAGS.main);
        return row;
      }),
    update: adminProcedure
      .input(z.object({ id: z.number().int(), data: offerInput.partial() }))
      .mutation(async ({ input }) => {
        const existing = await db.query.offers.findFirst({
          where: eq(s.offers.id, input.id),
        });
        if (!existing) throw new TRPCError({ code: "NOT_FOUND" });
        if (
          input.data.coverImg !== undefined &&
          input.data.coverImg !== existing.coverImg
        ) {
          await deleteImageByUrl(existing.coverImg);
        }
        const [row] = await db
          .update(s.offers)
          .set({ ...input.data, updatedAt: new Date() })
          .where(eq(s.offers.id, input.id))
          .returning();
        revalidate(
          CACHE_TAGS.offers,
          CACHE_TAGS.offer(existing.slug),
          CACHE_TAGS.main
        );
        return row;
      }),
    delete: adminProcedure
      .input(z.number().int())
      .mutation(async ({ input }) => {
        const existing = await db.query.offers.findFirst({
          where: eq(s.offers.id, input),
        });
        if (!existing) throw new TRPCError({ code: "NOT_FOUND" });
        await db.delete(s.offers).where(eq(s.offers.id, input));
        await deleteImageByUrl(existing.coverImg);
        revalidate(
          CACHE_TAGS.offers,
          CACHE_TAGS.offer(existing.slug),
          CACHE_TAGS.main
        );
        return { ok: true };
      }),
    verify: adminProcedure
      .input(z.number().int())
      .mutation(async ({ input }) => {
        const existing = await db.query.offers.findFirst({
          where: eq(s.offers.id, input),
        });
        if (!existing) throw new TRPCError({ code: "NOT_FOUND" });
        const now = new Date();
        const [row] = await db
          .update(s.offers)
          .set({ verifiedAt: now, updatedAt: now })
          .where(eq(s.offers.id, input))
          .returning();
        revalidate(
          CACHE_TAGS.offers,
          CACHE_TAGS.offer(existing.slug),
          CACHE_TAGS.store(existing.storeId ? `${existing.storeId}` : "_"),
          CACHE_TAGS.main
        );
        return row;
      }),
    verifyAllForStore: adminProcedure
      .input(z.number().int())
      .mutation(async ({ input }) => {
        const now = new Date();
        await db
          .update(s.offers)
          .set({ verifiedAt: now, updatedAt: now })
          .where(eq(s.offers.storeId, input));
        revalidate(CACHE_TAGS.offers, CACHE_TAGS.stores, CACHE_TAGS.main);
        return { ok: true, verifiedAt: now };
      }),
  }),

  // ---------- Categories ----------
  categories: router({
    list: adminProcedure.query(() => getAllCategories()),
    table: adminProcedure.input(tableListInput).query(async ({ input }) => {
      const map: ColumnMap = {
        categoryName: { column: s.categories.categoryName, kind: "text" },
        slug: { column: s.categories.slug, kind: "text" },
        active: { column: s.categories.active, kind: "boolean" },
        featured: { column: s.categories.featured, kind: "boolean" },
        createdAt: { column: s.categories.createdAt, kind: "date" },
        updatedAt: { column: s.categories.updatedAt, kind: "date" },
      };
      const where = buildWhere(input, map, ["categoryName", "slug"]);
      const orderBy = buildOrderBy(input, map);
      const [rows, countRow] = await Promise.all([
        db.query.categories.findMany({
          where,
          orderBy: orderBy.length ? orderBy : [desc(s.categories.updatedAt)],
          limit: input.perPage,
          offset: (input.page - 1) * input.perPage,
        }),
        db
          .select({ count: sql<number>`count(*)::int` })
          .from(s.categories)
          .where(where),
      ]);
      const total = countRow[0]?.count ?? 0;
      return { rows, pageCount: Math.max(1, Math.ceil(total / input.perPage)) };
    }),
    byId: adminProcedure
      .input(z.number().int())
      .query(({ input }) =>
        db.query.categories.findFirst({ where: eq(s.categories.id, input) })
      ),
    create: adminProcedure
      .input(categoryInput)
      .mutation(async ({ input, ctx }) => {
        const [row] = await db
          .insert(s.categories)
          .values({ ...input, uid: ctx.session.user.id })
          .returning();
        revalidate(CACHE_TAGS.categories, CACHE_TAGS.main);
        return row;
      }),
    update: adminProcedure
      .input(z.object({ id: z.number().int(), data: categoryInput.partial() }))
      .mutation(async ({ input }) => {
        const existing = await db.query.categories.findFirst({
          where: eq(s.categories.id, input.id),
        });
        if (!existing) throw new TRPCError({ code: "NOT_FOUND" });
        if (input.data.pageHTML !== undefined) {
          await deleteOrphanedImages(existing.pageHTML, input.data.pageHTML);
        }
        const [row] = await db
          .update(s.categories)
          .set({ ...input.data, updatedAt: new Date() })
          .where(eq(s.categories.id, input.id))
          .returning();
        revalidate(
          CACHE_TAGS.categories,
          CACHE_TAGS.category(existing.slug),
          CACHE_TAGS.main
        );
        return row;
      }),
    delete: adminProcedure
      .input(z.number().int())
      .mutation(async ({ input }) => {
        const existing = await db.query.categories.findFirst({
          where: eq(s.categories.id, input),
        });
        if (!existing) throw new TRPCError({ code: "NOT_FOUND" });
        await db.delete(s.categories).where(eq(s.categories.id, input));
        await Promise.all(
          extractImageKitUrls(existing.pageHTML).map((u) => deleteImageByUrl(u)),
        );
        revalidate(
          CACHE_TAGS.categories,
          CACHE_TAGS.category(existing.slug),
          CACHE_TAGS.main
        );
        return { ok: true };
      }),
  }),

  // ---------- SubCategories ----------
  subCategories: router({
    list: adminProcedure.query(() => getAllSubCategories()),
    table: adminProcedure.input(tableListInput).query(async ({ input }) => {
      const map: ColumnMap = {
        subCategoryName: { column: s.subCategories.subCategoryName, kind: "text" },
        slug: { column: s.subCategories.slug, kind: "text" },
        categoryId: { column: s.subCategories.categoryId, kind: "number" },
        active: { column: s.subCategories.active, kind: "boolean" },
        featured: { column: s.subCategories.featured, kind: "boolean" },
        createdAt: { column: s.subCategories.createdAt, kind: "date" },
        updatedAt: { column: s.subCategories.updatedAt, kind: "date" },
      };
      const where = buildWhere(input, map, ["subCategoryName", "slug"]);
      const orderBy = buildOrderBy(input, map);
      const [rows, countRow] = await Promise.all([
        db.query.subCategories.findMany({
          where,
          orderBy: orderBy.length ? orderBy : [desc(s.subCategories.updatedAt)],
          limit: input.perPage,
          offset: (input.page - 1) * input.perPage,
          with: { category: { columns: { id: true, categoryName: true } } },
        }),
        db
          .select({ count: sql<number>`count(*)::int` })
          .from(s.subCategories)
          .where(where),
      ]);
      const total = countRow[0]?.count ?? 0;
      return { rows, pageCount: Math.max(1, Math.ceil(total / input.perPage)) };
    }),
    byId: adminProcedure
      .input(z.number().int())
      .query(({ input }) =>
        db.query.subCategories.findFirst({
          where: eq(s.subCategories.id, input),
        })
      ),
    create: adminProcedure
      .input(subCategoryInput)
      .mutation(async ({ input, ctx }) => {
        const [row] = await db
          .insert(s.subCategories)
          .values({ ...input, uid: ctx.session.user.id })
          .returning();
        revalidate(CACHE_TAGS.subCategories, CACHE_TAGS.categories);
        return row;
      }),
    update: adminProcedure
      .input(
        z.object({ id: z.number().int(), data: subCategoryInput.partial() })
      )
      .mutation(async ({ input }) => {
        const [row] = await db
          .update(s.subCategories)
          .set({ ...input.data, updatedAt: new Date() })
          .where(eq(s.subCategories.id, input.id))
          .returning();
        revalidate(CACHE_TAGS.subCategories, CACHE_TAGS.categories);
        return row;
      }),
    delete: adminProcedure
      .input(z.number().int())
      .mutation(async ({ input }) => {
        await db.delete(s.subCategories).where(eq(s.subCategories.id, input));
        revalidate(CACHE_TAGS.subCategories, CACHE_TAGS.categories);
        return { ok: true };
      }),
  }),

  // ---------- Blogs ----------
  blogs: router({
    list: adminProcedure.query(() => getAllBlogs()),
    table: adminProcedure.input(tableListInput).query(async ({ input }) => {
      const map: ColumnMap = {
        title: { column: s.blogs.title, kind: "text" },
        slug: { column: s.blogs.slug, kind: "text" },
        smallDescription: { column: s.blogs.smallDescription, kind: "text" },
        blogType: { column: s.blogs.blogType, kind: "text" },
        storeId: { column: s.blogs.storeId, kind: "number" },
        active: { column: s.blogs.active, kind: "boolean" },
        featured: { column: s.blogs.featured, kind: "boolean" },
        createdAt: { column: s.blogs.createdAt, kind: "date" },
        updatedAt: { column: s.blogs.updatedAt, kind: "date" },
      };
      const where = buildWhere(input, map, [
        "title",
        "slug",
        "smallDescription",
      ]);
      const orderBy = buildOrderBy(input, map);
      const [rows, countRow] = await Promise.all([
        db.query.blogs.findMany({
          where,
          orderBy: orderBy.length ? orderBy : [desc(s.blogs.updatedAt)],
          limit: input.perPage,
          offset: (input.page - 1) * input.perPage,
          with: { store: { columns: { id: true, storeName: true } } },
        }),
        db
          .select({ count: sql<number>`count(*)::int` })
          .from(s.blogs)
          .where(where),
      ]);
      const total = countRow[0]?.count ?? 0;
      return { rows, pageCount: Math.max(1, Math.ceil(total / input.perPage)) };
    }),
    byId: adminProcedure
      .input(z.number().int())
      .query(({ input }) =>
        db.query.blogs.findFirst({ where: eq(s.blogs.id, input) })
      ),
    create: adminProcedure
      .input(blogInput)
      .mutation(async ({ input, ctx }) => {
        const [row] = await db
          .insert(s.blogs)
          .values({ ...input, uid: ctx.session.user.id })
          .returning();
        revalidate(CACHE_TAGS.blogs);
        return row;
      }),
    update: adminProcedure
      .input(z.object({ id: z.number().int(), data: blogInput.partial() }))
      .mutation(async ({ input }) => {
        const existing = await db.query.blogs.findFirst({
          where: eq(s.blogs.id, input.id),
        });
        if (!existing) throw new TRPCError({ code: "NOT_FOUND" });
        if (input.data.coverImg && input.data.coverImg !== existing.coverImg) {
          await deleteImageByUrl(existing.coverImg);
        }
        if (
          input.data.thumbnailImg &&
          input.data.thumbnailImg !== existing.thumbnailImg
        ) {
          await deleteImageByUrl(existing.thumbnailImg);
        }
        if (input.data.fullDescription !== undefined) {
          await deleteOrphanedImages(existing.fullDescription, input.data.fullDescription);
        }
        const [row] = await db
          .update(s.blogs)
          .set({ ...input.data, updatedAt: new Date() })
          .where(eq(s.blogs.id, input.id))
          .returning();
        revalidate(CACHE_TAGS.blogs, CACHE_TAGS.blog(existing.slug));
        return row;
      }),
    delete: adminProcedure
      .input(z.number().int())
      .mutation(async ({ input }) => {
        const existing = await db.query.blogs.findFirst({
          where: eq(s.blogs.id, input),
        });
        if (!existing) throw new TRPCError({ code: "NOT_FOUND" });
        await db.delete(s.blogs).where(eq(s.blogs.id, input));
        await Promise.all([
          deleteImageByUrl(existing.coverImg),
          deleteImageByUrl(existing.thumbnailImg),
          ...extractImageKitUrls(existing.fullDescription).map((u) => deleteImageByUrl(u)),
        ]);
        revalidate(CACHE_TAGS.blogs, CACHE_TAGS.blog(existing.slug));
        return { ok: true };
      }),
  }),

  // ---------- Slides ----------
  slides: router({
    list: adminProcedure.query(() => getAllSlides()),
    table: adminProcedure.input(tableListInput).query(async ({ input }) => {
      const map: ColumnMap = {
        title: { column: s.slides.title, kind: "text" },
        order: { column: s.slides.order, kind: "number" },
        link: { column: s.slides.link, kind: "text" },
        active: { column: s.slides.active, kind: "boolean" },
        featured: { column: s.slides.featured, kind: "boolean" },
        createdAt: { column: s.slides.createdAt, kind: "date" },
        updatedAt: { column: s.slides.updatedAt, kind: "date" },
      };
      const where = buildWhere(input, map, ["title", "link"]);
      const orderBy = buildOrderBy(input, map);
      const [rows, countRow] = await Promise.all([
        db.query.slides.findMany({
          where,
          orderBy: orderBy.length ? orderBy : [desc(s.slides.order)],
          limit: input.perPage,
          offset: (input.page - 1) * input.perPage,
        }),
        db
          .select({ count: sql<number>`count(*)::int` })
          .from(s.slides)
          .where(where),
      ]);
      const total = countRow[0]?.count ?? 0;
      return { rows, pageCount: Math.max(1, Math.ceil(total / input.perPage)) };
    }),
    byId: adminProcedure
      .input(z.number().int())
      .query(({ input }) =>
        db.query.slides.findFirst({ where: eq(s.slides.id, input) })
      ),
    create: adminProcedure
      .input(slideInput)
      .mutation(async ({ input, ctx }) => {
        let order = input.order;
        if (order === undefined) {
          const [maxRow] = await db
            .select({ max: sql<number>`coalesce(max(${s.slides.order}), 0)::int` })
            .from(s.slides);
          order = (maxRow?.max ?? 0) + 1;
        }
        const [row] = await db
          .insert(s.slides)
          .values({ ...input, order, uid: ctx.session.user.id })
          .returning();
        revalidate(CACHE_TAGS.slides, CACHE_TAGS.main);
        return row;
      }),
    update: adminProcedure
      .input(z.object({ id: z.number().int(), data: slideInput.partial() }))
      .mutation(async ({ input }) => {
        const existing = await db.query.slides.findFirst({
          where: eq(s.slides.id, input.id),
        });
        if (!existing) throw new TRPCError({ code: "NOT_FOUND" });
        if (input.data.imgURL && input.data.imgURL !== existing.imgURL) {
          await deleteImageByUrl(existing.imgURL);
        }
        const [row] = await db
          .update(s.slides)
          .set({ ...input.data, updatedAt: new Date() })
          .where(eq(s.slides.id, input.id))
          .returning();
        revalidate(CACHE_TAGS.slides, CACHE_TAGS.main);
        return row;
      }),
    delete: adminProcedure
      .input(z.number().int())
      .mutation(async ({ input }) => {
        const existing = await db.query.slides.findFirst({
          where: eq(s.slides.id, input),
        });
        if (!existing) throw new TRPCError({ code: "NOT_FOUND" });
        await db.delete(s.slides).where(eq(s.slides.id, input));
        await deleteImageByUrl(existing.imgURL);
        revalidate(CACHE_TAGS.slides, CACHE_TAGS.main);
        return { ok: true };
      }),
    reorder: adminProcedure
      .input(z.array(z.object({ id: z.number().int(), order: z.number().int() })))
      .mutation(async ({ input }) => {
        await Promise.all(
          input.map((it) =>
            db
              .update(s.slides)
              .set({ order: it.order, updatedAt: new Date() })
              .where(eq(s.slides.id, it.id))
          )
        );
        revalidate(CACHE_TAGS.slides, CACHE_TAGS.main);
        return { ok: true };
      }),
  }),

  // ---------- Countries ----------
  countries: router({
    list: adminProcedure.query(() => getAllCountries()),
    byCode: adminProcedure
      .input(z.string())
      .query(({ input }) =>
        db.query.countries.findFirst({ where: eq(s.countries.code, input) })
      ),
    create: adminProcedure
      .input(countryInput)
      .mutation(async ({ input }) => {
        const [row] = await db
          .insert(s.countries)
          .values(input)
          .returning();
        revalidate(CACHE_TAGS.countries);
        return row;
      }),
    update: adminProcedure
      .input(
        z.object({ code: z.string(), data: countryInput.partial() })
      )
      .mutation(async ({ input }) => {
        const existing = await db.query.countries.findFirst({
          where: eq(s.countries.code, input.code),
        });
        if (!existing) throw new TRPCError({ code: "NOT_FOUND" });
        const [row] = await db
          .update(s.countries)
          .set({ ...input.data, updatedAt: new Date() })
          .where(eq(s.countries.code, input.code))
          .returning();
        revalidate(CACHE_TAGS.countries, CACHE_TAGS.stores);
        return row;
      }),
    delete: adminProcedure
      .input(z.string())
      .mutation(async ({ input }) => {
        const [inUseStore] = await db
          .select({ count: sql<number>`count(*)::int` })
          .from(s.stores)
          .where(eq(s.stores.country, input));
        if ((inUseStore?.count ?? 0) > 0) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Country is still referenced by stores.",
          });
        }
        await db.delete(s.countries).where(eq(s.countries.code, input));
        revalidate(CACHE_TAGS.countries);
        return { ok: true };
      }),
  }),

  // ---------- Subscribers ----------
  subscribers: router({
    list: adminProcedure.query(() => getAllSubscribers()),
    table: adminProcedure.input(tableListInput).query(async ({ input }) => {
      const map: ColumnMap = {
        email: { column: s.subscribers.email, kind: "text" },
        phone: { column: s.subscribers.phone, kind: "text" },
        createdAt: { column: s.subscribers.createdAt, kind: "date" },
      };
      const where = buildWhere(input, map, ["email", "phone"]);
      const orderBy = buildOrderBy(input, map);
      const [rows, countRow] = await Promise.all([
        db
          .select()
          .from(s.subscribers)
          .where(where)
          .orderBy(...(orderBy.length ? orderBy : [desc(s.subscribers.createdAt)]))
          .limit(input.perPage)
          .offset((input.page - 1) * input.perPage),
        db
          .select({ count: sql<number>`count(*)::int` })
          .from(s.subscribers)
          .where(where),
      ]);
      const total = countRow[0]?.count ?? 0;
      return { rows, pageCount: Math.max(1, Math.ceil(total / input.perPage)) };
    }),
    delete: adminProcedure
      .input(z.number().int())
      .mutation(async ({ input }) => {
        await db.delete(s.subscribers).where(eq(s.subscribers.id, input));
        revalidate(CACHE_TAGS.subscribers);
        return { ok: true };
      }),
  }),
});
