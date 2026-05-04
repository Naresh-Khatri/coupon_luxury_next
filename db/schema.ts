import {
  pgTable,
  serial,
  text,
  integer,
  boolean,
  timestamp,
  uniqueIndex,
  jsonb,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ---------- Better-auth tables (with admin plugin fields) ----------

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  image: text("image"),
  role: text("role"),
  banned: boolean("banned"),
  banReason: text("ban_reason"),
  banExpires: timestamp("ban_expires"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  impersonatedBy: text("impersonated_by"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ---------- Domain tables (mirror of Prisma schema) ----------

export const categories = pgTable("category", {
  id: serial("id").primaryKey(),
  uid: text("uid").notNull(),
  slug: text("slug").notNull().unique(),
  categoryName: text("categoryName").notNull(),
  description: text("description"),
  pageHTML: text("pageHTML"),
  featured: boolean("featured").notNull().default(false),
  active: boolean("active").notNull().default(false),
  metaTitle: text("metaTitle"),
  metaDescription: text("metaDescription"),
  metaKeywords: text("metaKeywords"),
  metaSchema: text("metaSchema"),
  createdAt: timestamp("createdAt", { precision: 3 }).notNull().defaultNow(),
  updatedAt: timestamp("updatedAt", { precision: 3 }).notNull().defaultNow(),
});

export const subCategories = pgTable("sub_category", {
  id: serial("id").primaryKey(),
  uid: text("uid").notNull(),
  categoryId: integer("categoryId")
    .notNull()
    .references(() => categories.id, { onDelete: "cascade" }),
  slug: text("slug").notNull().unique(),
  subCategoryName: text("subCategoryName").notNull(),
  description: text("description"),
  active: boolean("active").notNull().default(false),
  featured: boolean("featured").notNull().default(false),
  createdAt: timestamp("createdAt", { precision: 3 }).notNull().defaultNow(),
  updatedAt: timestamp("updatedAt", { precision: 3 }).notNull().defaultNow(),
});

export const stores = pgTable("store", {
  id: serial("id").primaryKey(),
  uid: text("uid").notNull(),
  categoryId: integer("categoryId")
    .notNull()
    .references(() => categories.id, { onDelete: "cascade" }),
  subCategoryId: integer("subCategoryId")
    .notNull()
    .references(() => subCategories.id, { onDelete: "cascade" }),
  storeName: text("storeName").notNull(),
  storeURL: text("storeURL").notNull().unique(),
  image: text("image").notNull(),
  pageHTML: text("pageHTML").notNull(),
  howToUse: jsonb("howToUse").$type<string[]>(),
  faqs: jsonb("faqs").$type<Array<{ q: string; a: string }>>(),
  country: text("country").notNull(),
  slug: text("slug").notNull().unique(),
  active: boolean("active").notNull().default(false),
  featured: boolean("featured").notNull().default(false),
  storeOfTheMonth: boolean("storeOfTheMonth").notNull().default(false),
  metaTitle: text("metaTitle"),
  metaDescription: text("metaDescription"),
  metaKeywords: text("metaKeywords"),
  metaSchema: text("metaSchema"),
  createdAt: timestamp("createdAt", { precision: 3 }).notNull().defaultNow(),
  updatedAt: timestamp("updatedAt", { precision: 3 }).notNull().defaultNow(),
});

export const offers = pgTable("offer", {
  id: serial("id").primaryKey(),
  uid: text("uid").notNull(),
  slug: text("slug").notNull().unique(),
  categoryId: integer("categoryId")
    .notNull()
    .references(() => categories.id, { onDelete: "cascade" }),
  subCategoryId: integer("subCategoryId")
    .notNull()
    .references(() => subCategories.id, { onDelete: "cascade" }),
  storeId: integer("storeId")
    .notNull()
    .references(() => stores.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description").notNull(),
  coverImg: text("coverImg"),
  TnC: text("TnC").notNull(),
  URL: text("URL").notNull(),
  affURL: text("affURL").notNull(),
  offerType: text("offerType").notNull(),
  discountType: text("discountType").notNull(),
  discountValue: integer("discountValue").notNull(),
  couponCode: text("couponCode").default(""),
  startDate: text("startDate").notNull(),
  endDate: text("endDate").notNull(),
  uses: integer("uses").notNull().default(0),
  verifiedAt: timestamp("verifiedAt", { precision: 3 }),
  active: boolean("active").notNull().default(false),
  featured: boolean("featured").notNull().default(false),
  trending: boolean("trending").notNull().default(false),
  metaTitle: text("metaTitle"),
  metaDescription: text("metaDescription"),
  metaKeywords: text("metaKeywords"),
  metaSchema: text("metaSchema"),
  createdAt: timestamp("createdAt", { precision: 3 }).notNull().defaultNow(),
  updatedAt: timestamp("updatedAt", { precision: 3 }).notNull().defaultNow(),
});

export const blogs = pgTable("blog", {
  id: serial("id").primaryKey(),
  uid: text("uid").notNull(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  storeId: integer("storeId").references(() => stores.id, {
    onDelete: "cascade",
  }),
  categoryId: integer("categoryId").references(() => categories.id, {
    onDelete: "set null",
  }),
  imgAlt: text("imgAlt"),
  coverImg: text("coverImg"),
  thumbnailImg: text("thumbnailImg"),
  smallDescription: text("smallDescription").notNull(),
  fullDescription: text("fullDescription").notNull(),
  featured: boolean("featured").notNull().default(false),
  active: boolean("active").notNull().default(false),
  blogType: text("blogType").default("normal"),
  metaTitle: text("metaTitle"),
  metaDescription: text("metaDescription"),
  metaKeywords: text("metaKeywords"),
  metaSchema: text("metaSchema"),
  createdAt: timestamp("createdAt", { precision: 3 }).notNull().defaultNow(),
  updatedAt: timestamp("updatedAt", { precision: 3 }).notNull().defaultNow(),
});

export const slides = pgTable("slide", {
  id: serial("id").primaryKey(),
  uid: text("uid").notNull(),
  title: text("title").notNull(),
  order: integer("order").notNull(),
  link: text("link").notNull(),
  imgURL: text("imgURL").notNull(),
  imgAlt: text("imgAlt").notNull(),
  active: boolean("active").notNull().default(false),
  featured: boolean("featured").notNull().default(false),
  metaTitle: text("metaTitle"),
  metaDescription: text("metaDescription"),
  metaKeywords: text("metaKeywords"),
  metaSchema: text("metaSchema"),
  createdAt: timestamp("createdAt", { precision: 3 }).notNull().defaultNow(),
  updatedAt: timestamp("updatedAt", { precision: 3 }).notNull().defaultNow(),
});

export const subscribers = pgTable("subscriber", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  phone: text("phone"),
  createdAt: timestamp("createdAt", { precision: 3 }).notNull().defaultNow(),
  updatedAt: timestamp("updatedAt", { precision: 3 }).notNull().defaultNow(),
});

export const offerClicks = pgTable("offer_click", {
  id: serial("id").primaryKey(),
  offerId: integer("offerId")
    .notNull()
    .references(() => offers.id, { onDelete: "cascade" }),
  country: text("country"),
  createdAt: timestamp("createdAt", { precision: 3 }).notNull().defaultNow(),
});

export const countries = pgTable("country", {
  code: text("code").primaryKey(),
  name: text("name").notNull(),
  flagEmoji: text("flagEmoji"),
  currency: text("currency"),
  sortOrder: integer("sortOrder").notNull().default(0),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("createdAt", { precision: 3 }).notNull().defaultNow(),
  updatedAt: timestamp("updatedAt", { precision: 3 }).notNull().defaultNow(),
});

// ---------- Relations ----------

export const categoriesRelations = relations(categories, ({ many }) => ({
  subCategories: many(subCategories),
  stores: many(stores),
  offers: many(offers),
}));

export const subCategoriesRelations = relations(
  subCategories,
  ({ one, many }) => ({
    category: one(categories, {
      fields: [subCategories.categoryId],
      references: [categories.id],
    }),
    stores: many(stores),
    offers: many(offers),
  })
);

export const storesRelations = relations(stores, ({ one, many }) => ({
  category: one(categories, {
    fields: [stores.categoryId],
    references: [categories.id],
  }),
  subCategory: one(subCategories, {
    fields: [stores.subCategoryId],
    references: [subCategories.id],
  }),
  offers: many(offers),
  blogs: many(blogs),
}));

export const offersRelations = relations(offers, ({ one }) => ({
  category: one(categories, {
    fields: [offers.categoryId],
    references: [categories.id],
  }),
  subCategory: one(subCategories, {
    fields: [offers.subCategoryId],
    references: [subCategories.id],
  }),
  store: one(stores, { fields: [offers.storeId], references: [stores.id] }),
}));

export const blogsRelations = relations(blogs, ({ one }) => ({
  store: one(stores, { fields: [blogs.storeId], references: [stores.id] }),
  category: one(categories, {
    fields: [blogs.categoryId],
    references: [categories.id],
  }),
}));

export type Store = typeof stores.$inferSelect;
export type Offer = typeof offers.$inferSelect;
export type Category = typeof categories.$inferSelect;
export type SubCategory = typeof subCategories.$inferSelect;
export type Blog = typeof blogs.$inferSelect;
export type Slide = typeof slides.$inferSelect;
export type Subscriber = typeof subscribers.$inferSelect;
export type Country = typeof countries.$inferSelect;
export type OfferClick = typeof offerClicks.$inferSelect;
