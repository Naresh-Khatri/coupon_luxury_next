import { z } from "zod";
import { router, adminProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { db, s } from "@/db";
import { eq, desc } from "drizzle-orm";
import { revalidate, CACHE_TAGS } from "@/server/db/cache";
import { imagekit, deleteImageByUrl } from "@/lib/imagekit";
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
  slug: z.string().min(1),
  storeURL: z.string().url(),
  image: z.string().url(),
  pageHTML: z.string(),
  country: z.string().min(1),
  categoryId: z.number().int(),
  subCategoryId: z.number().int(),
  active: z.boolean().default(false),
  featured: z.boolean().default(false),
  ...metaFields,
});

const offerInput = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  description: z.string(),
  TnC: z.string(),
  URL: z.string(),
  affURL: z.string(),
  offerType: z.enum(["deal", "coupon"]),
  discountType: z.string(),
  discountValue: z.number().int(),
  couponCode: z.string().nullish(),
  startDate: z.string(),
  endDate: z.string(),
  country: z.string(),
  categoryId: z.number().int(),
  subCategoryId: z.number().int(),
  storeId: z.number().int(),
  active: z.boolean().default(false),
  featured: z.boolean().default(false),
  ...metaFields,
});

const categoryInput = z.object({
  categoryName: z.string().min(1),
  slug: z.string().min(1),
  image: z.string().url(),
  imgAlt: z.string(),
  description: z.string().nullish(),
  pageHTML: z.string().nullish(),
  active: z.boolean().default(false),
  featured: z.boolean().default(false),
  ...metaFields,
});

const subCategoryInput = z.object({
  subCategoryName: z.string().min(1),
  slug: z.string().min(1),
  categoryId: z.number().int(),
  description: z.string().nullish(),
  active: z.boolean().default(false),
  featured: z.boolean().default(false),
});

const blogInput = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  storeId: optionalId(),
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

const slideInput = z.object({
  title: z.string().min(1),
  order: z.number().int(),
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
        await deleteImageByUrl(existing.image);
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
        revalidate(
          CACHE_TAGS.offers,
          CACHE_TAGS.offer(existing.slug),
          CACHE_TAGS.main
        );
        return { ok: true };
      }),
  }),

  // ---------- Categories ----------
  categories: router({
    list: adminProcedure.query(() => getAllCategories()),
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
        if (input.data.image && input.data.image !== existing.image) {
          await deleteImageByUrl(existing.image);
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
        await deleteImageByUrl(existing.image);
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
        ]);
        revalidate(CACHE_TAGS.blogs, CACHE_TAGS.blog(existing.slug));
        return { ok: true };
      }),
  }),

  // ---------- Slides ----------
  slides: router({
    list: adminProcedure.query(() => getAllSlides()),
    byId: adminProcedure
      .input(z.number().int())
      .query(({ input }) =>
        db.query.slides.findFirst({ where: eq(s.slides.id, input) })
      ),
    create: adminProcedure
      .input(slideInput)
      .mutation(async ({ input, ctx }) => {
        const [row] = await db
          .insert(s.slides)
          .values({ ...input, uid: ctx.session.user.id })
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
  }),

  // ---------- Subscribers ----------
  subscribers: router({
    list: adminProcedure.query(() => getAllSubscribers()),
    delete: adminProcedure
      .input(z.number().int())
      .mutation(async ({ input }) => {
        await db.delete(s.subscribers).where(eq(s.subscribers.id, input));
        revalidate(CACHE_TAGS.subscribers);
        return { ok: true };
      }),
  }),

  // ---------- Background video ----------
  video: router({
    get: adminProcedure.query(async () => {
      const [row] = await db.select().from(s.backgroundVideo).limit(1);
      return row ?? null;
    }),
    set: adminProcedure
      .input(z.object({ url: z.string().url() }))
      .mutation(async ({ input }) => {
        const [existing] = await db.select().from(s.backgroundVideo).limit(1);
        if (existing) {
          await deleteImageByUrl(existing.url);
          const [row] = await db
            .update(s.backgroundVideo)
            .set({ url: input.url, updatedAt: new Date() })
            .where(eq(s.backgroundVideo.id, existing.id))
            .returning();
          revalidate(CACHE_TAGS.video);
          return row;
        }
        const [row] = await db
          .insert(s.backgroundVideo)
          .values({ url: input.url })
          .returning();
        revalidate(CACHE_TAGS.video);
        return row;
      }),
  }),
});
