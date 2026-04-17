CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "blog" (
	"id" serial PRIMARY KEY NOT NULL,
	"uid" text NOT NULL,
	"title" text NOT NULL,
	"slug" text NOT NULL,
	"storeId" integer,
	"imgAlt" text,
	"coverImg" text,
	"thumbnailImg" text,
	"smallDescription" text NOT NULL,
	"fullDescription" text NOT NULL,
	"featured" boolean DEFAULT false NOT NULL,
	"active" boolean DEFAULT false NOT NULL,
	"blogType" text DEFAULT 'normal',
	"metaTitle" text,
	"metaDescription" text,
	"metaKeywords" text,
	"metaSchema" text,
	"createdAt" timestamp (3) DEFAULT now() NOT NULL,
	"updatedAt" timestamp (3) DEFAULT now() NOT NULL,
	CONSTRAINT "blog_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "category" (
	"id" serial PRIMARY KEY NOT NULL,
	"uid" text NOT NULL,
	"slug" text NOT NULL,
	"categoryName" text NOT NULL,
	"image" text NOT NULL,
	"imgAlt" text NOT NULL,
	"description" text,
	"pageHTML" text,
	"featured" boolean DEFAULT false NOT NULL,
	"active" boolean DEFAULT false NOT NULL,
	"metaTitle" text,
	"metaDescription" text,
	"metaKeywords" text,
	"metaSchema" text,
	"createdAt" timestamp (3) DEFAULT now() NOT NULL,
	"updatedAt" timestamp (3) DEFAULT now() NOT NULL,
	CONSTRAINT "category_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "offer" (
	"id" serial PRIMARY KEY NOT NULL,
	"uid" text NOT NULL,
	"slug" text NOT NULL,
	"categoryId" integer NOT NULL,
	"subCategoryId" integer NOT NULL,
	"storeId" integer NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"coverImg" text,
	"TnC" text NOT NULL,
	"URL" text NOT NULL,
	"affURL" text NOT NULL,
	"offerType" text NOT NULL,
	"discountType" text NOT NULL,
	"discountValue" integer NOT NULL,
	"couponCode" text DEFAULT '',
	"startDate" text NOT NULL,
	"endDate" text NOT NULL,
	"country" text NOT NULL,
	"active" boolean DEFAULT false NOT NULL,
	"featured" boolean DEFAULT false NOT NULL,
	"metaTitle" text,
	"metaDescription" text,
	"metaKeywords" text,
	"metaSchema" text,
	"createdAt" timestamp (3) DEFAULT now() NOT NULL,
	"updatedAt" timestamp (3) DEFAULT now() NOT NULL,
	CONSTRAINT "offer_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	"impersonated_by" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "slide" (
	"id" serial PRIMARY KEY NOT NULL,
	"uid" text NOT NULL,
	"title" text NOT NULL,
	"order" integer NOT NULL,
	"link" text NOT NULL,
	"imgURL" text NOT NULL,
	"imgAlt" text NOT NULL,
	"active" boolean DEFAULT false NOT NULL,
	"featured" boolean DEFAULT false NOT NULL,
	"metaTitle" text,
	"metaDescription" text,
	"metaKeywords" text,
	"metaSchema" text,
	"createdAt" timestamp (3) DEFAULT now() NOT NULL,
	"updatedAt" timestamp (3) DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "store" (
	"id" serial PRIMARY KEY NOT NULL,
	"uid" text NOT NULL,
	"categoryId" integer NOT NULL,
	"subCategoryId" integer NOT NULL,
	"storeName" text NOT NULL,
	"storeURL" text NOT NULL,
	"image" text NOT NULL,
	"pageHTML" text NOT NULL,
	"country" text NOT NULL,
	"slug" text NOT NULL,
	"active" boolean DEFAULT false NOT NULL,
	"featured" boolean DEFAULT false NOT NULL,
	"metaTitle" text,
	"metaDescription" text,
	"metaKeywords" text,
	"metaSchema" text,
	"createdAt" timestamp (3) DEFAULT now() NOT NULL,
	"updatedAt" timestamp (3) DEFAULT now() NOT NULL,
	CONSTRAINT "store_storeURL_unique" UNIQUE("storeURL"),
	CONSTRAINT "store_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "sub_category" (
	"id" serial PRIMARY KEY NOT NULL,
	"uid" text NOT NULL,
	"categoryId" integer NOT NULL,
	"slug" text NOT NULL,
	"subCategoryName" text NOT NULL,
	"description" text,
	"active" boolean DEFAULT false NOT NULL,
	"featured" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp (3) DEFAULT now() NOT NULL,
	"updatedAt" timestamp (3) DEFAULT now() NOT NULL,
	CONSTRAINT "sub_category_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "subscriber" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"phone" text,
	"createdAt" timestamp (3) DEFAULT now() NOT NULL,
	"updatedAt" timestamp (3) DEFAULT now() NOT NULL,
	CONSTRAINT "subscriber_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"role" text,
	"banned" boolean,
	"ban_reason" text,
	"ban_expires" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "blog" ADD CONSTRAINT "blog_storeId_store_id_fk" FOREIGN KEY ("storeId") REFERENCES "public"."store"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "offer" ADD CONSTRAINT "offer_categoryId_category_id_fk" FOREIGN KEY ("categoryId") REFERENCES "public"."category"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "offer" ADD CONSTRAINT "offer_subCategoryId_sub_category_id_fk" FOREIGN KEY ("subCategoryId") REFERENCES "public"."sub_category"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "offer" ADD CONSTRAINT "offer_storeId_store_id_fk" FOREIGN KEY ("storeId") REFERENCES "public"."store"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "store" ADD CONSTRAINT "store_categoryId_category_id_fk" FOREIGN KEY ("categoryId") REFERENCES "public"."category"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "store" ADD CONSTRAINT "store_subCategoryId_sub_category_id_fk" FOREIGN KEY ("subCategoryId") REFERENCES "public"."sub_category"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sub_category" ADD CONSTRAINT "sub_category_categoryId_category_id_fk" FOREIGN KEY ("categoryId") REFERENCES "public"."category"("id") ON DELETE cascade ON UPDATE no action;