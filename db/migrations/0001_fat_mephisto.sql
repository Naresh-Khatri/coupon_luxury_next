CREATE TABLE "country" (
	"code" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"flagEmoji" text,
	"currency" text,
	"sortOrder" integer DEFAULT 0 NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp (3) DEFAULT now() NOT NULL,
	"updatedAt" timestamp (3) DEFAULT now() NOT NULL
);
--> statement-breakpoint
UPDATE "store" SET "country" = lower(trim("country")) WHERE "country" IS NOT NULL;
--> statement-breakpoint
UPDATE "offer" SET "country" = lower(trim("country")) WHERE "country" IS NOT NULL;
--> statement-breakpoint
INSERT INTO "country" ("code", "name")
SELECT DISTINCT "country", initcap("country")
FROM "store"
WHERE "country" IS NOT NULL AND trim("country") <> ''
ON CONFLICT ("code") DO NOTHING;
--> statement-breakpoint
INSERT INTO "country" ("code", "name")
SELECT DISTINCT "country", initcap("country")
FROM "offer"
WHERE "country" IS NOT NULL AND trim("country") <> ''
ON CONFLICT ("code") DO NOTHING;
--> statement-breakpoint
INSERT INTO "country" ("code", "name", "sortOrder") VALUES ('global', 'Global', -1)
ON CONFLICT ("code") DO NOTHING;
